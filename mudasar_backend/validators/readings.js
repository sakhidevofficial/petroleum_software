const { check } = require("express-validator");


//export machines validator
exports.readingValidator = [
    check("reading", "Please enter new reading").not().isEmpty(),
    check("salesCash", "Please enter cash sales amount").not().isEmpty(),
    check("date", "date").not().isEmpty(),
]