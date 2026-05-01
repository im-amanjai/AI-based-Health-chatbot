const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      default: null
    },

    gender: {
      type: String,
      default: ""
    },

conditions: {
  type: [String],
  default: []
},

habits: {
  type: [String],
  default: []
}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);