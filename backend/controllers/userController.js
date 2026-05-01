const User = require("../models/User");

// Update Personalized Health Profile
exports.updateProfile = async (
  req,
  res
) => {
  try {
    const {
      age,
      gender,
      conditions,
      habits
    } = req.body;

    // Basic validation
    if (!age || !gender) {
      return res.status(400).json({
        msg:
          "Age and Gender are required"
      });
    }

    // Update user profile
    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          age,
          gender,
          conditions:
            conditions || [],
          habits:
            habits || []
        },
        {
          returnDocument:
            "after"
        }
      ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        msg:
          "User not found"
      });
    }

    res.json({
      msg:
        "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(
      "Profile Update Error:",
      error.message
    );

    res.status(500).json({
      msg:
        "Failed to update profile"
    });
  }
};

// Get Logged-In User Profile
exports.getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        msg:
          "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    res.status(500).json({
      msg:
        "Failed to fetch profile"
    });
  }
};