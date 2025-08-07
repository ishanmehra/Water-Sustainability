const { getWatsonXScore } = require('../services/watsonxService');
const { validatePredictInput } = require('../services/validationService');

exports.predictHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const error = validatePredictInput(data);
    if (error) return res.status(400).json({ error });
    const result = await getWatsonXScore(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
