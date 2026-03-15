const { check } = require("express-validator");


//Export dip validator
exports.dipValidator = [
    check("productId", "Please select fuel type").not().isEmpty(),
    check("dip", "Enter dip reading").not().isEmpty(),
    check("date", "Please enter date").not().isEmpty()
]