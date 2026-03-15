const { check, body } = require("express-validator");

//Validator for User
exports.validateUser = [
  check("name", "Name must be between 4 to 30 characters")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 50 }),
  check("username", "Username must be between 4 to 30 characters")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 50 }),
 
  check("contact", "Contact Number must be between 7 to 15 digits").not().isEmpty().isLength({min: 5, max: 15}),
  check("address", "Please enter address").not().isEmpty(),
  check("password", "Password must be at least 6 characters")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 512 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The password does not match");
    }
    //success: Confirm Password matches
    return true;
  }),
];

//Validator for Email 
exports.validateEmail = [
  check("email", "Please enter a valid email address")
  .isEmail()
  .normalizeEmail(),
]


