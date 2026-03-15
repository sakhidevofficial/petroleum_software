const { check } = require("express-validator");


//export employee validator
exports.employeeValidator = [
    check("name", "Please enter employee name").not().isEmpty(),
    check("address", "Provide address of employee").not().isEmpty(),
    check("salary", "Provide valid salary of employee").not().isEmpty(),
    check("status", "Please select status").not().isEmpty()
]