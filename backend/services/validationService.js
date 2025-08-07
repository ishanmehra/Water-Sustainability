const Joi = require('joi');

const predictSchema = Joi.object({
  country: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
  totalWaterConsumption: Joi.number().min(0).required(),
  perCapitaWaterUse: Joi.number().min(0).required(),
  agriculturalWaterUse: Joi.number().min(0).max(100).required(),
  industrialWaterUse: Joi.number().min(0).max(100).required(),
  householdWaterUse: Joi.number().min(0).max(100).required(),
  rainfallImpact: Joi.number().min(0).required(),
  groundwaterDepletionRate: Joi.number().min(0).required(),
  waterScarcityLevel: Joi.string().valid('Low','Moderate','High','Extreme').required()
});

exports.validatePredictInput = (data) => {
  const { error } = predictSchema.validate(data);
  return error ? error.details[0].message : null;
};
