"""
Save trained models and artifacts.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)

os.makedirs("artifacts", exist_ok=True)

print("Loading data...")
df = pd.read_csv("data_parts/part1.csv")
df = df.dropna()

X = df.drop(['Class', 'Time'], axis=1).copy()
y = df['Class'].astype(int)

scaler = StandardScaler()
X['Amount'] = scaler.fit_transform(X[['Amount']])
joblib.dump(scaler, "artifacts/scaler.pkl")
print("  Saved: scaler.pkl")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

fraud_X = X_train[y_train == 1]
fraud_y = y_train[y_train == 1]
legit_count = (y_train == 0).sum()
oversample_factor = int(legit_count / len(fraud_X)) - 1

X_train_bal = pd.concat([X_train] + [fraud_X] * oversample_factor, ignore_index=True)
y_train_bal = pd.concat([y_train] + [fraud_y] * oversample_factor, ignore_index=True)

models = {
    "Logistic Regression": LogisticRegression(
        max_iter=1000, random_state=42, class_weight='balanced', solver='lbfgs'
    ),
    "Decision Tree": DecisionTreeClassifier(
        max_depth=10, random_state=42, class_weight='balanced', min_samples_split=10
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=100, random_state=42, class_weight='balanced', n_jobs=-1
    ),
    "Gradient Boosting": GradientBoostingClassifier(
        n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42, subsample=0.8
    ),
}

results = {}
FEATURE_COLS = list(X.columns)

for name, model in models.items():
    print(f"Training: {name}...")
    model.fit(X_train_bal, y_train_bal)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    safe_name = name.lower().replace(" ", "_")
    joblib.dump(model, f"artifacts/{safe_name}.pkl")
    print(f"  Saved: {safe_name}.pkl")

    results[name] = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall": recall_score(y_test, y_pred),
        "f1": f1_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_prob),
    }

metrics = {}
for name, r in results.items():
    metrics[name] = {
        "accuracy": round(r["accuracy"], 4),
        "precision": round(r["precision"], 4),
        "recall": round(r["recall"], 4),
        "f1": round(r["f1"], 4),
        "roc_auc": round(r["roc_auc"], 4),
    }

with open("artifacts/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)
print("  Saved: metrics.json")

best_f1 = max(results, key=lambda n: results[n]["f1"])
best_auc = max(results, key=lambda n: results[n]["roc_auc"])

summary = {
    "total_transactions": int(len(df)),
    "legitimate_transactions": int((df['Class'] == 0).sum()),
    "fraud_transactions": int((df['Class'] == 1).sum()),
    "fraud_percentage": round((df['Class'] == 1).sum() / len(df) * 100, 3),
    "feature_count": 29,
    "best_f1_model": best_f1,
    "best_f1_score": round(results[best_f1]["f1"], 4),
    "best_auc_model": best_auc,
    "best_auc_score": round(results[best_auc]["roc_auc"], 4),
    "recommended_model": "Random Forest",
}

with open("artifacts/summary.json", "w") as f:
    json.dump(summary, f, indent=2)
print("  Saved: summary.json")

rf = joblib.load("artifacts/random_forest.pkl")
feat_imp = pd.Series(rf.feature_importances_, index=FEATURE_COLS).sort_values(ascending=False).head(15).to_dict()
feat_imp = {k: round(v, 6) for k, v in feat_imp.items()}

with open("artifacts/feature_importance.json", "w") as f:
    json.dump(feat_imp, f, indent=2)
print("  Saved: feature_importance.json")

print("\nAll artifacts saved!")