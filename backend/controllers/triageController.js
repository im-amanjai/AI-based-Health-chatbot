const {
  diseaseQuestions,
  fallbackQuestions
} = require("../utils/questionFlow");

const {
  generateDynamicQuestions,
  getAIHealthResponse
} = require("../utils/aiService");

const {
  calculateTriageRisk
} = require("../utils/triageEngine");

const {
  getNearbyHospitals
} = require("../utils/nearbyService");

const Log = require("../models/Log");

// 🧠 STEP 1: Start Triage
// POST /api/triage/start
exports.startTriage = async (
  req,
  res
) => {
  try {
    const { symptom } = req.body;

    if (!symptom) {
      return res.status(400).json({
        msg: "Symptom is required"
      });
    }

    const normalized =
      symptom.toLowerCase().trim();

    let questions = [];

    // 📌 Rule-Based Known Disease
    if (diseaseQuestions[normalized]) {
      questions =
        diseaseQuestions[normalized];
    }

    // 🤖 Unknown Disease → AI Questions
    else {
      questions =
        await generateDynamicQuestions(
          symptom
        );
    }

    // Safety fallback
    if (
      !questions ||
      questions.length === 0
    ) {
      questions = fallbackQuestions;
    }

    res.json({
      symptom,
      questions
    });

  } catch (error) {
    console.error(
      "Start Triage Error:",
      error.message
    );

    res.status(500).json({
      msg: "Failed to start triage"
    });
  }
};

// 🧠 STEP 2: Submit Triage Answers
// POST /api/triage/submit
exports.submitTriage = async (
  req,
  res
) => {
  try {
    const {
      symptom,
      answers,
      lat,
      lng
    } = req.body;

    if (
      !symptom ||
      !answers
    ) {
      return res.status(400).json({
        msg:
          "Symptom and answers are required"
      });
    }

    // 📊 Risk Calculation
    const result =
      calculateTriageRisk(
        symptom,
        answers
      );

    // 📍 Nearby hospitals
    let hospitals = [];

    if (
      result.emergency &&
      lat &&
      lng
    ) {
      hospitals =
        await getNearbyHospitals(
          Number(lat),
          Number(lng)
        );
    }

    // 🤖 AI Advice
    const aiAdvice =
      await getAIHealthResponse(
        [
          symptom,
          ...Object.values(answers)
        ],
        result.risk
      );

    // 📝 Save Log
    await Log.create({
      userId: req.user.id,
      symptoms: [
        symptom,
        ...Object.values(answers)
      ],
      riskLevel: result.risk,
      emergency:
        result.emergency
    });

    // 📤 Final Response
    res.json({
      ...result,
      hospitals,
      aiAdvice
    });

  } catch (error) {
    console.error(
      "Submit Triage Error:",
      error.message
    );

    res.status(500).json({
      msg:
        "Failed to process triage"
    });
  }
};