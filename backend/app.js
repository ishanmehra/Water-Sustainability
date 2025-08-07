require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const { validateEnv } = require('./utils/env');
const rateLimiter = require('./utils/rateLimiter');

// Validate environment variables
validateEnv();

const app = express();

// Trust first proxy (needed for correct rate limiting with X-Forwarded-For)
app.set('trust proxy', 1);

// CORS setup (configurable)
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(rateLimiter);

// Mount routes
app.use('/api', require('./routes/chatbotRoutes'));
app.use('/api', require('./routes/predictRoutes'));


// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
