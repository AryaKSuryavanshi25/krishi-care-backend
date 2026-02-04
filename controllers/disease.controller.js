const DiseaseInfo = require("../models/DiseaseInfo");
const { fetchDiseaseInfo } = require("../services/gemini.service");

exports.viewDisease = async (req, res) => {
  try {
    const { crop, disease } = req.body;

    if (!crop || !disease) {
      return res.status(400).json({ message: "Crop and disease are required" });
    }

    // 1. Check database cache
    let info = await DiseaseInfo.findOne({ 
      crop: { $regex: new RegExp(`^${crop}$`, 'i') }, 
      disease: { $regex: new RegExp(`^${disease}$`, 'i') } 
    });

    if (info) {
      // 2. Fetch from Gemini Service
      const aiData = await fetchDiseaseInfo(crop, disease);

      // 3. Save to database
      info = await DiseaseInfo.create({
        crop,
        disease,
        remedies: aiData.remedies || [],
        products: aiData.products || [],
        avoid: aiData.avoid || []
      });
    }

    return res.status(200).json(info);

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ message: "Internal server error while fetching disease info" });
  }
};