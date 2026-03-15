const { check } = require("express-validator");


//export machines validator
exports.machineValidator = [
    check("name", "Please enter machine name").not().isEmpty(),
    check("type", "Please select fuel type").not().isEmpty(),
    check("initialReading", "Initial reading must be greater or equal to zero").not().isEmpty(),
    check("status", "Please select status").not().isEmpty()
]