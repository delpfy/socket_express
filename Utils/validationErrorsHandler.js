import { validationResult } from "express-validator";

export default (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }
  next();
};
