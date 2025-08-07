import React, { useState } from "react";
import AssessmentForm from "./components/AssessmentForm";
import SustainabilityResult from "./components/SustainabilityResult";
import ChatWidget from "./components/ChatWidget";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <header>
        <h1>Water Sustainability Assessment</h1>
      </header>
      <AssessmentForm onResult={setResult} />
      {result && <SustainabilityResult {...result} />}
      <ChatWidget />
    </div>
  );
}

export default App;