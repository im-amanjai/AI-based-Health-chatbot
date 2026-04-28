const Log = require("../models/Log");
const { analyzeSymptoms } = require("../utils/riskEngine");
const { getNearbyHospitals } = require("../utils/nearbyService");
const { getAIHealthResponse } = require("../utils/aiService");

// 🧠 POST /api/health/analyze
// Analyze symptoms → Risk Score → Emergency Detection → Nearby Hospitals → AI Advice
exports.analyze = async (req, res) => {
  try {
    const { symptoms, lat, lng } = req.body;

    // Validate symptoms input
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        msg: "Symptoms are required"
      });
    }

    // 🧠 Rule-Based Risk Analysis
    const result = analyzeSymptoms(symptoms);

    // 📍 Nearby hospitals only for emergency cases
    let hospitals = [];
    if (result.emergency && lat && lng) {
      hospitals = await getNearbyHospitals(
        Number(lat),
        Number(lng)
      );
    }

    // 🤖 AI-generated health explanation + preventive tips
    const aiAdvice = await getAIHealthResponse(
      symptoms,
      result.risk
    );

    // 📊 Save health log
    await Log.create({
      userId: req.user.id,
      symptoms,
      riskLevel: result.risk,
      emergency: result.emergency
    });

    // 📤 Final response
    res.json({
      ...result,
      hospitals,
      aiAdvice
    });

  } catch (error) {
    console.error("Health Analysis Error:", error.message);

    res.status(500).json({
      msg: "Health analysis failed"
    });
  }
};

// 📍 GET /api/health/nearby?lat=...&lng=...
// Direct nearby hospitals lookup
exports.getNearby = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        msg: "Latitude and Longitude required"
      });
    }

    const hospitals = await getNearbyHospitals(
      Number(lat),
      Number(lng)
    );

    res.json({
      hospitals
    });

  } catch (error) {
    console.error("Nearby Hospital Error:", error.message);

    res.status(500).json({
      msg: "Failed to fetch nearby hospitals"
    });
  }
};

// 📊 GET /api/health/logs
// Fetch user health history for dashboard
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(logs);

  } catch (error) {
    console.error("Fetch Logs Error:", error.message);

    res.status(500).json({
      msg: "Failed to fetch logs"
    });
  }
};