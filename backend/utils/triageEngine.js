// 📁 utils/triageEngine.js
// Multi-step rule-based triage scoring engine

exports.calculateTriageRisk = (
  symptom,
  answers
) => {
  try {
    const combinedText = JSON.stringify(
      answers
    ).toLowerCase();

    let score = 0;

    // 🕒 Duration Scoring
    if (
      combinedText.includes("7 days") ||
      combinedText.includes("week") ||
      combinedText.includes("more than 7")
    ) {
      score += 3;
    } else if (
      combinedText.includes("3 days") ||
      combinedText.includes("4 days") ||
      combinedText.includes("5 days")
    ) {
      score += 2;
    } else if (
      combinedText.includes("1 day") ||
      combinedText.includes("2 days")
    ) {
      score += 1;
    }

    // 🔥 Severity Scoring
    if (combinedText.includes("severe")) {
      score += 4;
    } else if (
      combinedText.includes("moderate")
    ) {
      score += 2;
    } else if (combinedText.includes("mild")) {
      score += 1;
    }

    // 🚨 High-Risk Emergency Symptoms
    const emergencyKeywords = [
      "shortness of breath",
      "breathing difficulty",
      "chest tightness",
      "pain spreading",
      "arm pain",
      "jaw pain",
      "bluish lips",
      "bleeding",
      "unconscious",
      "seizure"
    ];

    emergencyKeywords.forEach((keyword) => {
      if (combinedText.includes(keyword)) {
        score += 5;
      }
    });

    // ⚠️ Medium-Risk Symptoms
    const mediumKeywords = [
      "high fever",
      "body pain",
      "vomiting",
      "blurred vision",
      "rash",
      "dehydration",
      "wheezing",
      "dizziness"
    ];

    mediumKeywords.forEach((keyword) => {
      if (combinedText.includes(keyword)) {
        score += 3;
      }
    });

    // 🩺 Symptom-Specific Boost
    const normalizedSymptom =
      symptom.toLowerCase();

    if (
      normalizedSymptom.includes(
        "chest pain"
      )
    ) {
      score += 3;
    }

    if (
      normalizedSymptom.includes(
        "breathing"
      )
    ) {
      score += 3;
    }

    if (
      normalizedSymptom.includes(
        "dengue"
      )
    ) {
      score += 2;
    }

    // 🎯 Final Risk Decision
    if (score >= 10) {
      return {
        risk: "HIGH",
        emergency: true,
        score,
        message:
          "🚨 High-risk condition detected. Seek immediate medical help."
      };
    }

    if (score >= 5) {
      return {
        risk: "MEDIUM",
        emergency: false,
        score,
        message:
          "⚠️ Moderate risk detected. Medical consultation recommended."
      };
    }

    return {
      risk: "LOW",
      emergency: false,
      score,
      message:
        "✅ Low risk currently. Monitor symptoms and follow preventive care."
    };

  } catch (error) {
    console.error(
      "Triage Engine Error:",
      error.message
    );

    return {
      risk: "LOW",
      emergency: false,
      score: 0,
      message:
        "Unable to fully assess risk. Monitor symptoms carefully."
    };
  }
};