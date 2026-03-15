const {Schema, model, default: mongoose} = require("mongoose")

//creating the stock schema
const stockSchema = new Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
})

//Creating the Stock Model
const Stock = new model("Stock", stockSchema)
//Exporting stock model from file.
module.exports = Stock