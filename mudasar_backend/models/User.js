const mongoose = require("mongoose");

//Creating the User Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
    unique: true,
  },
  access: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  shift: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  pic: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  status: { type: String, enum: ["active", "deactive"], default: "active" },

  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
