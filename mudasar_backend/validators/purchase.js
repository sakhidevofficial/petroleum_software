const { check } = require("express-validator");


//export purchase validator
exports.purchaseValidator = [
    check("productId", "Please select product").not().isEmpty(),
    check("supplierId", "Please select supplier").not().isEmpty(),
    check("quantity", "Please enter quantity").not().isEmpty(),
    check("costPrice", "Please enter cost price").not().isEmpty(),
    check("sellingPrice", "Please enter selling price").not().isEmpty(),
    check("paidAmount", "Please enter total paid amount").not().isEmpty(),
    check("date", "Please select date").not().isEmpty()
]