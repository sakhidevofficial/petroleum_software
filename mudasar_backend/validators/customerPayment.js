const { check } = require("express-validator");


//export customer Payment validator
exports.customerPaymentValidator = [
    check("payingAmount", "Please enter valid amount").not().isEmpty(),
    check("date", "Please select date").not().isEmpty()
]