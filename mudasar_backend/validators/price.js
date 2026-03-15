const { check } = require("express-validator");


//export price validator
exports.priceValidator = [
    check("productId", "Please select product").not().isEmpty(),
    check("costPrice", "Provide a valid cost price").not().isEmpty(),
    check("sellingPrice", "Enter the valid selling price").not().isEmpty(),
    check("date", "Select a date").not().isEmpty(),
]