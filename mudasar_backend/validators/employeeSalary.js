const { check } = require("express-validator");


//export employee salary validator
exports.employeeSalaryValidator = [
    check("status", "Please select salary status").not().isEmpty(),
    check("date", "Please select date").not().isEmpty()
]