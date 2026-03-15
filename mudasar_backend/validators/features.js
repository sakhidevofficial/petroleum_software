const { check } = require("express-validator");

//Validate Feature
exports.validateFeature = [
  check("name", "The name must be between 4 to 50 characters")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 50 }),
  check("description", "Description can not be null")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 100 }),
  check("status", "Please select status")
    .not()
    .isEmpty(),
];
