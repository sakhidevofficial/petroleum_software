const { check } = require("express-validator");


//Export wastage validator
exports.wastageValidator = [
    check("productId", "Please select fuel type").not().isEmpty(),
    check("quantity", "Enter wasted quantity").not().isEmpty(),
    check("date", "Please enter date").not().isEmpty()
]