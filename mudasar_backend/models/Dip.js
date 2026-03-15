const { Schema, model, default: mongoose } = require("mongoose");

//Creating the Dip Schema
const dipSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  productId: {
    type: mongoose.ObjectId,
    required: true,
  },
  prevDip: {
    type: Number,
    required: true,
  },
  dip: {
    type: Number,
    required: true,
  },
  gain: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["locked", "open"],
    default: "open",
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

//Creating the model schema of dip
const Dip = new model("Dip", dipSchema);

//exporting product model from file
module.exports = Dip;
