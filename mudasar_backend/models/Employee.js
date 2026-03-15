const {Schema, model} = require("mongoose")

//Creating the employee schema
const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String
    },
    contact: {
        type: String,
    },
    salary: {
        type: Number,
        required: true,
    },
    advance: {
        type: Number,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "deactive"]
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//creating the employee model
const Employee = new model("Employee", employeeSchema)
//Exporting the employee model
module.exports = Employee