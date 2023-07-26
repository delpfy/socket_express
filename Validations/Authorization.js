import { body } from "express-validator";

export const authorizationValidator = [
  body("email", "Wrong format, example: user1@gmail.com").isEmail(),
  body("password", "Password should be at least 5 characters length").isLength({
    min: 5,
  }),
];
