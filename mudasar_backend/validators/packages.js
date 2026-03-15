const { check } = require("express-validator");

//Validate Subscription Plan
exports.validatePackages = [
  check("name", "Name must be greater than 4 characters.")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 30 }),
  check("description", "Name must be greater than 4 characters.")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 30 }),
  check("price", "Price can not be null").not().isEmpty(),
  check("expiresInMonths", "Price can not be null").not().isEmpty(),
  check("status", "Please select any status").not().isEmpty(),
];
