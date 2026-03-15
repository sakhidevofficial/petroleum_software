const { check } = require("express-validator");


//export expense validator
exports.expenseValidator = [
    check("name", "Please enter expense name").not().isEmpty(),
    check("amount", "Enter expense amount").not().isEmpty(),
    check("date", "Select a date").not().isEmpty()
]