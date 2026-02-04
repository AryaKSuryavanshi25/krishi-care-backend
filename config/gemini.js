const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

// The new SDK uses a Client object
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = client;