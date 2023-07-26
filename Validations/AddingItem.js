import { body } from "express-validator";

export const addingItemValidator = [
  body("name", "Name should not be an number").isString(),
  body("description", "Description should not be an number").isString(),
  body("category", "Category should not be an number").isString(),
  body(
    "price",
    "Price should not be an string, and it`s value shouldn`t be less than 0"
  ).isInt({ min: 0 }),
  body(
    "sale",
    "Sale should not be an string, and it`s value should be in range from 0 to 100"
  ).isInt({ min: 0, max: 100 }),
  body(
    "rating",
    "Rating should not be an string and it`s value should be in range from 0 to 5"
  ).isInt({ min: 0, max: 5 }),
  body("image", "More than one image required").isArray(),
];
