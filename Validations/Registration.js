import { body } from "express-validator";

export const registrationValidator = [
  body("email", "Wrong format, example: user1@gmail.com").isEmail(),
  body("role", "Wrong role, customer or manager expected")
    .isString()
    .isIn(["customer", "manager"]),
  body("expences", "Wrong format, please provide number value").isNumeric(),
  body("password", "Password should be at least 5 characters length").isLength({
    min: 5,
  }),
  body(
    "fullName",
    "Name should be at least 3 characters length and no more than 20"
  ).isLength({ min: 3, max: 20 }),
  body("avatar", "Avatar should be an URL").optional().isURL(),
];
