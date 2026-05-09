# 🌾 Crop Health AI System — Final Year Project

A full-stack AI system for smart farming: disease detection, yield prediction, and crop recommendations.

---

## 📁 Project Structure

```
crop-ai-system/
├── backend/              ← Python + FastAPI (AI brain)
│   ├── main.py           ← Server entry point
│   ├── models/           ← ML model files (.pkl, .h5)
│   ├── routes/           ← API endpoints
│   └── utils/            ← Helper functions
├── frontend/             ← React app (UI)
│   └── src/
│       ├── components/   ← Reusable UI parts
│       ├── pages/        ← Full pages
│       └── services/     ← API call functions
├── notebooks/            ← Model training scripts
└── data/                 ← Datasets
```

---

## 🚀 Quick Start (Step by Step)

### Step 1: Install Python requirements

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Node.js requirements

```bash
cd frontend
npm install
```

### Step 3: Train models (run once)

```bash
cd notebooks
python train_disease_model.py
python train_yield_model.py
```

### Step 4: Start the backend

```bash
cd backend
uvicorn main:app --reload
```

Open: http://localhost:8001/docs  ← API documentation

### Step 5: Start the frontend

```bash
cd frontend
npm start
```

Open: http://localhost:3000  ← Your web app

---

## 🧠 What Each Module Does

| Module | Input | Output |
|--------|-------|--------|
| Disease Detection | Leaf photo | Disease name + severity + heatmap |
| Yield Prediction | Weather + soil data | Expected yield + risk score |
| Recommendations | Disease + weather | Treatment + irrigation advice |

---

## 📦 Tech Stack

- **Backend**: Python, FastAPI, PyTorch, scikit-learn, XGBoost
- **Frontend**: React, Tailwind CSS, Axios
- **AI Models**: CNN (disease), XGBoost (yield), Rule-based (recommendations)
- **Explainability**: SHAP, Grad-CAM
