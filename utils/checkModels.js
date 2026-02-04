const genAI = require("../config/gemini");

async function listAvailableModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("\n=== Available Gemini Models ===");
    
    if (data.models) {
      data.models.forEach((model) => {
        console.log(`\nModel: ${model.name}`);
        console.log(`Display Name: ${model.displayName}`);
        console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`);
      });
    }
    
    return data.models;
  } catch (error) {
    console.error("Error listing models:", error.message);
    return null;
  }
}

// Run this to see available models
if (require.main === module) {
  listAvailableModels();
}

module.exports = { listAvailableModels };