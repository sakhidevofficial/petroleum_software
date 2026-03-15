const { Schema, model, default: mongoose } = require("mongoose");

//creating schema for employee Advances payment
const employeeAdvancesSchema = new Schema({
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
    default: 0,
  },
  description: {
    type: String,
    required: true,
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

//Creating the Employee Advance Model
const EmployeeAdvance = new model("EmployeeAdvance", employeeAdvancesSchema);

//Exporting the employee payment
module.exports = EmployeeAdvance;
