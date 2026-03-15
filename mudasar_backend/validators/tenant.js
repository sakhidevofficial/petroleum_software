const { check } = require("express-validator");

//Validate Tenant
exports.validateTenant = [
  check("ownerName", "Name must be between 3 to 30 characters")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 30 }),
  check("username", "Username must be between 4 to 30 characters")
  .not()
  .isEmpty()
  .isLength({ min: 4, max: 50 }),
  check("email", "Please enter a valid email").isEmail().normalizeEmail(),
  check("tenantName", "Tenant Or Organization name must be between 3 to 50 characters")
  .not()
  .isEmpty()
  .isLength({ min: 5, max: 30 }),
  check("contact", "Please enter contact number").not().isEmpty(),
  check("address", "Address must be between 6 to 100 characters")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 100 }),
  check("password", "Password must be aleat 6 characters")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 1024 }),
];

//Validator for Email 
exports.validateEmail = [
  check("email", "Please enter a valid email address")
  .isEmail()
  .normalizeEmail(),
]