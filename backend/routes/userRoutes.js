const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  updateProfile,
  getProfile
} = require("../controllers/userController");

//Get logged-in user profile
router.get(
  "/profile",
  auth,
  getProfile
);

//One-time / update profile
router.put(
  "/profile",
  auth,
  updateProfile
);

module.exports = router;