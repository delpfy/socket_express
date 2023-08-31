import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import UserModel from "../Models/User.js";

export const checkEmailExistence = async (email, emailConfirmationToken) => {
  let testEmailAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_KEY ,
      pass: process.env.PASS_KEY ,
    },
  });
  try {
    const result = await transporter.sendMail({
      from: '"Сокет" <nodejs@example.com>',
      to: email,
      subject: "Вітаємо у Сокет!",
      text: "Привіт, це перевірка на те, що введена тобою пошта існує",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333;
          }
          p {
            color: #555;
          }
          
          a {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background-color: #4CAF50; 
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          a:hover {
            background-color: #45a049; 
            transform: scale(1.05); 
          }

          a:active {
            background-color: #3e8940; 
            transform: scale(0.95); 
          }

        </style>
      </head>
      <body>
        <div class="container">
          <h2>Вітаємо у Сокет!</h2>
          <p>Привіт, це перевірка на те, що введена тобою пошта існує. Натисніть на кнопку нижче, щоб підтвердити свою адресу:</p>
          <a href="${`https://socketapp.vercel.app/confirm-email/${emailConfirmationToken}`}">Підтвердити адресу</a>
        </div>
      </body>
      </html>
  `,
    });
    console.log(result.response);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const confirmEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Token is missing",
    });
  }

  try {
    const user = await UserModel.findOneAndUpdate(
      { emailConfirmationToken: token },
      { $unset: { emailConfirmationToken: 1 }, $set: { emailConfirmed: true } },
      { new: true }
    );

    if (user) {
      return res.status(200).json({
        success: true,
        message: "Email confirmed successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Email confirmation error:", error);
    return res.status(500).json({
      success: false,
      error: "Email confirmation failed",
    });
  }
};

export const registration = async (req, res) => {
  // Generating salt to encrypt password.
  const salt = await bcrypt.genSalt(10);
  const emailConfirmationToken = (await bcrypt.hash(req.body.email, salt)).toString().replace(/[^a-zA-Z0-9]/g, "");
  
  if(!await checkEmailExistence(req.body.email, emailConfirmationToken)){
    return res.status(400).json({
      success: false,
      error: "Registration failed",
    });
  }
  try {
    const user = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      expences: req.body.expences,
      passwordHash: await bcrypt.hash(req.body.password, salt),
      role: req.body.role,
      avatarUrl: req.body.avatar,
      emailConfirmationToken: emailConfirmationToken,
      emailConfirmed: false,
    }).save();

    // If successful, generate token, in future it will be decrypted.
    const token = jwt.sign(
      {
        _id: user._id,

        // Adding a new field over default.
        _role: user.role,
      },
      "greeneyes",
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      token: token,
      emailConfirmationToken: emailConfirmationToken,
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
        _role: user.role,
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
    if (user.emailConfirmed) {
      return res.status(200).json({
        success: true,
        user: user,
      });
    } else {
      return res.status(403).json({
        success: false,
        error: "Email not confirmed",
      });
    }
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Not found",
    });
  }
};

export const update = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try {
    // Trying to find item by provided id.
    await UserModel.updateOne(
      {
        _id: req.userId,
      },
      {
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash: await bcrypt.hash(req.body.password, salt),
        avatarUrl: req.body.avatarUrl,
        expences: req.body.expences,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try {
    // Trying to find item by provided id.
    await UserModel.updateOne(
      {
        email: req.body.email,
      },
      {
        passwordHash: await bcrypt.hash(req.body.password, salt),
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};





export const resetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email: { $eq: email } });

  if (user) {
    const salt = await bcrypt.genSalt(5);

    const resetToken = await bcrypt.hash(email, salt);

    let testEmailAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_KEY,
        pass: process.env.PASS_KEY,
      },
    });

    let result = await transporter.sendMail({
      from: '"Сокет" <nodejs@example.com>',
      to: email,
      subject: "Відновлення пароля",
      text: `Ваш код для відновлення пароля: ${resetToken.slice(2, 8)}`,
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #333;
            }
            p {
              color: #555;
            }
            .code {
              font-size: 24px;
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Для відновлення пароля вам потрібно ввести наступний код:</h2>
            <p class="code">${resetToken.slice(2, 8)}</p>
          </div>
        </body>
      </html>
    `,
    });
    if (result.accepted) {
      res.status(200).json({
        success: true,
        token: resetToken,
      });
    } else {
      res.status(400).json({
        success: false,
      });
    }
    console.log(result);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
