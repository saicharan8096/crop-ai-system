"""
notebooks/train_yield_model.py
================================
Train an XGBoost model to predict crop yield (kg/hectare).

HOW TO USE:
-----------
1. Download the crop yield dataset from Kaggle:
   https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset

2. Place it at: data/raw/crop_yield.csv

3. Run:
   python notebooks/train_yield_model.py

4. Model saved to: backend/models/yield_model.pkl
"""

import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
import xgboost as xgb
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score

# ── Paths ─────────────────────────────────────────────────────────────────────
DATA_PATH       = Path("data/raw/crop_yield.csv")
MODEL_SAVE_PATH = Path("backend/models/yield_model.pkl")

# ── Load data ─────────────────────────────────────────────────────────────────
print("Loading dataset...")
if not DATA_PATH.exists():
    print(f"ERROR: File not found at {DATA_PATH}")
    print("Download from Kaggle: https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset")
    exit(1)

df = pd.read_csv(DATA_PATH)
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(df.head())

# ── Clean data ────────────────────────────────────────────────────────────────
# Drop rows with missing values
df = df.dropna()

# Rename columns to match our API schema
# (adjust column names if your CSV has different names)
COLUMN_MAP = {
    "Crop":        "crop",
    "Season":      "season",
    "State":       "state",
    "Annual_Rainfall": "rainfall_mm",
    "Fertilizer":  "nitrogen_kg_ha",
    "Pesticide":   "phosphorus_kg_ha",
    "Yield":       "yield_kg_ha",
}
df = df.rename(columns={k: v for k, v in COLUMN_MAP.items() if k in df.columns})

# Add dummy soil features if not in dataset
if "soil_ph" not in df.columns:
    df["soil_ph"] = np.random.uniform(5.5, 7.5, len(df))
if "potassium_kg_ha" not in df.columns:
    df["potassium_kg_ha"] = np.random.uniform(20, 100, len(df))
if "temperature_c" not in df.columns:
    df["temperature_c"] = np.random.uniform(15, 38, len(df))
if "humidity_pct" not in df.columns:
    df["humidity_pct"] = np.random.uniform(40, 90, len(df))

# ── Encode categorical columns ────────────────────────────────────────────────
le_crop   = LabelEncoder()
le_season = LabelEncoder()

if "crop" in df.columns:
    df["crop"]   = le_crop.fit_transform(df["crop"].astype(str))
if "season" in df.columns:
    df["season"] = le_season.fit_transform(df["season"].astype(str))

# Drop non-feature columns
FEATURES = [
    "crop", "season", "soil_ph",
    "nitrogen_kg_ha", "phosphorus_kg_ha", "potassium_kg_ha",
    "rainfall_mm", "temperature_c", "humidity_pct",
]
TARGET = "yield_kg_ha"

# Keep only columns that exist
FEATURES = [f for f in FEATURES if f in df.columns]
X = df[FEATURES].values
y = df[TARGET].values if TARGET in df.columns else df.iloc[:, -1].values

print(f"\nFeatures used: {FEATURES}")
print(f"Samples: {len(X)}, Target range: {y.min():.0f} – {y.max():.0f} kg/ha")

# ── Split data ────────────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Train XGBoost ─────────────────────────────────────────────────────────────
print("\nTraining XGBoost model...")
model = xgb.XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    min_child_weight=3,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,          # L1 regularization
    reg_lambda=1.0,         # L2 regularization
    random_state=42,
    verbosity=1,
)
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=50,
)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = model.predict(X_test)
mae  = mean_absolute_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)
cv_scores = cross_val_score(model, X, y, cv=5, scoring="r2")

print(f"\n{'='*40}")
print(f"Test MAE:  {mae:.1f} kg/ha")
print(f"Test R²:   {r2:.4f}")
print(f"CV R² (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# ── SHAP Feature Importance ───────────────────────────────────────────────────
print("\nGenerating SHAP feature importance plot...")
try:
    explainer  = shap.TreeExplainer(model)
    shap_vals  = explainer.shap_values(X_test[:200])   # use 200 samples for speed

    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_vals, X_test[:200], feature_names=FEATURES, show=False)
    plt.title("SHAP Feature Importance — Yield Prediction")
    plt.tight_layout()
    plt.savefig("data/processed/shap_importance.png", dpi=150)
    print("SHAP plot saved to: data/processed/shap_importance.png")
except Exception as e:
    print(f"SHAP plot skipped: {e}")

# ── Save model ────────────────────────────────────────────────────────────────
MODEL_SAVE_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(MODEL_SAVE_PATH, "wb") as f:
    pickle.dump(model, f)

print(f"\n✅ Model saved to {MODEL_SAVE_PATH}")
print(f"   MAE: {mae:.1f} kg/ha | R²: {r2:.4f}")
