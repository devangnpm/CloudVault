const { body, validationResult } = require("express-validator");

module.exports.validateUser = [
  body("username")
    .trim() // Removes leading/trailing whitespace
    .escape() // Escapes HTML characters to prevent XSS attacks
    .not()
    .isEmpty() // Ensures the field is not empty
    .withMessage("Username cannot be empty") // Custom error message if the field is empty
    .bail() // Stops validation if the previous rule fails
    .isLength({ min: 4 }) // Ensures the username has at least 4 characters
    .withMessage("Min 4 characters required") // Custom error message for length validation
    .bail(), // Stops validation if the length check fails
  body("email")
    .trim() // Removes leading/trailing whitespace
    .normalizeEmail() // Converts email to a standard format (e.g., lowercase, removes dots in Gmail addresses)
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 4 })
    .withMessage("Password is invalid")
    .bail(),
  (req, res, next) => {
    // after checks send to next middleware or return error if check fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next(); // pass control to next middleware
  },
];
