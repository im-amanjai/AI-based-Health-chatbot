const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// 🤖 AI Health Explanation + Preventive Advice
exports.getAIHealthResponse = async (
  symptoms,
  risk
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    const prompt = `
You are an AI public health assistant.

User symptoms: ${symptoms.join(", ")}
Risk level: ${risk}

Provide:
1. Possible explanation
2. Preventive tips
3. When to seek medical help

Keep it concise, safe, and easy to understand.
`;

    const result =
      await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error(
      "Gemini AI Error:",
      error.message
    );

    return "Unable to generate AI health advice currently.";
  }
};

// 🧠 Dynamic AI Triage Questions for unknown symptoms/diseases
exports.generateDynamicQuestions = async (
  symptom
) => {
  try {
     const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    const prompt = `
A user reports this disease/symptom: ${symptom}

Generate exactly 3 short medical triage questions:
1. Duration
2. Severity
3. Important related symptom

Rules:
- Keep questions medically relevant
- Keep them short
- Do NOT diagnose
- Return only 3 numbered questions
`;

    const result =
      await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    // Convert Gemini text → clean array
    const questions = text
      .split("\n")
      .map((q) =>
        q.replace(/^\d+[\).\s-]*/, "").trim()
      )
      .filter(Boolean)
      .slice(0, 3);

    // Safety fallback
    if (questions.length < 3) {
      return [
        "How long have you had this issue?",
        "Is it mild, moderate, or severe?",
        "Do you have any additional symptoms?"
      ];
    }

    return questions;

  } catch (error) {
    console.error(
      "Dynamic Question Error:",
      error.message
    );

    // Universal fallback
    return [
      "How long have you had this issue?",
      "Is it mild, moderate, or severe?",
      "Do you have any additional symptoms?"
    ];
  }
};