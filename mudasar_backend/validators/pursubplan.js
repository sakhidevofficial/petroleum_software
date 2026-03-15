const { check } = require("express-validator");

//Validate Subscription Plan
exports.validatePurPlan = [
  check("Phone", "Can not be null").not().isEmpty(),
  check("Cnic", "Please enter last 6 digits of cnic")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 6 }),
  check("PlanPrice", "Price can not be null").not().isEmpty(),
];
