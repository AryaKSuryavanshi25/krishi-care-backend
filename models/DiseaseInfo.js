const mongoose = require("mongoose");

const diseaseInfoSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  disease: { type: String, required: true },

  remedies: [
    {
      title: String,
      steps: String,
      videoUrl: String,
      ingredients: [String]
    }
  ],

  products: [
    {
      name: String,
      brand: String,
      price: Number,
      usage: String,
      buyLink: String
    }
  ],

  avoid: [
    {
      title: String,
      reason: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d"   // auto-refresh monthly
  }
});

module.exports = mongoose.model("DiseaseInfo", diseaseInfoSchema);
