const mongoose = require("mongoose"); 

const PackageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    // required: true
  },
  expiresInMonths: {
    type: Number,
    required: true
  },
  group: {
    type: Array,
    required: true
  },
  features: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
  }
});

const Package = mongoose.model("Package", PackageSchema);
module.exports = Package;
