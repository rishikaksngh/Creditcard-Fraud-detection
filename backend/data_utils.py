import pandas as pd
import numpy as np
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data_parts", "part1.csv")
ARTIFACTS_PATH = os.path.join(os.path.dirname(__file__), "..", "artifacts")
CHARTS_PATH = os.path.join(os.path.dirname(__file__), "..", "charts")

os.makedirs(ARTIFACTS_PATH, exist_ok=True)
os.makedirs(CHARTS_PATH, exist_ok=True)


def load_data():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna()
    return df


def get_feature_columns():
    return ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9",
            "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18",
            "V19", "V20", "V21", "V22", "V23", "V24", "V25", "V26", "V27",
            "V28", "Amount"]


def preprocess(df, scaler=None, fit=False):
    X = df.drop(["Class", "Time"], axis=1).copy()
    y = df["Class"].astype(int)

    if fit:
        scaler = __import__("sklearn.preprocessing", fromlist=["StandardScaler"]).StandardScaler()
        X["Amount"] = scaler.fit_transform(X[["Amount"]])
    else:
        X["Amount"] = scaler.transform(X[["Amount"]])

    return X, y, scaler