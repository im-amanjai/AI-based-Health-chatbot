// 📁 utils/questionFlow.js
// Rule-Based Disease/Symptom Specific Question Bank

const diseaseQuestions = {
  // 🚨 Cardiac / Emergency
  "chest pain": [
    "How many days have you had chest pain?",
    "Is the pain mild, moderate, or severe?",
    "Do you also have shortness of breath, sweating, or pain spreading to arm/jaw?"
  ],

  // 🌡️ Fever / Infection
  "fever": [
    "How many days have you had fever?",
    "What is your approximate temperature (mild/moderate/high)?",
    "Do you also have cough, chills, or body pain?"
  ],

  // 🧠 Neurological
  "headache": [
    "How long have you had headache?",
    "Is it mild, moderate, or severe?",
    "Do you have nausea, blurred vision, or sensitivity to light?"
  ],

  // 😮‍💨 Respiratory
  "breathing difficulty": [
    "How long have you had breathing difficulty?",
    "Is it mild, moderate, or severe?",
    "Do you have wheezing, chest tightness, or bluish lips?"
  ],

  "shortness of breath": [
    "How long have you been experiencing shortness of breath?",
    "Is it mild, moderate, or severe?",
    "Do you also have chest pain, wheezing, or dizziness?"
  ],

  // 🤧 Cold / Flu
  "cold and cough": [
    "How many days have you had cold and cough?",
    "Is your cough mild, moderate, or severe?",
    "Do you also have fever, sore throat, or breathing issues?"
  ],

  "cough": [
    "How long have you had cough?",
    "Is it dry or with mucus?",
    "Do you also have fever, chest pain, or breathing difficulty?"
  ],

  // 🤢 Gastrointestinal
  "stomach pain": [
    "How long have you had stomach pain?",
    "Is the pain mild, moderate, or severe?",
    "Do you have vomiting, diarrhea, bloating, or fever?"
  ],

  "vomiting": [
    "How long have you been vomiting?",
    "How frequent is the vomiting?",
    "Do you also have fever, dehydration, or stomach pain?"
  ],

  "diarrhea": [
    "How many days have you had diarrhea?",
    "Is it mild, moderate, or severe?",
    "Do you have dehydration, blood in stool, or fever?"
  ],

  // 🦠 Dengue / Viral
  "dengue": [
    "How many days have you had symptoms?",
    "Do you have high fever, severe body pain, or fatigue?",
    "Do you have rash, bleeding, or vomiting?"
  ],

  // 🩸 Diabetes
  "diabetes": [
    "How long have you noticed symptoms?",
    "Do you experience frequent urination, thirst, or fatigue?",
    "Do you have blurred vision or unexplained weight loss?"
  ],

  // 🫁 Asthma
  "asthma": [
    "How long have you had breathing issues?",
    "Is it mild, moderate, or severe?",
    "Do you have wheezing, chest tightness, or coughing?"
  ],

  // 🦴 Body Pain
  "body pain": [
    "How long have you had body pain?",
    "Is it mild, moderate, or severe?",
    "Do you also have fever, weakness, or swelling?"
  ],

  // 🧴 Skin
  "skin rash": [
    "How long have you had the rash?",
    "Is it mild, moderate, or severe?",
    "Do you have itching, fever, or swelling?"
  ],

  // 🩺 Hypertension
  "high blood pressure": [
    "How long have you been experiencing high blood pressure symptoms?",
    "Do you have headache, dizziness, or chest discomfort?",
    "Is it mild, moderate, or severe?"
  ]
};

// 🌍 Universal fallback for unknown diseases/symptoms
const fallbackQuestions = [
  "How long have you had this issue?",
  "Is it mild, moderate, or severe?",
  "Do you have any additional symptoms or warning signs?"
];

// 🔍 Function to get questions
const getQuestionsForSymptom = (symptom) => {
  if (!symptom) return fallbackQuestions;

  const normalized = symptom.toLowerCase().trim();

  return diseaseQuestions[normalized] || fallbackQuestions;
};

module.exports = {
  diseaseQuestions,
  fallbackQuestions,
  getQuestionsForSymptom
};