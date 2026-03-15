const { check } = require("express-validator");


//export customer validator
exports.customerValidator = [
    check("name", "Please enter employee name").not().isEmpty(),
    check("contact", "Enter the contact number").not().isEmpty(),
    check("address", "Provide address of employee").not().isEmpty(),
    check("balance", "Provide initial payable of employee").not().isEmpty(),
    check("status", "Please select status").not().isEmpty()
]