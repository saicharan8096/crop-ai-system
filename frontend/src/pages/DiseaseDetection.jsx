/**
 * pages/DiseaseDetection.jsx
 * ===========================
 * Page where the farmer uploads a leaf image and gets disease diagnosis.
 *
 * Flow:
 * 1. User drags/drops a leaf image
 * 2. We show a preview
 * 3. On submit → call /api/disease/predict
 * 4. Show results: disease name, severity badge, Grad-CAM heatmap, top 3 predictions
 */

import React, { useState, useCallback } from "react";
import { detectDisease } from "../services/api";

// Severity badge colors
const SEVERITY_COLORS = {
  Healthy:  { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  Mild:     { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  Moderate: { bg: "#fed7aa", text: "#7c2d12", border: "#fb923c" },
  Severe:   { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
};

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [result, setResult]             = useState(null);
  const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("predictionHistory");
  return saved ? JSON.parse(saved) : [];
});
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // ── Handle file selection ──────────────────────────────────────────────────
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));   // create a local URL for preview
    setResult(null);
    setError(null);
  }, []);

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e);
  };

  // ── Submit to API ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const data = await detectDisease(selectedFile);
      setResult(data);
      const newEntry = {
  time: new Date().toLocaleString(),
  crop: data.crop,
  disease: data.disease_name,
  confidence: data.confidence,
};

setHistory((prev) => {
  const updated = [newEntry, ...prev];

  localStorage.setItem(
    "predictionHistory",
    JSON.stringify(updated)
  );

  return updated;
});
    } catch (err) {
      setError(err.response?.data?.detail || "Error connecting to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const severityStyle = result ? SEVERITY_COLORS[result.severity] || SEVERITY_COLORS.Mild : {};

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: window.innerWidth < 768 ? "1rem" : "2rem 1rem"}}>
      <h1 style={{ fontSize: window.innerWidth < 768 ? "1.1rem" : "1rem",minHeight: 55, fontWeight: 600, marginBottom: 8 }}>
        🌿 Leaf Disease Detection
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Upload a photo of a crop leaf. The AI will identify the disease, estimate severity,
        and show you exactly which part of the leaf triggered the diagnosis.
      </p>

      {/* ── Upload area ─────────────────────────────────────────────────── */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #d1d5db",
          borderRadius: 12,
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          background: "#f9fafb",
          marginBottom: 16,
          transition: "border-color 0.2s",
        }}
        onClick={() => document.getElementById("leaf-upload").click()}
      >
        <input
          id="leaf-upload"
          type="file"
          accept="image/jpeg,image/png"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected leaf"
            style={{ maxHeight: 250, borderRadius: 8, objectFit: "contain" }}
          />
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Drag and drop a leaf image here, or click to browse
            </p>
            <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>
              Supports JPEG and PNG
            </p>
          </>
        )}
      </div>

      {/* ── Submit button ────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        style={{
          width: "100%",
          padding: "0.9rem",
          background: selectedFile && !loading ? "#16a34a" : "#d1d5db",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: selectedFile && !loading ? "pointer" : "not-allowed",
          marginBottom: 24,
        }}
      >
        {loading ? "🔍 Analysing leaf..." : "Analyse Leaf →"}
      </button>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #f87171",
                      borderRadius: 8, padding: "1rem", marginBottom: 24, color: "#991b1b" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────── */}
      {result && (
          <div
  style={{
    display: "grid",
    gridTemplateColumns:
      window.innerWidth < 768 ? "1fr" : "1fr 1fr",
    gap: 20,
  }}
>

          {/* Left: diagnosis details */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
            <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Diagnosis</h2>
            <button
  onClick={() => {
    const report = `
Crop: ${result.crop}

Disease: ${result.disease_name}

Confidence: ${(result.confidence * 100).toFixed(1)}%

Pesticide: ${result.pesticide}

Dosage: ${result.dosage}

Advice: ${result.advice}

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "crop-disease-report.txt";

    a.click();

    URL.revokeObjectURL(url);
  }}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 16,
  }}
>
  Download Report
</button>

            {/* Severity badge */}
            <span style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              background: severityStyle.bg,
              color: severityStyle.text,
              border: `1px solid ${severityStyle.border}`,
              marginBottom: 16,
            }}>
              {result.severity}
            </span>

            <p><strong>Crop:</strong> {result.crop}</p>
            <p><strong>Disease:</strong> {result.disease_name}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
            <p><strong>Pesticide:</strong> {result.pesticide}</p>
            <p><strong>Dosage:</strong> {result.dosage}</p>
            <p><strong>Advice:</strong> {result.advice}</p>

            {/* Confidence bar */}
            <div style={{ background: "#e5e7eb", borderRadius: 4, height: 8, margin: "8px 0 20px" }}>
              <div style={{
                width: `${result.confidence * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: result.is_healthy ? "#16a34a" : "#ef4444",
              }} />
            </div>

            {/* Top 3 predictions */}
            <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>Top 3 predictions</h3>
            {result.top3_predictions.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between",
                                    padding: "6px 0", borderBottom: "1px solid #f3f4f6",
                                    fontSize: 13 }}>
                <span>{p.class}</span>
                <span style={{ color: "#6b7280" }}>{(p.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>

          {/* Right: Grad-CAM heatmap */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
            <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Grad-CAM Heatmap</h2>
            <p style={{ fontSize: 13, color: "#6b7280" }}>
              Red/yellow areas = the parts of the leaf the AI focused on to make its decision.
              This is called Explainable AI (XAI).
            </p>
            {result.heatmap_base64 ? (
              <img
                src={`data:image/jpeg;base64,${result.heatmap_base64}`}
                alt="Grad-CAM heatmap"
                style={{ width: "100%", borderRadius: 8 }}
              />
            ) : (
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                Heatmap not available (model weights not loaded).
              </p>
            )}
          </div>
        </div>
      )}
       {history.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "1.5rem",
            marginTop: 24,
          }}
        >
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h2 style={{ marginTop: 0 }}>Prediction History</h2>

  <button
    onClick={() => {
      localStorage.removeItem("predictionHistory");
      setHistory([]);
    }}
    style={{
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    Clear History
  </button>
</div>

          {history.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <p><strong>Time:</strong> {item.time}</p>
              <p><strong>Crop:</strong> {item.crop}</p>
              <p><strong>Disease:</strong> {item.disease}</p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(item.confidence * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
         
  );
}
