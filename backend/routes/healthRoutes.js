const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  analyze,
  getNearby,
  getLogs
} = require("../controllers/healthController");

router.post("/analyze", auth, analyze);
router.get("/nearby", auth, getNearby);
router.get("/logs", auth, getLogs);

module.exports = router;