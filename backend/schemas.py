from pydantic import BaseModel, Field
from typing import Literal

class TransactionInput(BaseModel):
    Time: float = Field(..., description="Seconds elapsed since first transaction")
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float = Field(..., description="Transaction amount (raw, will be scaled)")


class PredictionResponse(BaseModel):
    predicted_class: int
    predicted_label: Literal["LEGITIMATE", "FRAUDULENT"]
    fraud_probability: float
    confidence: float
    model_used: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    short_reason: str


class BatchResultRecord(BaseModel):
    row_index: int
    predicted_class: int
    predicted_label: str
    fraud_probability: float


class BatchPredictResponse(BaseModel):
    total_rows: int
    flagged_rows: int
    fraud_rate: float
    records: list[BatchResultRecord]
    result_csv_path: str