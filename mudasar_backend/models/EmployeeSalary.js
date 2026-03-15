const { Schema, model, default: mongoose } = require("mongoose");


//creating schema for employee salary
const employeeSalarySchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  employeeId: {
    type: mongoose.ObjectId,
    required: true,
  },
  netSalary: {
    type: Number,
    default: 0,
  },
  salaryOfMonth: {
    type: String,
  },
  salaryOfYear: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

//Creating the Employee Salary Model
const EmployeeSalary = new model("EmployeeSalary", employeeSalarySchema);

//Exporting the employee salary
module.exports = EmployeeSalary;
