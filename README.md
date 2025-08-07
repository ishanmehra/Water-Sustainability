# Water Sustainability Assessment Web App

A full-stack web application for assessing water sustainability using IBM WatsonX.ai and OpenAI, with a modern React frontend and a robust, production-ready Node.js backend.

## Features

- **Water Sustainability Assessment**: Enter country, year, and water usage data to get a sustainability score, category, and improvement suggestions.  
- **AI Chatbot**: Ask water sustainability questions and get answers powered by OpenAI (gpt-4o-mini).  
- **WatsonX Integration**: Backend uses IBM WatsonX.ai for sustainability scoring via a custom machine learning model.  
- **Modern UI**: Responsive React frontend with a clean, single-page layout.  
- **Robust Backend**: Input validation, rate limiting, CORS, error handling, and environment variable management.  

## Project Structure

```
water/
  backend/
    controllers/
      chatbotController.js
      healthController.js
      predictController.js
    routes/
      chatbotRoutes.js
      healthRoutes.js
      predictRoutes.js
    services/
      openaiService.js
      watsonxService.js
      validationService.js
    utils/
      env.js
      logger.js
      rateLimiter.js
    app.js
    server.js
    package.json
    env.example
    countries.json
  frontend/
    public/
      index.html
    src/
      App.js
      App.css
      index.js
      components/
        AssessmentForm.js
        ChatWidget.js
        SustainabilityResult.js
    package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)  
- npm  

### 1. Clone the repository

```bash
git clone 
cd water
```

### 2. Backend Setup

```bash
cd backend
cp env.example .env
# Edit .env and add your API keys and config
npm install
```

#### Required Environment Variables (`backend/.env`)

```
OPENAI_API_KEY=your_openai_api_key_here
IBM_API_KEY=your_ibm_cloud_api_key_here
WATSONX_SCORING_URL=https://your-watsonx-deployment-url
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the App

From the project root, run both frontend and backend together:

```bash
npm run dev
```

Or run separately:

- **Backend**: `cd backend && npm start`  
- **Frontend**: `cd frontend && npm start`  

The frontend will be available at http://localhost:3000 and will proxy API requests to the backend at http://localhost:5000.

### ⚠️ Deployment & API Routing Notes
- The backend Express app should mount routes as follows:
  - In `app.js`:
    ```js
    app.use('/api/predict', require('./routes/predictRoutes'));
    app.use('/api/chat', require('./routes/chatbotRoutes'));
    ```
  - In `routes/predictRoutes.js` and `routes/chatbotRoutes.js`, use `router.post('/', ...)` for both.
- This ensures POST requests to `/api/predict` and `/api/chat` work as documented below.
- If you change the mounting or router paths, update your frontend and documentation accordingly.
- After any backend route changes, **redeploy your backend** (e.g., on Render). Only redeploy the frontend (e.g., on Vercel) if you change frontend code or environment variables.

## API Endpoints

### **POST `/api/predict`**
- **Description**: Assess water sustainability using a custom IBM WatsonX.ai machine learning model trained on the Global Water Consumption Dataset (2000–2024). A new column `sustainability_score` was added to the dataset, and the model predicts this score based on user inputs.  
- **Training Data**: Dataset sourced from Kaggle: Global Water Consumption Dataset (2000–2024), enriched with a `sustainability_score` column for supervised learning.  
- **Dataset Link**: https://www.kaggle.com/datasets/atharvasoundankar/global-water-consumption-dataset-2000-2024  
- **Body**:
  ```json
  {
    "country": "India",
    "year": 2023,
    "totalWaterConsumption": 600,
    "perCapitaWaterUse": 180,
    "agriculturalWaterUse": 75,
    "industrialWaterUse": 15,
    "householdWaterUse": 10,
    "rainfallImpact": 900,
    "groundwaterDepletionRate": 12,
    "waterScarcityLevel": "High"
  }
  ```
- **Response**:
  ```json
  {
    "sustainabilityScore": 45.0,
    "scoreCategory": "Moderate",
    "suggestions": [
      "Encourage reduction in daily water use.",
      "Implement groundwater recharge programs.",
      "Adopt strict water conservation policies.",
      "Encourage efficient irrigation techniques."
    ]
  }
  ```

### **POST `/api/chat`**
- **Description**: Ask the AI chatbot about water sustainability.  
- **Body**:
  ```json
  { "message": "How can I save water at home?" }
  ```
- **Response**:
  ```json
  { "reply": "AI-generated answer from OpenAI." }
  ```

### **GET `/api/health`**
- **Description**: Health check endpoint.  
- **Response**:
  ```json
  { "status": "ok", "timestamp": 1690000000000 }
  ```

## Security & Best Practices

- All secrets are loaded from environment variables.  
- Rate limiting and CORS are enabled and configurable.  
- Input validation is enforced on all endpoints.  
- No sensitive data is logged.  
- Error handling is consistent and safe.  

## Customization

- **Frontend**: Edit `src/components` for UI changes.  
- **Backend**: Add new endpoints in `controllers/`, `routes/`, and `services/`.  
- **Country List**: Update `backend/countries.json` as needed.  

## License

MIT

## Troubleshooting
- If you see `Cannot POST /api/predict` or `Cannot POST /api/chat`, check your backend route mounting and router paths as described above.
- Ensure your backend is redeployed after any code changes.
- If the frontend cannot reach the backend, check that `REACT_APP_API_URL` in your frontend `.env` is set to your backend's deployed URL and redeploy the frontend if changed.