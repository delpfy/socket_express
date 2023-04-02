import express from "express";
import mongoose from "mongoose";

import { validationResult } from "express-validator";
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";
import { addingItemValidator } from "./Validations/AddingItem.js";
import * as userController from "./Controllers/UserController.js";
import checkAuthorization from "./Utils/checkAuthorization.js";
import checkRole from "./Utils/checkRole.js";

mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.x5jmimk.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => console.log("DATABASE OK"))
  .catch((err) => console.log("DATABASE ERROR \n" + err));

const app = express();

app.listen("4000", (err) => {
  return err ? console.log("SERVER ERROR \n" + err) : console.log("SERVER OK");
});
app.use(express.json());



app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.get('/authme', checkAuthorization, userController.authorizationStatus)

app.post("/authorize", authorizationValidator, userController.authorization);

app.post("/register", registrationValidator, userController.registration);

app.post("/item/create", checkAuthorization , checkRole ,addingItemValidator, (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  res.status(200).json({
    success: true,
    request: req.body,
  });
});

app.post("/basketitem/create", checkAuthorization , addingItemValidator, (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  res.status(200).json({
    success: true,
    request: req.body,
  });
});
