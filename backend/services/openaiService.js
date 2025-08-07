const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getOpenAIReply = async (text) => {
  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: text,
    store: false,
  });
  return response.output_text || "Sorry, I couldn't generate a response.";
};
