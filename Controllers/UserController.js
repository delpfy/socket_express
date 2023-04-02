import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Models/User.js";

import { validationResult } from "express-validator";

export const registration = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  const salt = await bcrypt.genSalt(10);

  try {
    const user = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, salt),
      role : req.body.role,
      avatarUrl: req.body.avatar,
    }).save();

    const token = jwt.sign(
      {
        _id: user._id,
        _role : user.role
      },
      "greeneyes",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.log("REGISTER ERROR \n" + error);
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

export const authorization = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      console.log("USER NOT FOUND ERROR \n" + error);
      return res.status(404).json({
        success: false,
        error: "Wrong password or login",
      });
    }

    const isPassValid = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isPassValid) {
      console.log("WRONG PASSWORD ERROR \n" + error);
      return res.status(400).json({
        success: false,
        error: "Wrong password or login",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        _role : user.role,
      },
      "greeneyes",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    console.log("LOGIN ERROR \n" + error);
    return res.status(500).json({
      success: false,
      error: "Authorization failed",
    });
  }
};

export const authorizationStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    
    if (!user) {
      return res.status(403).json({
        success: false,
        error: "Not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Not found",
    });
  }
};
