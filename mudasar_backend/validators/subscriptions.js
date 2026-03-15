const { check } = require("express-validator");

//Validate Subscription Plan
exports.validateSubPlan = [
  check("Subscription", "Subscription Plan must be greater than 3 characters.")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 }),
  check("PlanPrice", "Price can not be null").not().isEmpty(),
];
