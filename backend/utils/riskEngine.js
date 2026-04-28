exports.analyzeSymptoms = (symptoms) => {
  const lower = symptoms.map(s => s.toLowerCase());

  let risk = "LOW";
  let emergency = false;

  if (lower.includes("chest pain") || lower.includes("breathing difficulty")) {
    risk = "HIGH";
    emergency = true;
  } else if (lower.includes("fever") && lower.includes("cough")) {
    risk = "MEDIUM";
  }

  return {
    risk,
    emergency,
    message:
      emergency
        ? "🚨 Possible serious condition. Seek immediate medical help."
        : "Monitor symptoms and consult doctor if needed."
  };
};