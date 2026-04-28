const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symptoms: [String],
  riskLevel: String,
  emergency: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);