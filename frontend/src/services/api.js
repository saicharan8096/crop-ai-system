/**
 * services/api.js
 * ================
 * Central API service layer
 */

import axios from "axios";

/* =========================================
   BASE API CONFIG
========================================= */

const BASE_URL =
"http://192.168.1.39:8000/api";

const api = axios.create({

  baseURL: BASE_URL,

  timeout: 120000,

  headers: {

    "Content-Type":"application/json",
  },
});

/* =========================================
   REQUEST LOGGER
========================================= */

api.interceptors.request.use(

  (config)=>{

    console.log(
      "🚀 API REQUEST:",
      config.url,
      config.data
    );

    return config;
  },

  (error)=>{

    console.log(
      "❌ REQUEST ERROR:",
      error
    );

    return Promise.reject(error);
  }
);

/* =========================================
   RESPONSE LOGGER
========================================= */

api.interceptors.response.use(

  (response)=>{

    console.log(
      "✅ API RESPONSE:",
      response.data
    );

    return response;
  },

  (error)=>{

    console.log(
      "❌ API RESPONSE ERROR:",
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

/* =========================================
   MODULE 1 — DISEASE DETECTION
========================================= */

export async function detectDisease(
  imageFile
) {

  try {

    const formData = new FormData();

    formData.append(
      "file",
      imageFile
    );

    const response =
    await api.post(

      "/disease/predict",

      formData,

      {

        headers: {

          "Content-Type":
          "multipart/form-data",
        },
      }
    );

    return response.data;

  } catch (error) {

    console.log(
      "Disease Detection Error:",
      error
    );

    throw error;
  }
}

/* =========================================
   MODULE 2 — YIELD PREDICTION
========================================= */

export async function predictYield(
  data
) {

  try {

    console.log(
      "📊 Sending Yield Data:",
      data
    );

    const payload = {

      crop:
      data.crop,

      season:
      data.season,

      state:
      data.state || "Punjab",

      soil_ph:
      Number(data.soil_ph),

      nitrogen_kg_ha:
      Number(data.nitrogen_kg_ha),

      phosphorus_kg_ha:
      Number(data.phosphorus_kg_ha),

      potassium_kg_ha:
      Number(data.potassium_kg_ha),

      rainfall_mm:
      Number(data.rainfall_mm),

      temperature_c:
      Number(data.temperature_c),

      humidity_pct:
      Number(data.humidity_pct),
    };

    console.log(
      "📦 Final Payload:",
      payload
    );

    const response =
    await api.post(
      "/yield/predict",
      payload
    );

    console.log(
      "🌾 Yield Prediction Result:",
      response.data
    );

    // SAFETY CHECK

    if (
      !response.data ||
      response.data.predicted_yield_kg_ha ===
      undefined
    ) {

      throw new Error(
        "Invalid prediction response"
      );
    }

    return response.data;

  } catch (error) {

    console.log(
      "❌ Yield Prediction Error:",
      error
    );

    // FALLBACK MOCK RESPONSE

    return {

      predicted_yield_kg_ha:
      Math.floor(
        Math.random() * 4000
      ) + 2000,

      yield_lower_bound: 2200,

      yield_upper_bound: 6800,

      risk_score: "Medium",

      risk_explanation:
      "Backend unavailable. Using fallback prediction.",

      shap_values: {

        Nitrogen:
        Math.random() * 100,

        Rainfall:
        Math.random() * 80,

        Temperature:
        -Math.random() * 50,

        Humidity:
        Math.random() * 40,

        "Soil PH":
        -Math.random() * 20,
      },

      recommendation_hint:
      "Check backend server connection.",
    };
  }
}

/* =========================================
   MODULE 3 — RECOMMENDATIONS
========================================= */

export async function getRecommendations(
  data
) {

  try {

    const response =
    await api.post(

      "/recommendations/generate",

      data
    );

    return response.data;

  } catch (error) {

    console.log(
      "Recommendation Error:",
      error
    );

    throw error;
  }
}

/* =========================================
   WEATHER API
========================================= */

export async function getWeather(
  city = "Delhi"
) {

  try {

    const response =
    await api.get(

      `/weather/current?city=${encodeURIComponent(city)}`
    );

    return response.data;

  } catch (error) {

    console.log(
      "Weather API Error:",
      error
    );

    throw error;
  }
}