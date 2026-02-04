const genAI = require("../config/gemini");

async function fetchDiseaseInfo(crop, disease) {
  const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

  const prompt = `
You are an agricultural expert.

Crop: ${crop}
Disease: ${disease}

Return STRICT JSON in this format:

{
  "remedies": [
    {
      "title": "",
      "steps": "",
      "ingredients": [],
      "videoUrl": ""
    }
  ],
  "products": [
    {
      "name": "",
      "brand": "",
      "price": 0,
      "usage": "",
      "buyLink": ""
    }
  ],
  "avoid": [
    {
      "title": "",
      "reason": ""
    }
  ]
}

Rules:
- Remedies must be farmer-safe (India)
- Products must be common in India
- Video URLs must be YouTube search links
- Avoid markdown or explanations
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}

module.exports = { fetchDiseaseInfo };
