/**
 * App.jsx — Main React Application
 * ==================================
 * Sets up routing between pages.
 * Pages:
 *   /              → Dashboard (home)
 *   /disease       → Disease Detection
 *   /yield         → Yield Prediction
 *   /recommend     → Recommendations
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldPrediction  from "./pages/YieldPrediction";
import Dashboard        from "./pages/Dashboard";
import Recommendations  from "./pages/Recommendations";

// Navigation link style (active = highlighted)
const navLinkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0.5rem 1rem",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: 15,
  color: isActive ? "#16a34a" : "#374151",
  background: isActive ? "#dcfce7" : "transparent",
  transition: "all 0.15s",
});

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* ── Sidebar navigation ──────────────────────────────────────── */}
        <aside style={{
          width: 220, background: "#fff", borderRight: "1px solid #e5e7eb",
          padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "0 0.5rem" }}>
            <span style={{ fontSize: 28 }}>🌾</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>CropAI</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Smart Farming System</div>
            </div>
          </div>

          {/* Nav links */}
          <NavLink to="/"          style={navLinkStyle} end>🏠 Dashboard</NavLink>
          <NavLink to="/disease"   style={navLinkStyle}>🌿 Disease Detection</NavLink>
          <NavLink to="/yield"     style={navLinkStyle}>📊 Yield Prediction</NavLink>
          <NavLink to="/recommend" style={navLinkStyle}>💡 Recommendations</NavLink>

          {/* Bottom info */}
          <div style={{ marginTop: "auto", padding: "1rem 0.5rem",
                        borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#9ca3af" }}>
            Final Year Project<br />
            AI-powered crop health system
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────────────── */}
        <main style={{ flex: 1, background: "#f9fafb", overflow: "auto" }}>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/disease"   element={<DiseaseDetection />} />
            <Route path="/yield"     element={<YieldPrediction />} />
            <Route path="/recommend" element={<Recommendations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
