const { check } = require("express-validator");


//export supplier validator
exports.supplierValidator = [
    check("name", "Please enter supplier name").not().isEmpty(),
    check("companyName", "Please enter supplying company name").not().isEmpty(),
    check("contact", "Enter the contact number").not().isEmpty(),
    check("address", "Provide address of supplier").not().isEmpty(),
    check("balance", "Provide initial payable of supplier").not().isEmpty(),
    check("status", "Please select status").not().isEmpty()
]