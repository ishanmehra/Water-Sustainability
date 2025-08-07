const express = require('express');
const router = express.Router();
const { predictHandler } = require('../controllers/predictController');

router.post('/', predictHandler);

module.exports = router;
