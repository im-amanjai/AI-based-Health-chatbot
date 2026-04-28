const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const { age, gender, conditions, lifestyle } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { age, gender, conditions, lifestyle },
    { new: true }
  );

  res.json(user);
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};