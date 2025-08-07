const express = require('express');
const router = express.Router();
const { chatbotHandler } = require('../controllers/chatbotController');

router.post('/chat', chatbotHandler);

module.exports = router;
