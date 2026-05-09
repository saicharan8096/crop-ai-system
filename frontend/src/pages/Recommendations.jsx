/**
 * pages/Recommendations.jsx
 * ==========================
 * Page where the farmer gets actionable treatment and care advice.
 */

import React, { useState } from "react";
import { getRecommendations } from "../services/api";

const inputStyle = {
  width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db",
  borderRadius: 6, fontSize: 14, boxSizing: "border-box",
};

const URGENCY_COLORS = {
  "Monitor":           { bg: "#d1fae5", text: "#065f46" },
  "Act within 7 days": { bg: "#fef3c7", text: "#92400e" },
  "Act immediately":   { bg: "#fee2e2", text: "#991b1b" },
};

function ListCard({ title, emoji, items, color = "#2563eb" }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", marginBottom: 16 }}>
      <h3 style={{ marginTop: 0, color: color, fontSize: "1rem" }}>{emoji} {title}</h3>
      <ul style={{ paddingLeft: 20, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: 6, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Recommendations() {
  const [form, setForm] = useState({
    crop: "Tomato", disease_name: "Early blight", severity: "Mild",
    temperature_c: 28, humidity_pct: 65, rainfall_last_7_days_mm: 20,
    crop_stage: "Vegetative",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: parseFloat(e.target.value) || e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await getRecommendations(form));
    } catch (err) {
      setError(err.response?.data?.detail || "Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const urgency = result ? URGENCY_COLORS[result.urgency] : null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: 8 }}>💡 Recommendations</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Enter your crop situation and weather conditions to get specific treatment,
        fertilizer, and irrigation recommendations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32 }}>
        {/* Form */}
        <div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 16 }}>Crop Situation</h2>

          {[
            { label: "Crop", field: "crop", type: "text" },
            { label: "Disease detected", field: "disease_name", type: "text" },
          ].map(({ label, field }) => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{label}</label>
              <input type="text" style={inputStyle} value={form[field]} onChange={update(field)} />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Severity</label>
            <select style={inputStyle} value={form.severity} onChange={update("severity")}>
              {["Healthy", "Mild", "Moderate", "Severe"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Crop Stage</label>
            <select style={inputStyle} value={form.crop_stage} onChange={update("crop_stage")}>
              {["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <h2 style={{ fontSize: "1rem", marginTop: 20, marginBottom: 12 }}>Current Weather</h2>
          {[
            { label: "Temperature (°C)", field: "temperature_c" },
            { label: "Humidity (%)", field: "humidity_pct" },
            { label: "Rainfall last 7 days (mm)", field: "rainfall_last_7_days_mm" },
          ].map(({ label, field }) => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{label}</label>
              <input type="number" style={inputStyle} value={form[field]} onChange={update(field)} />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "0.9rem",
              background: loading ? "#d1d5db" : "#d97706",
              color: "white", border: "none", borderRadius: 8,
              fontSize: "1rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Get Recommendations →"}
          </button>
        </div>

        {/* Results */}
        <div>
          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #f87171",
                          borderRadius: 8, padding: "1rem", color: "#991b1b", marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {result && (
            <>
              {/* Urgency banner */}
              <div style={{
                background: urgency?.bg, color: urgency?.text,
                borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 20,
                fontWeight: 600, fontSize: 15,
              }}>
                🚨 {result.urgency}: {result.alert_message}
              </div>

              <ListCard title="Disease Treatment" emoji="💊" items={result.treatment} color="#dc2626" />
              <ListCard title="Fertilizer Plan"   emoji="🌱" items={result.fertilizer} color="#16a34a" />
              <ListCard title="Preventive Actions" emoji="🛡️" items={result.preventive_actions} color="#7c3aed" />

              {/* Irrigation */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem" }}>
                <h3 style={{ marginTop: 0, color: "#2563eb", fontSize: "1rem" }}>💧 Irrigation Advice</h3>
                <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.7 }}>
                  {result.irrigation}
                </p>
              </div>
            </>
          )}

          {!result && !error && (
            <div style={{ background: "#f9fafb", border: "1px dashed #d1d5db",
                          borderRadius: 12, padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
              Fill in the crop situation and click "Get Recommendations".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
