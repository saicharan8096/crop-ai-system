/**
 * pages/Dashboard.jsx
 * ====================
 * Home page showing:
 * - Live weather widget (fetches from backend → OpenWeather API)
 * - Quick summary cards for each module
 * - Getting started guide
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeather } from "../services/api";

function StatCard({ emoji, title, description, path, color }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
        padding: "1.5rem", cursor: "pointer",
        borderTop: `4px solid ${color}`,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
      <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 600 }}>{title}</h3>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14, lineHeight: 1.5 }}>{description}</p>
      <span style={{ display: "inline-block", marginTop: 12, fontSize: 13,
                     color: color, fontWeight: 500 }}>
        Open →
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [weather, setWeather]   = useState(null);
  const [city, setCity]         = useState("Delhi");
  const [cityInput, setCityInput] = useState("Delhi");

  const fetchWeather = async (c) => {
    try {
      const data = await getWeather(c);
      setWeather(data);
    } catch {
      setWeather(null);
    }
  };

  useEffect(() => { fetchWeather(city); }, [city]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
          Welcome to CropAI 🌾
        </h1>
        <p style={{ color: "#6b7280", marginTop: 8, fontSize: 16 }}>
          An AI-powered decision support system for smart farming.
        </p>
      </div>

      {/* Live weather */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #16a34a 100%)",
                    borderRadius: 12, padding: "1.5rem", color: "white", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ margin: "0 0 4px", opacity: 0.8, fontSize: 13 }}>Live Weather</p>
            {weather ? (
              <>
                <div style={{ fontSize: "2.5rem", fontWeight: 700 }}>{weather.temperature_c}°C</div>
                <div style={{ opacity: 0.9 }}>{weather.description} — {weather.city}</div>
                <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
                  💧 Humidity: {weather.humidity_pct}% &nbsp; 💨 Wind: {weather.wind_speed_ms} m/s
                  &nbsp; 🌧 Rain: {weather.rainfall_1h_mm} mm/hr
                </div>
              </>
            ) : (
              <div style={{ opacity: 0.7 }}>Loading weather data...</div>
            )}
          </div>
          {/* City search */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setCity(cityInput)}
              placeholder="Enter city..."
              style={{
                padding: "0.5rem 0.75rem", borderRadius: 8, border: "none",
                fontSize: 14, width: 140,
              }}
            />
            <button
              onClick={() => setCity(cityInput)}
              style={{
                padding: "0.5rem 1rem", borderRadius: 8,
                background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
                color: "white", cursor: "pointer", fontSize: 14, fontWeight: 500,
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Module cards */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>Modules</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
        <StatCard
          emoji="🌿" title="Disease Detection" color="#16a34a" path="/disease"
          description="Upload a leaf photo. Get disease name, severity, and a Grad-CAM heatmap showing exactly what the AI saw."
        />
        <StatCard
          emoji="📊" title="Yield Prediction" color="#2563eb" path="/yield"
          description="Enter soil and weather data. Get predicted yield (kg/ha) with a risk score and SHAP feature importance chart."
        />
        <StatCard
          emoji="💡" title="Recommendations" color="#d97706" path="/recommend"
          description="Get AI-generated treatment, fertilizer, and irrigation advice based on disease + current weather."
        />
      </div>

      {/* Getting started steps */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 16 }}>How to use</h2>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
        {[
          { step: "1", text: "Start the backend: cd backend && uvicorn main:app --reload" },
          { step: "2", text: "Train models: python notebooks/train_disease_model.py  (or skip to use demo mode)" },
          { step: "3", text: "Go to Disease Detection → upload a leaf photo from the data/raw folder" },
          { step: "4", text: "Go to Yield Prediction → enter your field details" },
          { step: "5", text: "Go to Recommendations → get actionable treatment advice" },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{
              minWidth: 28, height: 28, borderRadius: "50%",
              background: "#16a34a", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
            }}>{step}</span>
            <code style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, background: "#f9fafb",
                           padding: "0.25rem 0.5rem", borderRadius: 4, flex: 1 }}>
              {text}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
