const mongoose = require("mongoose");

//Creating the User Schema
const featureSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 30,
  },
  description: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  status: {
    type: String,
    enum: ["active", "deactive"]
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feature = mongoose.model("Feature", featureSchema);
module.exports = Feature;
