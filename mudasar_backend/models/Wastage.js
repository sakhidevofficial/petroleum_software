const {Schema, model, default: mongoose} = require("mongoose")

//Creating the Wastage Schema
const wastageSchema = new Schema({
    productId: {
        type: mongoose.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
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

//Creating the model schema of wastage
const Wastage = new model("Wastage", wastageSchema)

//exporting wastage model from file
module.exports = Wastage