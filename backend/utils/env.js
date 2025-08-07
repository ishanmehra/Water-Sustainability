const requiredVars = ['OPENAI_API_KEY', 'IBM_API_KEY', 'WATSONX_SCORING_URL'];

function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length) {
    throw new Error('Missing required environment variables: ' + missing.join(', '));
  }
}

module.exports = { validateEnv };
