import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Models/User.js";



export const registration = async (req, res) => {
  
  // Generating salt to encrypt password.
  const salt = await bcrypt.genSalt(10);

  // Creating new user and saving it to database.
  try {
    const user = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      expences : req.body.expences,
      passwordHash: await bcrypt.hash(req.body.password, salt),
      role : req.body.role,
      avatarUrl: req.body.avatar,
    }).save();

    // If successful, generate token, in future it will be decrypted.
    const token = jwt.sign(
      {
        _id: user._id,

        // Adding a new field over default.
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

    console.log("REGISTER ERROR \n" + error);
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

export const authorization = async (req, res) => {
  
  try {
    // Trying to find user by provided email.
    const user = await UserModel.findOne({ email: req.body.email });
    
    if (!user) {
      console.log("USER NOT FOUND ERROR \n" + error);
      return res.status(404).json({
        success: false,
        error: "Wrong password or login",
      });
    }

    // If user has been found, compare password.
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

    // If all is OK, generate token.
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
    // Get user by id.
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
