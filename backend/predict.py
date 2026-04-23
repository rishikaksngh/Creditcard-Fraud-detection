"""
Prediction module for fraud detection.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
ARTIFACTS_PATH = os.path.join(PROJECT_DIR, "artifacts")
DATA_PATH = os.path.join(PROJECT_DIR, "data_parts", "part1.csv")

FEATURE_COLS = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9",
                "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18",
                "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27",
                "V28", "Amount"]


class FraudPredictor:
    def __init__(self):
        self.scaler = joblib.load(os.path.join(ARTIFACTS_PATH, "scaler.pkl"))
        self.models = {
            "Logistic Regression": joblib.load(os.path.join(ARTIFACTS_PATH, "logistic_regression.pkl")),
            "Decision Tree": joblib.load(os.path.join(ARTIFACTS_PATH, "decision_tree.pkl")),
            "Random Forest": joblib.load(os.path.join(ARTIFACTS_PATH, "random_forest.pkl")),
            "Gradient Boosting": joblib.load(os.path.join(ARTIFACTS_PATH, "gradient_boosting.pkl")),
        }
        
        with open(os.path.join(ARTIFACTS_PATH, "metrics.json"), "r") as f:
            self.metrics = json.load(f)
        
        self.recommended_model = "Random Forest"
        
        df = pd.read_csv(DATA_PATH)
        df = df.dropna()
        self.feature_count = len(FEATURE_COLS)
        self.total_transactions = len(df)
        self.fraud_count = int((df['Class'] == 1).sum())
        self.legitimate_count = int((df['Class'] == 0).sum())
        self.fraud_percentage = round(self.fraud_count / self.total_transactions * 100, 3)
        
        self.test_data = df.drop(['Class', 'Time'], axis=1).copy()
        self.test_data['Amount'] = self.scaler.transform(self.test_data[['Amount']])
        self.test_labels = df['Class'].astype(int)
    
    def predict_single(self, transaction: dict) -> dict:
        features = []
        for col in FEATURE_COLS:
            if col == "Time":
                features.append(transaction.get("Time", 0))
            else:
                features.append(transaction.get(col, 0))
        
        X = pd.DataFrame([features], columns=FEATURE_COLS)
        X['Amount'] = self.scaler.transform(X[['Amount']])
        
        model = self.models[self.recommended_model]
        prob = model.predict_proba(X)[0][1]
        pred = model.predict(X)[0]
        
        risk_level = "LOW"
        if prob >= 0.8:
            risk_level = "CRITICAL"
        elif prob >= 0.6:
            risk_level = "HIGH"
        elif prob >= 0.4:
            risk_level = "MEDIUM"
        
        reasons = []
        if prob > 0.5:
            reasons.append(f"High fraud probability ({prob:.1%})")
        if abs(transaction.get("V14", 0)) > 3:
            reasons.append("Unusual V14 feature value")
        if abs(transaction.get("V17", 0)) > 3:
            reasons.append("Abnormal V17 pattern")
        if transaction.get("Amount", 0) > 200:
            reasons.append("High transaction amount")
        
        return {
            "predicted_class": int(pred),
            "predicted_label": "FRAUDULENT" if pred == 1 else "LEGITIMATE",
            "fraud_probability": round(prob, 4),
            "confidence": round(max(prob, 1 - prob), 4),
            "model_used": self.recommended_model,
            "risk_level": risk_level,
            "short_reason": "; ".join(reasons) if reasons else "Normal transaction pattern"
        }
    
    def predict_batch(self, df: pd.DataFrame) -> dict:
        required_cols = set(FEATURE_COLS) | {"Time"}
        if not required_cols.issubset(set(df.columns)):
            missing = required_cols - set(df.columns)
            raise ValueError(f"Missing columns: {missing}")
        
        X = df[FEATURE_COLS].copy()
        X['Amount'] = self.scaler.transform(X[['Amount']])
        
        model = self.models[self.recommended_model]
        probs = model.predict_proba(X)[:, 1]
        preds = model.predict(X)
        
        records = []
        for i, (pred, prob) in enumerate(zip(preds, probs)):
            records.append({
                "row_index": i,
                "predicted_class": int(pred),
                "predicted_label": "FRAUDULENT" if pred == 1 else "LEGITIMATE",
                "fraud_probability": round(prob, 4)
            })
        
        total_rows = len(df)
        flagged_rows = int(sum(preds))
        fraud_rate = round(flagged_rows / total_rows * 100, 2) if total_rows > 0 else 0
        
        return {
            "total_rows": total_rows,
            "flagged_rows": flagged_rows,
            "fraud_rate": fraud_rate,
            "records": records
        }
    
    def get_sample_transaction(self) -> dict:
        fraud_samples = self.test_data[self.test_labels == 1].head(1)
        if len(fraud_samples) == 0:
            fraud_samples = self.test_data.head(1)
        
        sample = fraud_samples.iloc[0].to_dict()
        sample["Time"] = float(np.random.uniform(0, 172792))
        
        return {k: float(v) for k, v in sample.items()}


_predictor = None


def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = FraudPredictor()
    return _predictor


def predict_single(transaction: dict) -> dict:
    return get_predictor().predict_single(transaction)


def predict_batch(df: pd.DataFrame) -> dict:
    return get_predictor().predict_batch(df)


def get_sample_transaction() -> dict:
    return get_predictor().get_sample_transaction()