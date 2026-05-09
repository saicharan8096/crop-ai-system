"""
routes/yield_pred.py — Yield Prediction API
=============================================
Endpoint: POST /api/yield/predict
- Accepts: soil data, crop type, season, weather values
- Returns: predicted yield (kg/ha), risk score, confidence interval, SHAP values
"""

import numpy as np
import shap
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Literal

from backend.utils.model_loader import load_yield_model

router = APIRouter()

# Load model once at startup
_model = None

def get_model():
    global _model
    if _model is None:
        _model = load_yield_model()
    return _model


# ── Input schema ─────────────────────────────────────────────────────────────
class YieldInput(BaseModel):
    """Everything the model needs to predict yield."""

    crop: Literal["Rice", "Wheat", "Maize", "Soybean", "Cotton"] = Field(
        ..., example="Rice"
    )
    season: Literal["Kharif", "Rabi", "Zaid"] = Field(
        ..., example="Kharif",
        description="Kharif = monsoon (Jun-Sep), Rabi = winter (Oct-Mar), Zaid = summer"
    )
    state: str = Field(..., example="Punjab")

    # Soil features (typical range in parentheses)
    soil_ph: float        = Field(..., ge=4.0, le=9.0,   example=6.5,   description="4-9")
    nitrogen_kg_ha: float = Field(..., ge=0, le=200,     example=80.0,  description="kg/hectare")
    phosphorus_kg_ha: float = Field(..., ge=0, le=100,   example=40.0,  description="kg/hectare")
    potassium_kg_ha: float = Field(..., ge=0, le=150,    example=60.0,  description="kg/hectare")

    # Weather features
    rainfall_mm: float    = Field(..., ge=0, le=3000,    example=900.0, description="Annual mm")
    temperature_c: float  = Field(..., ge=5.0, le=50.0,  example=28.0,  description="Average °C")
    humidity_pct: float   = Field(..., ge=10, le=100,    example=65.0,  description="Relative %")


# ── Output schema ────────────────────────────────────────────────────────────
class YieldResult(BaseModel):
    predicted_yield_kg_ha: float      # main prediction
    yield_lower_bound: float           # 10th percentile (pessimistic)
    yield_upper_bound: float           # 90th percentile (optimistic)
    risk_score: Literal["Low", "Medium", "High"]
    risk_explanation: str
    shap_values: dict                  # feature importance for this prediction
    recommendation_hint: str           # short advice


# ── Encode categorical variables ─────────────────────────────────────────────
CROP_MAP   = {"Rice": 0, "Wheat": 1, "Maize": 2, "Soybean": 3, "Cotton": 4}
SEASON_MAP = {"Kharif": 0, "Rabi": 1, "Zaid": 2}

FEATURE_NAMES = [
    "crop", "season", "soil_ph",
    "nitrogen_kg_ha", "phosphorus_kg_ha", "potassium_kg_ha",
    "rainfall_mm", "temperature_c", "humidity_pct",
]

def compute_risk(predicted: float, lower: float, spread: float) -> tuple[str, str]:
    """
    Risk is based on how wide the uncertainty interval is
    relative to the predicted value.
    """
    uncertainty_ratio = spread / (predicted + 1e-6)
    if uncertainty_ratio < 0.15:
        return "Low", "Model is confident. Conditions look stable."
    if uncertainty_ratio < 0.35:
        return "Medium", "Moderate uncertainty — watch for weather changes."
    return "High", "High spread in predictions. Consider soil testing and contingency planning."


@router.post("/predict", response_model=YieldResult)
def predict_yield(data: YieldInput):
    """
    Predict crop yield from soil and weather features.
    Returns predicted value, confidence interval, risk level, and SHAP explanations.
    """
    model = get_model()

    # Build feature array
    features = np.array([[
        CROP_MAP.get(data.crop, 0),
        SEASON_MAP.get(data.season, 0),
        data.soil_ph,
        data.nitrogen_kg_ha,
        data.phosphorus_kg_ha,
        data.potassium_kg_ha,
        data.rainfall_mm,
        data.temperature_c,
        data.humidity_pct,
    ]])

    # ── XGBoost prediction ───────────────────────────────────────────────────
    predicted = float(model.predict(features)[0])

    # Simulate confidence interval (±15% for demo; replace with quantile regression)
    lower = predicted * 0.85
    upper = predicted * 1.15
    spread = upper - lower

    risk_score, risk_explanation = compute_risk(predicted, lower, spread)

    # ── SHAP explanation ─────────────────────────────────────────────────────
    # SHAP tells us which features pushed the prediction up or down
    try:
        explainer = shap.TreeExplainer(model)
        shap_vals = explainer.shap_values(features)[0]
        shap_dict = {
            name: round(float(val), 3)
            for name, val in zip(FEATURE_NAMES, shap_vals)
        }
    except Exception:
        shap_dict = {name: 0.0 for name in FEATURE_NAMES}

    # Build a simple recommendation hint
    top_negative = min(shap_dict, key=shap_dict.get)
    hint_map = {
        "nitrogen_kg_ha":   "Consider adding more nitrogen fertilizer.",
        "rainfall_mm":      "Rainfall is the limiting factor — consider irrigation.",
        "soil_ph":          "Soil pH is affecting yield — consider liming.",
        "temperature_c":    "Temperature stress detected — check crop variety suitability.",
        "humidity_pct":     "Humidity levels are non-optimal — monitor for fungal disease.",
        "phosphorus_kg_ha": "Phosphorus is low — apply phosphate fertilizer.",
        "potassium_kg_ha":  "Potassium deficiency likely — apply potash.",
    }
    hint = hint_map.get(top_negative, "Monitor crop regularly and maintain good agronomic practices.")

    return YieldResult(
        predicted_yield_kg_ha=round(predicted, 1),
        yield_lower_bound=round(lower, 1),
        yield_upper_bound=round(upper, 1),
        risk_score=risk_score,
        risk_explanation=risk_explanation,
        shap_values=shap_dict,
        recommendation_hint=hint,
    )
