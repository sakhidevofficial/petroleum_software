const { Schema, model, default: mongoose } = require("mongoose");

//creating schema for employee Advances payment
const employeePaymentSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  employeeId: {
    type: mongoose.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  prevAdvance: { type: Number },
  remAdvance: { type: Number },

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

//Creating the Employee Advance Model
const EmployeePayment = new model(
  "EmployeePayment",
  employeePaymentSchema
);

//Exporting the employee payment
module.exports = EmployeePayment;
