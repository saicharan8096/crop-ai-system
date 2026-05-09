"""
main.py — FastAPI server entry point
=====================================
This is the first file the server runs.
It sets up the API and connects all route modules.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our route modules (each handles one feature)
from backend.routes import disease, yield_pred, recommendations, weather

# ── Create the FastAPI app ───────────────────────────────────────────────────
app = FastAPI(
    title="Crop Health AI System",
    description="AI-powered disease detection, yield prediction, and crop recommendations",
    version="1.0.0",
)

# ── Allow React frontend (port 3000) to talk to this backend (port 8001) ────
# This is called CORS — without it, the browser blocks the connection.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register all route modules ───────────────────────────────────────────────
# Each prefix groups related endpoints under one path
app.include_router(disease.router,         prefix="/api/disease",         tags=["Disease Detection"])
app.include_router(yield_pred.router,      prefix="/api/yield",           tags=["Yield Prediction"])
app.include_router(recommendations.router, prefix="/api/recommendations",  tags=["Recommendations"])
app.include_router(weather.router,         prefix="/api/weather",          tags=["Weather"])


# ── Health check endpoint ────────────────────────────────────────────────────
@app.get("/")
def root():
    """Quick check that the server is running."""
    return {"status": "ok", "message": "Crop AI System is running!"}


# ── Run with:  uvicorn main:app --reload ────────────────────────────────────
