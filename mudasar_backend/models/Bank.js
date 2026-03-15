const { Schema, model, default: mongoose } = require("mongoose");

//Creating the bank schema
const bankSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  totalCash: {
    type: Number,
    default: 0,
  },
  depositAmount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "deposited"],
    default: "pending",
  },
  date: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

//creating the bank model
const Bank = new model("Bank", bankSchema);
//Exporting the ban model
module.exports = Bank;
