const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: String,
  });

  const User = new mongoose.model("User", userSchema);

  module.exports = User;
  