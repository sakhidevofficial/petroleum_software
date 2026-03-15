const { body } = require("express-validator");

// Accept number or numeric string; validate after coercion
exports.supplierPaymentValidator = [
  body("supplierId")
    .not().isEmpty().withMessage("Please select a supplier")
    .bail()
    .custom((val) => {
      const n = Number(val);
      if (!Number.isInteger(n) || n < 1) throw new Error("Invalid supplier");
      return true;
    }),
  body("amount")
    .not().isEmpty().withMessage("Please enter valid amount")
    .bail()
    .custom((val) => {
      const n = Number(val);
      if (Number.isNaN(n) || n < 0.01) throw new Error("Amount must be greater than 0");
      return true;
    }),
  body("date")
    .not().isEmpty().withMessage("Please select date"),
];