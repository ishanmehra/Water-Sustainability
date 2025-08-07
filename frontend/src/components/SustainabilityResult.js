import React from "react";

const getColor = (score) => {
  if (score >= 80) return "#4caf50";
  if (score >= 60) return "#2196f3";
  if (score >= 40) return "#ff9800";
  return "#f44336";
};

export default function SustainabilityResult({ sustainabilityScore, scoreCategory, suggestions }) {
  return (
    <div className="result-card">
      <h2>Sustainability Score</h2>
      <div className="score-bar">
        <div
          className="score-fill"
          style={{
            width: `${sustainabilityScore}%`,
            background: getColor(sustainabilityScore),
          }}
        />
        <span className="score-label">{sustainabilityScore}/100</span>
      </div>
      <div className="score-category">{scoreCategory}</div>
      <ul className="suggestions">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}