const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  startTriage,
  submitTriage
} = require("../controllers/triageController");

// 🧠 Start dynamic triage interview
router.post(
  "/start",
  auth,
  startTriage
);

// 📊 Submit answers + get final risk
router.post(
  "/submit",
  auth,
  submitTriage
);

module.exports = router;