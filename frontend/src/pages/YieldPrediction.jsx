/**
 * pages/YieldPrediction.jsx
 * ==========================
 * Page where a farmer enters soil + weather data and gets yield prediction.
 *
 * Features:
 * - Form with all input fields (crop, soil pH, NPK, rainfall, temperature)
 * - Predicted yield with confidence interval visualised as a bar
 * - Risk score badge
 * - SHAP feature importance chart (recharts BarChart)
 */

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from "recharts";
import { predictYield } from "../services/api";

const RISK_COLORS = {
  Low:    { bg: "#d1fae5", text: "#065f46" },
  Medium: { bg: "#fef3c7", text: "#92400e" },
  High:   { bg: "#fee2e2", text: "#991b1b" },
};

const DEFAULT_FORM = {
  crop: "Rice", season: "Kharif", state: "Punjab",
  soil_ph: 6.5, nitrogen_kg_ha: 80, phosphorus_kg_ha: 40,
  potassium_kg_ha: 60, rainfall_mm: 900, temperature_c: 28, humidity_pct: 65,
};

function Field({ label, help, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 500, marginBottom: 4, fontSize: 14 }}>
        {label}
      </label>
      {help && <p style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 4px" }}>{help}</p>}
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db",
  borderRadius: 6, fontSize: 14, boxSizing: "border-box",
};

export default function YieldPrediction() {
  const [form, setForm]     = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: parseFloat(e.target.value) || e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictYield(form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // Format SHAP values for recharts
  const shapData = result
    ? Object.entries(result.shap_values)
        .map(([name, value]) => ({ name: name.replace(/_/g, " "), value: parseFloat(value.toFixed(1)) }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    : [];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: 8 }}>
        📊 Yield Prediction
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Enter your field's soil and weather data to get an AI-powered yield forecast
        with a risk assessment and explainability chart.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* ── Input form ──────────────────────────────────────────────── */}
        <div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 16 }}>Field Details</h2>

          <Field label="Crop">
            <select style={inputStyle} value={form.crop} onChange={update("crop")}>
              {["Rice", "Wheat", "Maize", "Soybean", "Cotton"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Season">
            <select style={inputStyle} value={form.season} onChange={update("season")}>
              <option>Kharif</option>
              <option>Rabi</option>
              <option>Zaid</option>
            </select>
          </Field>

          <Field label="Soil pH" help="Ideal range: 6.0 – 7.0">
            <input type="number" style={inputStyle} step="0.1" min="4" max="9"
                   value={form.soil_ph} onChange={update("soil_ph")} />
          </Field>

          <Field label="Nitrogen (kg/ha)" help="Recommended: 60–120">
            <input type="number" style={inputStyle} value={form.nitrogen_kg_ha} onChange={update("nitrogen_kg_ha")} />
          </Field>

          <Field label="Phosphorus (kg/ha)">
            <input type="number" style={inputStyle} value={form.phosphorus_kg_ha} onChange={update("phosphorus_kg_ha")} />
          </Field>

          <Field label="Rainfall (mm/year)">
            <input type="number" style={inputStyle} value={form.rainfall_mm} onChange={update("rainfall_mm")} />
          </Field>

          <Field label="Temperature (°C)">
            <input type="number" style={inputStyle} value={form.temperature_c} onChange={update("temperature_c")} />
          </Field>

          <Field label="Humidity (%)">
            <input type="number" style={inputStyle} value={form.humidity_pct} onChange={update("humidity_pct")} />
          </Field>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "0.9rem",
              background: loading ? "#d1d5db" : "#2563eb",
              color: "white", border: "none", borderRadius: 8,
              fontSize: "1rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Predicting..." : "Predict Yield →"}
          </button>
        </div>

        {/* ── Results ─────────────────────────────────────────────────── */}
        <div>
          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #f87171",
                          borderRadius: 8, padding: "1rem", color: "#991b1b" }}>
              ⚠️ {error}
            </div>
          )}

          {result && (
            <>
              {/* Yield card */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem", marginBottom: 20 }}>
                <h3 style={{ marginTop: 0, color: "#374151" }}>Predicted Yield</h3>

                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>
                  {result.predicted_yield_kg_ha.toLocaleString()} kg/ha
                </div>

                {/* Confidence interval bar */}
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                  Range: {result.yield_lower_bound.toLocaleString()} – {result.yield_upper_bound.toLocaleString()} kg/ha
                </p>
                <div style={{ position: "relative", background: "#e5e7eb", height: 10, borderRadius: 5, marginBottom: 16 }}>
                  <div style={{
                    position: "absolute",
                    left: "10%", right: "10%",
                    height: "100%", background: "#bfdbfe", borderRadius: 5,
                  }} />
                  <div style={{
                    position: "absolute", left: "47.5%",
                    width: 5, height: "100%", background: "#1d4ed8", borderRadius: 5,
                  }} />
                </div>

                {/* Risk badge */}
                <span style={{
                  display: "inline-block", padding: "4px 14px",
                  borderRadius: 20, fontSize: 14, fontWeight: 600,
                  background: RISK_COLORS[result.risk_score]?.bg,
                  color: RISK_COLORS[result.risk_score]?.text,
                }}>
                  {result.risk_score} Risk
                </span>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>
                  {result.risk_explanation}
                </p>

                <div style={{ background: "#eff6ff", borderRadius: 8, padding: "0.75rem",
                              borderLeft: "3px solid #2563eb", marginTop: 12 }}>
                  <strong style={{ fontSize: 13 }}>Tip:</strong>
                  <span style={{ fontSize: 13, color: "#374151" }}> {result.recommendation_hint}</span>
                </div>
              </div>

              {/* SHAP chart */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
                <h3 style={{ marginTop: 0 }}>SHAP Feature Importance</h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                  Green bars increased the prediction. Red bars decreased it.
                  This tells you which factors matter most for your yield.
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={shapData} layout="vertical" margin={{ left: 100, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
                    <Tooltip formatter={(v) => `${v > 0 ? "+" : ""}${v} kg/ha impact`} />
                    <ReferenceLine x={0} stroke="#9ca3af" />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {shapData.map((entry, i) => (
                        <Cell key={i} fill={entry.value >= 0 ? "#16a34a" : "#dc2626"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {!result && !error && (
            <div style={{ background: "#f9fafb", border: "1px dashed #d1d5db",
                          borderRadius: 12, padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
              Fill in the form and click "Predict Yield" to see results here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
