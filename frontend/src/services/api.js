/**
 * services/api.js
 * ================
 * All API calls to the FastAPI backend live here.
 * Components import from this file — never call axios directly in components.
 *
 * BASE_URL points to the FastAPI server (port 8001).
 */

import axios from "axios";


const BASE_URL = "https://crop-ai-system-production.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,   // 120 second timeout (model inference can take a few seconds)
});


/**
 * MODULE 1: Disease Detection
 * ---------------------------
 * Send a leaf image, get back disease diagnosis.
 *
 * @param {File} imageFile - The image file from a file input or drag-and-drop
 * @returns {Object} { disease_name, crop, confidence, severity, heatmap_base64, top3_predictions }
 */
export async function detectDisease(imageFile) {
  // FormData is used for file uploads
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.post("/disease/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}


/**
 * MODULE 2: Yield Prediction
 * ---------------------------
 * Send soil + weather data, get back predicted yield.
 *
 * @param {Object} data - Matches YieldInput schema in the backend
 * @returns {Object} { predicted_yield_kg_ha, risk_score, shap_values, ... }
 */
export async function predictYield(data) {
  const response = await api.post("/yield/predict", data);
  return response.data;
}


/**
 * MODULE 3: Recommendations
 * --------------------------
 * Get actionable advice based on disease + weather + crop stage.
 *
 * @param {Object} data - Matches RecommendationInput schema
 * @returns {Object} { treatment, fertilizer, irrigation, urgency, ... }
 */
export async function getRecommendations(data) {
  const response = await api.post("/recommendations/generate", data);
  return response.data;
}


/**
 * Weather Data
 * ------------
 * Fetch live weather for a city.
 *
 * @param {string} city - City name e.g. "Delhi"
 * @returns {Object} { temperature_c, humidity_pct, rainfall_1h_mm, ... }
 */
export async function getWeather(city = "Delhi") {
  const response = await api.get(`/weather/current?city=${encodeURIComponent(city)}`);
  return response.data;
}
