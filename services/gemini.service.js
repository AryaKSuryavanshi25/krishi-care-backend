const client = require("../config/gemini");

async function fetchDiseaseInfo(crop, disease) {
  try {
    // 1. We call generateContent using the modern SDK structure
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [{
        role: "user",
        parts: [{ 
          text: `You are an Indian agricultural expert. Provide a solution for ${crop} affected by ${disease}. 
          Return ONLY valid JSON with this structure:
          {
            "remedies": [{"title": "", "steps": "", "ingredients": [], "videoUrl": ""}],
            "products": [{"name": "", "brand": "", "price": 0, "usage": "", "buyLink": ""}],
            "avoid": [{"title": "", "reason": ""}]
          }
          Ensure remedies include organic/home-made options popular in India.`
        }]
      }],
      config: {
        // This forces the model to output raw JSON without markdown backticks
        responseMimeType: "application/json", 
      },
    });

    /** * FIX: In the @google/genai SDK, the response is NOT wrapped in .value
     * It is accessed directly as response.text
     */
    const resultText = response.text; 

    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }

    // Parse and return the JSON directly
    return JSON.parse(resultText);

  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    
    // Fallback response for the frontend to prevent crashes
    return {
      remedies: [{
        title: "Expert Advice Temporarily Unavailable",
        steps: "We're experiencing high demand. Please check the YouTube link below for immediate guidance.",
        ingredients: ["Internet Connection"],
        videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(crop + " " + disease + " treatment")}`
      }],
      products: [],
      avoid: []
    };
  }
}

module.exports = { fetchDiseaseInfo };