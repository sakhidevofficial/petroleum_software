const { Schema, model, default: mongoose } = require("mongoose");

//Creating the items schema
const itemsSchema = new Schema({
  productId: {
    type: mongoose.ObjectId,
    required: true,
  },
  priceId: {
    type: mongoose.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

//Creating the Sales schema
const saleSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  receiptNo: {
    type: Number,
    // required: true
  },
  customerId: {
    type: mongoose.ObjectId,
    required: true,
  },
  items: [itemsSchema],

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

//creating the Sale model
const Sale = new model("Sale", saleSchema);
//Exporting the Sale model
module.exports = Sale;
