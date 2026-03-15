const { check } = require("express-validator");


//export employee Advance validator
exports.employeeAdvanceValidator = [
    check("amount", "Please enter valid amount").not().isEmpty(),
    // check("status", "Please select status").not().isEmpty(),
    check("date", "Please select date").not().isEmpty(),
]