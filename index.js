import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcrypt";
import UserModel from "./Models/User.js";

import { validationResult } from "express-validator";
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";
import { addingItemValidator } from "./Validations/AddingItem.js";

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

app.post("/authorize", authorizationValidator, async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: "false",
      error: validationResult(req).array(),
    });
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      console.log("USER NOT FOUND ERROR \n" + error);
      return res.status(404).json({
        success: "false",
        error: "Wrong password or login",
      });
    }

    const isPassValid = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isPassValid) {
      console.log("WRONG PASSWORD ERROR \n" + error);
      return res.status(404).json({
        success: "false",
        error: "Wrong password or login",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "greeneyes",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: "true",
      token: token,
    });
  } catch (error) {
    console.log("LOGIN ERROR \n" + error);
    return res.status(500).json({
      success: "false",
      error: "Authorization failed",
    });
  }
});

app.post("/register", registrationValidator, async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: "false",
      error: validationResult(req).array(),
    });
  }

  const salt = await bcrypt.genSalt(10);

  try {
    const user = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, salt),
      avatarUrl: req.body.avatar,
    }).save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "greeneyes",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: "true",
      token: token,
    });
  } catch (error) {
    console.log("REGISTER ERROR \n" + error);
    return res.status(500).json({
      success: "false",
      error: "Registration failed",
    });
  }
});

app.post("/item/add", addingItemValidator, (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: "false",
      error: validationResult(req).array(),
    });
  }

  res.status(200).json({
    success: "true",
    request: req.body,
  });
});
