const {Schema, model} = require("mongoose")

//Creating the supplier schema
const supplierSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true
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
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "deactive"]
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//creating the supplier model
const Supplier = new model("Supplier", supplierSchema)
//Exporting the supplier model
module.exports = Supplier