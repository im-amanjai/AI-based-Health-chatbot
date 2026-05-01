const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//SIGNUP
exports.signup = async (
  req,
  res
) => {
  const {
    name,
    email,
    password
  } = req.body;

  try {
    // Check existing user
    const existing =
      await User.findOne({
        email
      });

    if (existing) {
      return res.status(400).json({
        msg:
          "User already exists"
      });
    }

    // Hash password
    const hashed =
      await bcrypt.hash(
        password,
        10
      );

    // Create user
    const user =
      await User.create({
        name,
        email,
        password: hashed,

        // Personalized profile fields
        age: null,
        gender: "",
        habits: ""
      });

    res.json({
      msg:
        "User registered successfully"
    });

  } catch (err) {
    console.error(
      "Signup Error:",
      err.message
    );

    res.status(500).json({
      msg:
        "Signup failed"
    });
  }
};

// LOGIN
exports.login = async (
  req,
  res
) => {
  const {
    email,
    password
  } = req.body;

  try {
    // Find user
    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(400).json({
        msg:
          "Invalid credentials"
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        msg:
          "Invalid credentials"
      });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Return safe user object
    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,

        // Personalized profile
        age: user.age,
        gender:
          user.gender,
        habits:
          user.habits,

        createdAt:
          user.createdAt
      }
    });

  } catch (err) {
    console.error(
      "Login Error:",
      err.message
    );

    res.status(500).json({
      msg:
        "Login failed"
    });
  }
};