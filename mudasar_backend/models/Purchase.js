const {Schema, model, default: mongoose} = require("mongoose")

//Creating the purchase schema
const purchaseSchema = new Schema({

    productId: {
        type: mongoose.ObjectId,
        required: true,
    },
    supplierId: {
        type: mongoose.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    costPrice: {
        type: Number,
        required: true,
        default: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    paidAmount: {
        type: Number,
        required: true,
        default: 0,
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

//creating the purchase model
const Purchase = new model("Purchase", purchaseSchema)
//Exporting the purchase model
module.exports = Purchase