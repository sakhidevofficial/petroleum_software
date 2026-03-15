const {Schema, model, default: mongoose} = require("mongoose")

//creating schema for customer advnaces 
const customerAdvanceSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    customerId: {
        type: mongoose.ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['locked', 'open'],
        default: 'open'
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
   
})


//Creating the Customer Advance Model
const CustomerAdvance = new model("CustomerAdvance", customerAdvanceSchema)

//Exporting the customer advance
module.exports = CustomerAdvance