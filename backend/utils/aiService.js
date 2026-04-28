const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIHealthResponse = async (symptoms, risk) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    const prompt = `
You are a public health assistant.
User symptoms: ${symptoms.join(", ")}
Risk level: ${risk}

Provide:
1. Possible explanation
2. Preventive tips
3. When to seek doctor
Keep response concise and safe.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {
    console.error("Gemini AI Error:", error.message);

    return "Unable to generate AI health advice currently.";
  }
};