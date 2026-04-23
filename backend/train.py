"""
Train ML models and save artifacts for fraud detection.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, roc_curve, confusion_matrix
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_DIR, "data_parts", "part1.csv")
ARTIFACTS_PATH = os.path.join(PROJECT_DIR, "artifacts")
CHARTS_PATH = os.path.join(PROJECT_DIR, "charts")

os.makedirs(ARTIFACTS_PATH, exist_ok=True)
os.makedirs(CHARTS_PATH, exist_ok=True)

FEATURE_COLS = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9",
                "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18",
                "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27",
                "V28", "Amount"]


def load_and_preprocess_data():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna()
    
    df = df.sample(frac=0.25, random_state=42)
    print(f"Using 25% of data: {len(df)} transactions")
    
    X = df.drop(['Class', 'Time'], axis=1).copy()
    y = df['Class'].astype(int)
    
    scaler = StandardScaler()
    X['Amount'] = scaler.fit_transform(X[['Amount']])
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    fraud_X = X_train[y_train == 1]
    fraud_y = y_train[y_train == 1]
    legit_count = (y_train == 0).sum()
    oversample_factor = int(legit_count / len(fraud_X)) - 1 if len(fraud_X) > 0 else 0
    
    X_train_bal = pd.concat([X_train] + [fraud_X] * oversample_factor, ignore_index=True)
    y_train_bal = pd.concat([y_train] + [fraud_y] * oversample_factor, ignore_index=True)
    
    return X_train_bal, X_test, y_train_bal, y_test, scaler


def train_models(X_train, X_test, y_train, y_test):
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
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        
        results[name] = {
            "model": model,
            "y_pred": y_pred,
            "y_prob": y_prob,
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred, zero_division=0),
            "recall": recall_score(y_test, y_pred),
            "f1": f1_score(y_test, y_pred),
            "roc_auc": roc_auc_score(y_test, y_prob),
            "cm": confusion_matrix(y_test, y_pred),
        }
    
    return results


def save_artifacts(results, scaler):
    print("Saving artifacts...")
    joblib.dump(scaler, os.path.join(ARTIFACTS_PATH, "scaler.pkl"))
    
    for name, r in results.items():
        safe_name = name.lower().replace(" ", "_")
        joblib.dump(r["model"], os.path.join(ARTIFACTS_PATH, f"{safe_name}.pkl"))
    
    metrics = {}
    for name, r in results.items():
        metrics[name] = {
            "accuracy": round(r["accuracy"], 4),
            "precision": round(r["precision"], 4),
            "recall": round(r["recall"], 4),
            "f1": round(r["f1"], 4),
            "roc_auc": round(r["roc_auc"], 4),
        }
    
    with open(os.path.join(ARTIFACTS_PATH, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
    
    best_f1 = max(results, key=lambda n: results[n]["f1"])
    best_auc = max(results, key=lambda n: results[n]["roc_auc"])
    
    summary = {
        "best_f1_model": best_f1,
        "best_f1_score": round(results[best_f1]["f1"], 4),
        "best_auc_model": best_auc,
        "best_auc_score": round(results[best_auc]["roc_auc"], 4),
        "recommended_model": "Random Forest",
    }
    
    with open(os.path.join(ARTIFACTS_PATH, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    
    if "Random Forest" in results:
        rf_importances = pd.Series(
            results["Random Forest"]["model"].feature_importances_,
            index=FEATURE_COLS
        ).sort_values(ascending=False).head(15).to_dict()
        
        feature_importance = {k: round(v, 6) for k, v in rf_importances.items()}
        
        with open(os.path.join(ARTIFACTS_PATH, "feature_importance.json"), "w") as f:
            json.dump(feature_importance, f, indent=2)


def generate_charts(results, y_test, X_test):
    print("Generating charts...")
    COLORS = {
        "Logistic Regression": "#E74C3C",
        "Decision Tree": "#3498DB",
        "Random Forest": "#2ECC71",
        "Gradient Boosting": "#9B59B6",
    }
    
    df = pd.read_csv(DATA_PATH)
    df = df.dropna()
    
    fig, ax = plt.subplots(figsize=(7, 5))
    counts = df['Class'].value_counts()
    bars = ax.bar(['Legitimate (0)', 'Fraud (1)'], [counts[0], counts[1]],
                  color=['#3498DB', '#E74C3C'], edgecolor='white', linewidth=1.5, width=0.5)
    for bar, val in zip(bars, [counts[0], counts[1]]):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 200,
                f'{val:,}', ha='center', fontsize=12, fontweight='bold')
    ax.set_title('Class Distribution — Legitimate vs Fraud', fontsize=14, fontweight='bold')
    ax.set_ylabel('Number of Transactions', fontsize=11)
    ax.set_facecolor('#F8F9FA')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '01_class_distribution.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    for i, (cls, label, color) in enumerate([(0, 'Legitimate', '#3498DB'), (1, 'Fraud', '#E74C3C')]):
        subset = df[df['Class'] == cls]['Amount']
        axes[i].hist(subset, bins=50, color=color, alpha=0.8, edgecolor='white')
        axes[i].set_title(f'Transaction Amount — {label}', fontsize=12, fontweight='bold')
        axes[i].set_xlabel('Amount', fontsize=10)
        axes[i].set_ylabel('Count', fontsize=10)
        axes[i].set_facecolor('#F8F9FA')
        axes[i].spines['top'].set_visible(False)
        axes[i].spines['right'].set_visible(False)
    plt.suptitle('Amount Distribution by Transaction Type', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '02_amount_distribution.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    top_feats = ['V1', 'V2', 'V3', 'V4', 'V7', 'V10', 'V11', 'V12', 'V14', 'V17', 'Amount', 'Class']
    corr = df[top_feats].corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(corr, mask=mask, cmap='RdBu_r', center=0, annot=True, fmt='.2f',
                linewidths=0.5, ax=ax, annot_kws={'size': 8})
    ax.set_title('Feature Correlation Matrix', fontsize=13, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '03_correlation_heatmap.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    fig, ax = plt.subplots(figsize=(8, 6))
    for name, r in results.items():
        fpr, tpr, _ = roc_curve(y_test, r['y_prob'])
        ax.plot(fpr, tpr, label=f"{name}  (AUC = {r['roc_auc']:.3f})",
                linewidth=2.5, color=COLORS[name])
    ax.plot([0, 1], [0, 1], '--', color='gray', linewidth=1, alpha=0.7, label='Random Classifier')
    ax.set_xlabel('False Positive Rate', fontsize=11)
    ax.set_ylabel('True Positive Rate (Recall)', fontsize=11)
    ax.set_title('ROC Curves — All Models', fontsize=14, fontweight='bold')
    ax.legend(loc='lower right', fontsize=10)
    ax.set_facecolor('#F8F9FA')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '04_roc_curves.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    fig, axes = plt.subplots(2, 2, figsize=(10, 8))
    for ax, (name, r) in zip(axes.flatten(), results.items()):
        cm = r['cm']
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax,
                    xticklabels=['Legit', 'Fraud'], yticklabels=['Legit', 'Fraud'],
                    linewidths=1.5, linecolor='white', annot_kws={'size': 14, 'weight': 'bold'})
        ax.set_title(name, fontsize=11, fontweight='bold', color=COLORS[name])
        ax.set_xlabel('Predicted', fontsize=9)
        ax.set_ylabel('Actual', fontsize=9)
    plt.suptitle('Confusion Matrices', fontsize=14, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '05_confusion_matrices.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    metrics_list = ['accuracy', 'precision', 'recall', 'f1', 'roc_auc']
    m_labels = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']
    x = np.arange(len(metrics_list))
    width = 0.18
    fig, ax = plt.subplots(figsize=(11, 6))
    for i, (name, r) in enumerate(results.items()):
        vals = [r[m] for m in metrics_list]
        ax.bar(x + i*width, vals, width, label=name, color=COLORS[name], alpha=0.9, edgecolor='white')
    ax.set_xticks(x + width * 1.5)
    ax.set_xticklabels(m_labels, fontsize=10)
    ax.set_ylabel('Score (0 – 1)', fontsize=11)
    ax.set_ylim(0, 1.12)
    ax.set_title('Model Performance Comparison', fontsize=14, fontweight='bold')
    ax.legend(fontsize=9, loc='lower right')
    ax.set_facecolor('#F8F9FA')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '06_metrics_comparison.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    rf_model = results['Random Forest']['model']
    feat_imp = pd.Series(rf_model.feature_importances_, index=FEATURE_COLS).sort_values(ascending=False).head(15)
    fig, ax = plt.subplots(figsize=(9, 6))
    feat_imp[::-1].plot(kind='barh', ax=ax, color='#1ABC9C', edgecolor='white')
    ax.set_title('Top 15 Feature Importances — Random Forest', fontsize=13, fontweight='bold')
    ax.set_xlabel('Importance Score', fontsize=11)
    ax.set_facecolor('#F8F9FA')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '07_feature_importance.png'), dpi=150, bbox_inches='tight')
    plt.close()
    
    names = list(results.keys())
    f1s = [results[n]['f1'] for n in names]
    aucs = [results[n]['roc_auc'] for n in names]
    clrs = [COLORS[n] for n in names]
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    for ax, vals, title, ylim in [(ax1, f1s, 'F1-Score', (0, 1.15)), (ax2, aucs, 'ROC-AUC', (0.85, 1.05))]:
        bars = ax.bar(names, vals, color=clrs, edgecolor='white', linewidth=1.5, width=0.5)
        for bar, val in zip(bars, vals):
            ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.01, f'{val:.3f}', ha='center', fontsize=11, fontweight='bold')
        ax.set_title(f'{title} by Model', fontsize=12, fontweight='bold')
        ax.set_ylim(*ylim)
        ax.set_facecolor('#F8F9FA')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.tick_params(axis='x', rotation=12)
    plt.suptitle('Key Metrics Summary', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_PATH, '08_f1_auc_summary.png'), dpi=150, bbox_inches='tight')
    plt.close()


def main():
    print("=" * 60)
    print("TRAINING MODELS")
    print("=" * 60)
    
    X_train, X_test, y_train, y_test, scaler = load_and_preprocess_data()
    results = train_models(X_train, X_test, y_train, y_test)
    save_artifacts(results, scaler)
    generate_charts(results, y_test, X_test)
    
    print("=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()