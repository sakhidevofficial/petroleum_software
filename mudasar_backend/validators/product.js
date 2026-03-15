const { check } = require("express-validator");


//Export product validator
exports.productValidator = [
    check("name", "Enter product name").not().isEmpty(),
    check("type", "Select product type").not().isEmpty(),
    check("costPrice", "Enter cost price").not().isEmpty(),
    check("sellingPrice", "Enter selling price").not().isEmpty(),
    check("status", "Select product status").not().isEmpty()
]