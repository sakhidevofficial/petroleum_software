const {Schema, model} = require("mongoose")

const machineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    initialReading: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    lockStatus: {
        type: String,
        enum: ["open", "locked"],
        default: "open"
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})


const Machine = new model("Machine", machineSchema)

module.exports = Machine