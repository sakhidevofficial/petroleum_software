const {Schema, model, default: mongoose} = require("mongoose")

const readingSchema = new Schema({
    machineId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    priceId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    newReading: {
        type: Number,
        required: true,
    },
    prevReading: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})


const Reading = new model("Reading", readingSchema)

module.exports = Reading