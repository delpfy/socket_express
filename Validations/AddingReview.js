import { body } from "express-validator";

export const addingReviewValidator = [
  body("description", "Description should not be an number").isString(),
  body("advantages", "Advantages should not be an number").isString(),
  body("disadvantages", "Disadvantages should not be an number").isString(),
  body(
    "rating",
    "Rating should not be an string and its value should be between 0 and 5"
  ).isInt({ min: 0, max: 5 }),
];
