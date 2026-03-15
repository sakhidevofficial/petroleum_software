const { check, body } = require("express-validator");


//export sale validator
exports.saleValidator = [
    // check("receiptNo", "Please generate receipt No").not().isEmpty(),
    check("customerId", "Customer Id is missing").not().isEmpty(),
    body("items", "Items can not be null").isArray(),
    // check("contact", "Enter the contact number").not().isEmpty(),
    check("paymentMethod", "Please select payment method").not().isEmpty(),
    // check("date", "Provide address of supplier").not().isEmpty(),
    body('items.*.productId', 'Add to cart at least one product').not().isEmpty(),
    body('items.*.quantity', 'Quantity value is missing').not().isEmpty().isInt({ min: 1 }).withMessage('Quantity should be a positive integer'),
]