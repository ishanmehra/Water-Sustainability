const { getOpenAIReply } = require('../services/openaiService');

exports.chatbotHandler = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ reply: 'Please enter a valid message.' });
    }
    const reply = await getOpenAIReply(message.trim());
    res.json({ reply });
  } catch (err) {
    next(err);
  }
};
