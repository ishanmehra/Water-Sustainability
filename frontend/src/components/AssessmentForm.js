import React, { useState } from "react";

const initialState = {
  country: "",
  year: "",
  totalWaterConsumption: "",
  perCapitaWaterUse: "",
  agriculturalWaterUse: "",
  industrialWaterUse: "",
  householdWaterUse: "",
  rainfallImpact: "",
  groundwaterDepletionRate: "",
  waterScarcityLevel: "Low",
};

const levels = ["Low", "Moderate", "High", "Extreme"];

export default function AssessmentForm({ onResult }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          totalWaterConsumption: Number(form.totalWaterConsumption),
          perCapitaWaterUse: Number(form.perCapitaWaterUse),
          agriculturalWaterUse: Number(form.agriculturalWaterUse),
          industrialWaterUse: Number(form.industrialWaterUse),
          householdWaterUse: Number(form.householdWaterUse),
          rainfallImpact: Number(form.rainfallImpact),
          groundwaterDepletionRate: Number(form.groundwaterDepletionRate),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      onResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="assessment-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <input name="totalWaterConsumption" type="number" placeholder="Total Water Consumption (Billion m³)" value={form.totalWaterConsumption} onChange={handleChange} required />
        <input name="perCapitaWaterUse" type="number" placeholder="Per Capita Water Use (L/day)" value={form.perCapitaWaterUse} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <input name="agriculturalWaterUse" type="number" placeholder="Agricultural Water Use (%)" value={form.agriculturalWaterUse} onChange={handleChange} required />
        <input name="industrialWaterUse" type="number" placeholder="Industrial Water Use (%)" value={form.industrialWaterUse} onChange={handleChange} required />
        <input name="householdWaterUse" type="number" placeholder="Household Water Use (%)" value={form.householdWaterUse} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <input name="rainfallImpact" type="number" placeholder="Annual Precipitation (mm)" value={form.rainfallImpact} onChange={handleChange} required />
        <input name="groundwaterDepletionRate" type="number" placeholder="Groundwater Depletion Rate (%)" value={form.groundwaterDepletionRate} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <select name="waterScarcityLevel" value={form.waterScarcityLevel} onChange={handleChange}>
          {levels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="submit-btn">Assess</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}