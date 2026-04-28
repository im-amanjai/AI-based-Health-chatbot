const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { updateProfile, getProfile } = require("../controllers/userController");

router.put("/profile", auth, updateProfile);
router.get("/profile", auth, getProfile);

module.exports = router;