const https = require('https');

const IBM_API_KEY = process.env.IBM_API_KEY;
const WATSONX_SCORING_URL = process.env.WATSONX_SCORING_URL;

async function getIAMToken(apiKey) {
  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`;
    const options = {
      hostname: 'iam.cloud.ibm.com',
      port: 443,
      path: '/identity/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) resolve(json.access_token);
          else reject(new Error('No access token found'));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function postJson(url, token, payload) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const data = JSON.stringify(payload);
    const options = {
      hostname,
      port: 443,
      path: pathname + (search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

exports.getWatsonXScore = async (data) => {
  const token = await getIAMToken(IBM_API_KEY);
  const payload = {
    input_data: [{
      fields: [
        "Agricultural Water Use (%)","Country","Groundwater Depletion Rate (%)",
        "Household Water Use (%)","Industrial Water Use (%)","Per Capita Water Use (Liters per Day)",
        "Rainfall Impact (Annual Precipitation in mm)","Total Water Consumption (Billion Cubic Meters)",
        "Water Scarcity Level","Year"
      ],
      values: [[
        data.agriculturalWaterUse, data.country, data.groundwaterDepletionRate,
        data.householdWaterUse, data.industrialWaterUse, data.perCapitaWaterUse,
        data.rainfallImpact, data.totalWaterConsumption,
        data.waterScarcityLevel, data.year
      ]]
    }]
  };
  const result = await postJson(WATSONX_SCORING_URL, token, payload);
  const score = result.predictions?.[0]?.values?.[0]?.[0];
  if (typeof score !== 'number') throw new Error('Invalid response');
  const rounded = parseFloat(score.toFixed(5));
  let category = 'Poor';
  if (score >= 80) category = 'Excellent';
  else if (score >= 60) category = 'Good';
  else if (score >= 40) category = 'Moderate';
  let suggestions = [];
  if (data.perCapitaWaterUse > 150) suggestions.push("Encourage reduction in daily water use.");
  if (data.groundwaterDepletionRate > 10) suggestions.push("Implement groundwater recharge programs.");
  if (data.waterScarcityLevel === 'Extreme' || data.waterScarcityLevel === 'High') suggestions.push("Adopt strict water conservation policies.");
  if (data.industrialWaterUse > 30) suggestions.push("Promote water recycling in industries.");
  if (data.agriculturalWaterUse > 70) suggestions.push("Encourage efficient irrigation techniques.");
  if (data.rainfallImpact < 800) suggestions.push("Invest in rainwater harvesting.");
  if (suggestions.length === 0) suggestions.push("Maintain current water sustainability practices.");
  return { sustainabilityScore: rounded, scoreCategory: category, suggestions };
};
