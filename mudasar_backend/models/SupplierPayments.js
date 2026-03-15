const { Schema, model, default: mongoose } = require("mongoose");

//creating schema for supplier payments
const supplierPaymentsSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  supplierId: {
    type: mongoose.ObjectId,
    required: true,
  },
  prevAmount: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  remAmount: {
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

//Creating the Supplier Payment Model
const SupplierPayment = new model("SupplierPayment", supplierPaymentsSchema);

//Exporting the supplier payment
module.exports = SupplierPayment;
