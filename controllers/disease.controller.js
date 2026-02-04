const DiseaseInfo = require("../models/DiseaseInfo");
const { fetchDiseaseInfo } = require("../services/gemini.service");

exports.viewDisease = async (req, res) => {
  try {
    const { crop, disease } = req.body;

    if (!crop || !disease) {
      return res.status(400).json({ message: "Crop and disease required" });
    }

    // 1. Check cache
    let info = await DiseaseInfo.findOne({ crop, disease });

    if (!info) {
      // 2. Fetch from Gemini
      const aiData = await fetchDiseaseInfo(crop, disease);

      info = await DiseaseInfo.create({
        crop,
        disease,
        remedies: aiData.remedies,
        products: aiData.products,
        avoid: aiData.avoid
      });
    }

    res.json({
      crop,
      disease,
      remedies: info.remedies,
      products: info.products,
      avoid: info.avoid
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch disease info" });
  }
};
