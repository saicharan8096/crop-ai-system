"""
routes/recommendations.py — Crop Recommendation Engine
========================================================
Endpoint: POST /api/recommendations/generate
- Accepts: disease result + weather + crop stage
- Returns: treatment plan, irrigation advice, preventive actions
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal, List

router = APIRouter()


# ── Input ─────────────────────────────────────────────────────────────────────
class RecommendationInput(BaseModel):
    crop: str                  = "Tomato"
    disease_name: str          = "Early blight"
    severity: Literal["Healthy", "Mild", "Moderate", "Severe"] = "Mild"
    temperature_c: float       = 28.0
    humidity_pct: float        = 65.0
    rainfall_last_7_days_mm: float = 20.0
    crop_stage: Literal[
        "Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"
    ] = "Vegetative"


# ── Output ────────────────────────────────────────────────────────────────────
class RecommendationResult(BaseModel):
    treatment: List[str]        # step-by-step disease treatment
    fertilizer: List[str]       # fertilizer recommendations
    irrigation: str             # irrigation advice
    preventive_actions: List[str]
    urgency: Literal["Monitor", "Act within 7 days", "Act immediately"]
    alert_message: str


# ── Knowledge base (rule-based engine) ────────────────────────────────────────
# In a production system this would be a database or ML model.
# For a final year project, a well-structured rule base is perfectly valid
# and easy to explain to examiners.

DISEASE_TREATMENTS = {
    "early blight": [
        "Remove and destroy infected lower leaves immediately.",
        "Apply copper-based fungicide (Mancozeb 75 WP) at 2.5 g/litre.",
        "Repeat spray every 7–10 days until disease is controlled.",
        "Avoid overhead irrigation — water at the base of plants.",
    ],
    "late blight": [
        "Apply Metalaxyl + Mancozeb (Ridomil Gold) at first sign.",
        "Remove heavily infected plants to prevent spread.",
        "Spray every 5–7 days during wet weather.",
        "Harvest any mature fruit immediately to salvage yield.",
    ],
    "bacterial spot": [
        "Apply copper hydroxide spray (Kocide) at 3 g/litre.",
        "Avoid working in field when plants are wet.",
        "Destroy crop debris after harvest.",
    ],
    "powdery mildew": [
        "Apply Sulphur-based fungicide (Thiovit Jet) at 3 g/litre.",
        "Improve air circulation by pruning dense foliage.",
        "Apply potassium bicarbonate spray as an organic alternative.",
    ],
    "healthy": [
        "No treatment needed. Plant appears healthy.",
        "Continue regular monitoring every 7–10 days.",
    ],
}

FERTILIZER_BY_STAGE = {
    "Seedling":   ["Apply starter fertilizer: 10-52-17 NPK at 2 g/litre.", "Ensure adequate phosphorus for root development."],
    "Vegetative": ["Apply nitrogen-rich fertilizer: Urea 46% at 25 kg/ha.", "Side-dress with 19-19-19 NPK to support leaf growth."],
    "Flowering":  ["Reduce nitrogen. Apply potassium: 0-0-60 MOP at 20 kg/ha.", "Boron foliar spray (0.2%) to improve fruit set."],
    "Fruiting":   ["Apply calcium nitrate (15.5-0-0+19 Ca) to prevent blossom end rot.", "Potassium sulphate 0-0-50 at 20 kg/ha for quality."],
    "Harvest":    ["Stop heavy fertilization. Light potassium application only.", "Focus on post-harvest soil improvement."],
}

def get_irrigation_advice(temp: float, humidity: float, rainfall_mm: float, stage: str) -> str:
    """Simple rule-based irrigation advice."""
    if rainfall_mm > 40:
        return "Sufficient natural rainfall. Pause irrigation for 3–5 days and monitor soil moisture."
    if temp > 35 and humidity < 40:
        return "High temperature + low humidity detected. Irrigate every 2 days, preferably in the evening."
    if stage == "Flowering":
        return "Critical stage: maintain consistent soil moisture. Drip irrigation recommended every 2–3 days."
    if stage == "Fruiting":
        return "Consistent watering essential. Avoid water stress — irrigate every 3 days or when topsoil is dry."
    return "Standard irrigation: water when top 2–3 cm of soil is dry. Approximately every 3–4 days."

def get_urgency(severity: str) -> tuple[str, str]:
    urgency_map = {
        "Healthy":  ("Monitor",          "Plant is healthy. Keep monitoring weekly."),
        "Mild":     ("Act within 7 days","Early signs detected. Begin treatment this week."),
        "Moderate": ("Act within 7 days","Moderate infection. Treat within 3–5 days to prevent spread."),
        "Severe":   ("Act immediately",  "⚠️ Severe infection detected! Apply treatment TODAY and isolate affected plants."),
    }
    return urgency_map.get(severity, ("Monitor", "No immediate action required."))


@router.post("/generate", response_model=RecommendationResult)
def generate_recommendations(data: RecommendationInput):
    """
    Generate actionable recommendations based on disease + weather + crop stage.
    Uses a rule-based hybrid approach: easy to understand and explain.
    """
    disease_key = data.disease_name.lower().replace("_", " ")

    # Find best matching disease in knowledge base
    treatment = DISEASE_TREATMENTS.get("healthy")
    for key, value in DISEASE_TREATMENTS.items():
        if key in disease_key:
            treatment = value
            break

    fertilizer = FERTILIZER_BY_STAGE.get(data.crop_stage, FERTILIZER_BY_STAGE["Vegetative"])

    irrigation = get_irrigation_advice(
        data.temperature_c, data.humidity_pct,
        data.rainfall_last_7_days_mm, data.crop_stage
    )

    # Preventive actions based on weather
    preventive = [
        f"Scout field every 7 days for early signs of disease in {data.crop}.",
        "Rotate crops next season to break disease cycle.",
    ]
    if data.humidity_pct > 75:
        preventive.append("High humidity: apply preventive fungicide spray — conditions favour fungal disease.")
    if data.temperature_c > 33:
        preventive.append("Heat stress risk: consider shade nets or increasing irrigation frequency.")
    if data.rainfall_last_7_days_mm > 50:
        preventive.append("Heavy rainfall: check for waterlogging and improve field drainage.")

    urgency, alert = get_urgency(data.severity)

    return RecommendationResult(
        treatment=treatment,
        fertilizer=fertilizer,
        irrigation=irrigation,
        preventive_actions=preventive,
        urgency=urgency,
        alert_message=alert,
    )
