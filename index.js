import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { validationResult } from "express-validator";
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";

mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.x5jmimk.mongodb.net/?retryWrites=true&w=majority"
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

app.post("/authorize", authorizationValidator, (req, res) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: "false",
      error: validationResult(req).array(),
    });
  }

  const token = jwt.sign(
    {
      login: req.body.login,
      password: req.body.password,
      fullName: req.body.fullName,
    },
    "greeneyes"
  );

  res.status(200).json({
    success: "true",
    token: token,
  });

});

app.post("/register", registrationValidator, (req, res) => {

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: "false",
      error: validationResult(req).array(),
    });
  }

  const token = jwt.sign(
    {
      login: req.body.login,
      password: req.body.password,
      fullName: req.body.fullName,
    },
    "greeneyes"
  );

  res.status(200).json({
    success: "true",
    token: token,
  });
  
});
