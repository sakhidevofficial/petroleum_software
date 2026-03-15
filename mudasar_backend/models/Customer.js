const { Schema, model, default: mongoose } = require("mongoose");

//Creating the customer schema
const customerSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  pic: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "deactive"],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

//creating the customer model
const Customer = new model("Customer", customerSchema);
//Exporting the customer model
module.exports = Customer;
