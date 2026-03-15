const {Schema, model, default: mongoose} = require("mongoose")

//creating schema for customer payments 
const customerPaymentsSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    customerId: {
        type: mongoose.ObjectId,
        required: true,
    },
    prevAmount: {
        type: Number,
        required: true
    },
    payingAmount: {
        type: Number,
        required: true
    },
    remAmount: {
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


//Creating the Customer Payment Model
const CustomerPayment = new model("CustomerPayment", customerPaymentsSchema)

//Exporting the customer payment
module.exports = CustomerPayment