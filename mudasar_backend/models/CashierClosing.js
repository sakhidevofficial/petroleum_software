const {Schema, model, default: mongoose} = require("mongoose")

const itemsSchema = new Schema(
    {
        productId: mongoose.Types.ObjectId,
        priceId: mongoose.Types.ObjectId,
        prevStock: Number,
        newStock: Number,
        quantity: Number,
        testEntry: Number,
        readings: []
    },
)

//Creating the expense schema
const cashierClosingSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    items: [itemsSchema],
    customerDebitIds: [],
    customerCreditIds: [],
    customerAdvanceIds: [],
    employeeDebitIds: [],
    employeeCreditIds: [],
    expensesIds: [],
    stockDipIds: [],
    bankAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['locked', 'open'],
        default: 'open'
    },
    date: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

//creating the cashier closing model
const CashierClosing = new model("CashierClosing", cashierClosingSchema)
//Exporting the expense model
module.exports = CashierClosing