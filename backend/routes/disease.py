"""
routes/disease.py — Disease Detection API
==========================================
Endpoint: POST /api/disease/predict
- Accepts a leaf image upload
- Returns: disease name, confidence, severity, Grad-CAM heatmap
"""

import io
import base64
import torch
import torchvision.transforms as transforms
from PIL import Image
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional

# pytorch_grad_cam gives us visual explanations (heatmaps)
import numpy as np

from utils.model_loader import load_disease_model
router = APIRouter()

# ── Disease class names (matches PlantVillage dataset order) ────────────────

DISEASE_CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

# ── Image preprocessing (must match training settings) ──────────────────────
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),        # resize to what the model expects
    transforms.ToTensor(),                 # convert to tensor (0.0–1.0)
    transforms.Normalize(                  # normalize same as training
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# ── Load model once when server starts (not on every request) ────────────────
print("Loading disease model...")

net = load_disease_model()

net.eval()

print("Disease model loaded.")


# ── Response schema ──────────────────────────────────────────────────────────
class DiseaseResult(BaseModel):
    disease_name: str
    crop: str
    confidence: float          # 0.0 – 1.0
    severity: str              # "Healthy" | "Mild" | "Moderate" | "Severe"
    is_healthy: bool
    heatmap_base64: Optional[str] = None   # Grad-CAM image as base64 string
    top3_predictions: list     # top 3 possible diseases with scores


def confidence_to_severity(confidence: float, is_healthy: bool) -> str:
    """Convert model confidence into a human-readable severity level."""
    if is_healthy:
        return "Healthy"
    if confidence > 0.85:
        return "Severe"
    if confidence > 0.60:
        return "Moderate"
    return "Mild"


@router.post("/predict", response_model=DiseaseResult)
async def predict_disease(file: UploadFile = File(...)):
    """
    Upload a leaf image → get disease diagnosis.
    
    - Accepts: JPEG or PNG image
    - Returns: disease name, confidence, severity, Grad-CAM heatmap
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG images are accepted.")

    # Read uploaded file into memory
    contents = await file.read()
    image_pil = Image.open(io.BytesIO(contents)).convert("RGB")

    # Preprocess image for model
    img_tensor = TRANSFORM(image_pil).unsqueeze(0)  # add batch dimension

    

    # ── Run inference ────────────────────────────────────────────────────────
    with torch.no_grad():
        outputs = net(img_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    top3_indices = torch.topk(probabilities, 3).indices.tolist()
    top3_scores  = torch.topk(probabilities, 3).values.tolist()

    predicted_idx  = top3_indices[0]
    predicted_class = DISEASE_CLASSES[predicted_idx]
    confidence     = float(top3_scores[0])

    # Parse class name  e.g. "Tomato___Early_blight" → crop=Tomato, disease=Early blight
    parts = predicted_class.split("___")
    crop    = parts[0].replace("_", " ")
    disease = parts[1].replace("_", " ") if len(parts) > 1 else predicted_class
    is_healthy = "healthy" in predicted_class.lower()

    # ── Generate Grad-CAM heatmap ────────────────────────────────────────────
    heatmap_b64 = None
     

    top3 = [
        {"class": DISEASE_CLASSES[i].replace("___", " — ").replace("_", " "),
         "confidence": round(float(s), 4)}
        for i, s in zip(top3_indices, top3_scores)
    ]

    return DiseaseResult(
        disease_name=disease,
        crop=crop,
        confidence=round(confidence, 4),
        severity=confidence_to_severity(confidence, is_healthy),
        is_healthy=is_healthy,
        heatmap_base64=heatmap_b64,
        top3_predictions=top3,
    )
