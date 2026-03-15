const {Schema, model} = require("mongoose")

//Creating the product Schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    pic: {
    type: String,
    },
    status: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//Creating the model schema of product
const Product = new model("Product", productSchema)

//exporting product model from file
module.exports = Product