"""
utils/model_loader.py
"""

import torch
import pickle
import torchvision.models as torchmodels
from pathlib import Path

# ─────────────────────────────────────────────

MODELS_DIR = Path(__file__).parent.parent / "models"

DISEASE_MODEL_PATH = MODELS_DIR / "disease_model.pth"
YIELD_MODEL_PATH = MODELS_DIR / "yield_model.pkl"

# ─────────────────────────────────────────────


def load_disease_model():

    model = torchmodels.resnet50(weights=None)

    import torch.nn as nn

    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(2048, 15)
    )

    if DISEASE_MODEL_PATH.exists():

        state_dict = torch.load(
            DISEASE_MODEL_PATH,
            map_location="cpu"
        )

        model.load_state_dict(state_dict)

        print(f"✅ Disease model loaded from {DISEASE_MODEL_PATH}")
        print("MODEL WEIGHTS LOADED SUCCESSFULLY")
        print(state_dict.keys())

    else:

        print("⚠️ No trained disease model found.")

    model.eval()

    return model


# ─────────────────────────────────────────────


def load_yield_model():

    if YIELD_MODEL_PATH.exists():

        with open(YIELD_MODEL_PATH, "rb") as f:
            model = pickle.load(f)

        print(f"✅ Yield model loaded from {YIELD_MODEL_PATH}")

        return model

    else:

        print("⚠️ No trained yield model found.")

        return _DummyYieldModel()


# ─────────────────────────────────────────────


class _DummyYieldModel:

    def predict(self, X):

        import numpy as np

        return np.array([2500])