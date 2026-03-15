const {Schema, model, default: mongoose} = require("mongoose")

//Creating the price Schema
const priceSchema = new Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true,
    },
    purchaseId: {
        type: mongoose.ObjectId
    },
    remainingStock: {
        type: Number,
        required: true,
        default: 0
    },
    costPrice: {
        type: Number,
        required: true,
    },
    oldSellingPrice: {
        type: Number,
        required: true,
    },
    newSellingPrice: {
        type: Number,
        required: true,
    },
    priceDifference: {
        type: Number,
        required: true,
        default: 0
    },
    differenceValue: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "locked"],
        default: "open"
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//Creating the model schema of price
const Price = new model("Price", priceSchema)

//exporting price model from file
module.exports = Price