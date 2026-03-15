const { Schema, model, default: mongoose } = require("mongoose");

//Creating the cash schema
const cashSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  closingId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  cash: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "collected"],
    default: "pending",
  },
  collectionDate: {
    type: String,
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

//creating the cash model
const Cash = new model("Cash", cashSchema);
//Exporting the cash model
module.exports = Cash;
