const { Schema, model, default: mongoose } = require("mongoose");

//Creating the expense schema
const expenseSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["locked", "open"],
    default: "open",
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

//creating the expense model
const Expense = new model("Expense", expenseSchema);
//Exporting the expense model
module.exports = Expense;
