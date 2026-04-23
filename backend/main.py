"""
FastAPI backend for fraud detection frontend integration.
"""
import os
import json
import joblib
import pandas as pd
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Literal
from io import StringIO

from schemas import TransactionInput, PredictionResponse, BatchResultRecord, BatchPredictResponse
from predict import predict_single, predict_batch, get_sample_transaction

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
ARTIFACTS_PATH = os.path.join(PROJECT_DIR, "artifacts")
CHARTS_PATH = os.path.join(PROJECT_DIR, "charts")
DATA_PATH = os.path.join(PROJECT_DIR, "data_parts", "part1.csv")

app = FastAPI(title="Fraud Detection API", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(CHARTS_PATH):
    app.mount("/charts", StaticFiles(directory=CHARTS_PATH), name="charts")
if os.path.exists(ARTIFACTS_PATH):
    app.mount("/artifacts", StaticFiles(directory=ARTIFACTS_PATH), name="artifacts")

FRONTEND_PATH = os.path.join(PROJECT_DIR, "dist")
if os.path.exists(FRONTEND_PATH):
    app.mount("", StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend")


@app.get("/api/summary")
def get_summary():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna()
    
    with open(os.path.join(ARTIFACTS_PATH, "summary.json"), "r") as f:
        summary = json.load(f)
    
    return {
        "total_transactions": int(len(df)),
        "legitimate_transactions": int((df['Class'] == 0).sum()),
        "fraud_transactions": int((df['Class'] == 1).sum()),
        "fraud_percentage": round((df['Class'] == 1).sum() / len(df) * 100, 3),
        "feature_count": 29,
        "best_f1_model": summary.get("best_f1_model", "Random Forest"),
        "best_auc_model": summary.get("best_auc_model", "Gradient Boosting"),
        "recommended_model": summary.get("recommended_model", "Random Forest")
    }


@app.get("/api/metrics")
def get_metrics():
    with open(os.path.join(ARTIFACTS_PATH, "metrics.json"), "r") as f:
        metrics = json.load(f)
    return metrics


@app.get("/api/charts")
def get_charts():
    chart_files = [
        "01_class_distribution.png",
        "02_amount_distribution.png",
        "03_correlation_heatmap.png",
        "04_roc_curves.png",
        "05_confusion_matrices.png",
        "06_metrics_comparison.png",
        "07_feature_importance.png",
        "08_f1_auc_summary.png",
    ]
    
    charts = {}
    for i, name in enumerate(chart_files):
        key = name.replace(".png", "").split("_", 1)[1].replace("_", " ").title()
        charts[key.lower().replace(" ", "_")] = f"/charts/{name}"
    
    return charts


@app.get("/api/feature-importance")
def get_feature_importance():
    with open(os.path.join(ARTIFACTS_PATH, "feature_importance.json"), "r") as f:
        data = json.load(f)
    return data


@app.get("/api/sample-transaction")
def get_sample():
    return get_sample_transaction()


@app.post("/api/predict", response_model=PredictionResponse)
def predict(transaction: TransactionInput):
    try:
        data = transaction.model_dump()
        result = predict_single(data)
        
        short_reason = result.get("short_reason", "")
        if len(short_reason) > 100:
            short_reason = short_reason[:97] + "..."
        
        return PredictionResponse(
            predicted_class=result["predicted_class"],
            predicted_label=result["predicted_label"],
            fraud_probability=result["fraud_probability"],
            confidence=result["confidence"],
            model_used=result["model_used"],
            risk_level=result["risk_level"],
            short_reason=short_reason
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/batch-predict", response_model=BatchPredictResponse)
async def batch_predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    try:
        contents = await file.read()
        csv_text = contents.decode('utf-8')
        df = pd.read_csv(StringIO(csv_text))
        
        result = predict_batch(df)
        
        return BatchPredictResponse(
            total_rows=result["total_rows"],
            flagged_rows=result["flagged_rows"],
            fraud_rate=result["fraud_rate"],
            records=[BatchResultRecord(**r) for r in result["records"]],
            result_csv_path=""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)