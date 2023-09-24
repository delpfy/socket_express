import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import cron from "node-cron";
import UserModel from "../Models/User.js";
import ItemModel from "../Models/Item.js";

export const checkEmailExistence = async (email, emailConfirmationToken) => {
  let testEmailAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_KEY,
      pass: process.env.PASS_KEY,
    },
  });
  try {
    const result = await transporter.sendMail({
      from: '"Сокет" <nodejs@example.com>',
      to: email,
      subject: "Вітаємо у Сокет!",
      text: "Привіт, це перевірка на те, що введена тобою пошта існує",
      html: `
      <!DOCTYPE html>
      <html>
  <head>
    <meta charset="UTF-8" />
    <style>
          
          a {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            color: black;
            background-color: #ffffff; 
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s linear;
          }

          a:hover {
            background-color: #A0A0A0; 
          }

          a:active {
            background-color: #A0A0A0; 
          }

        </style>
  </head>
  <body
    style="
      background-color: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Roboto Light', sans-serif;
      color: white;
      text-align: center;
      margin: 0;
      padding: 0;
    "
  >
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
      <div
        style="
          display: flex;
          justify-content: center;
          text-align: center;
          width: 100%;
          margin-bottom: 20px;
          margin-top: 10px;
          margin-left: 211px;
        "
      >
        <h1 style="font-size: 38px; margin: 0">Socket</h1>
        <p style="font-size: 24px;  margin-bottom: 50px; margin-top: 0px">.store</p>
      </div>
      <p style="font-size: 24px; margin-bottom: 50px">Вітаємо у Socket.store</p>
      <div style=" margin-top: 60px; margin-bottom: 60px">
        <p style="font-size: 24px; margin-bottom: 50px; text-align: left; color: white">
        Привіт, щоб підтвердити створення облікового запису в Sockek.store, перейдіть по кнопці знизу
        </p>
        <a style = "color: black" href="${`https://socketapp.vercel.app/confirm-email/${emailConfirmationToken}`}">Підтвердити адресу</a>
      </div>
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

const createProductHTML = (item) => {
  return `
    <div style="display: inline-block; width: 40%; margin: 1%; text-align: center; border: 1px solid #ccc;">
      <img src="https://www.sidebyside-tech.com${item.image[0]}" alt="${
    item.image[0]
  }" style="max-width: 100%; height: auto;">
      <p>${item.name}</p>

      <p>Ціна: ${
        item.price - Math.round((item.price * item.sale) / 100)
      } ₴.</p>
    </div>
  `;
};

const sendNewsletter = async () => {
  try {
    const users = await UserModel.find({ newsletterSub: true });
    const items = await ItemModel.find().sort({ createdAt: -1 }).limit(6);

    const productHTML = items.map(createProductHTML).join("");

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

    for (const user of users) {
      const message = {
        from: '"Сокет" <nodejs@example.com>',
        to: user.email,
        subject: "Розсилка від Socket.store",
        html: `
        <!DOCTYPE html>
      <html>
  <head>
    <meta charset="UTF-8" />
    <style>

          a:hover {
            background-color: #A0A0A0; 
          }

          a:active {
            background-color: #A0A0A0; 
          }

          body {
            background-color: black
          }

        </style>
  </head>
  <body  >
        <div>
          <h2>Нові товари</h2>
          ${productHTML}
          <div>
          <a style = "color: black" href="https://socketapp.vercel.app/catalog">Каталог</a>
          </div>
        </div>
        </body>
      `,
      };

      await transporter.sendMail(message);
    }

    console.log("Newsletter success");
  } catch (error) {
    console.error("Error:", error.message);
  }
};


cron.schedule("0 0 */3 * *", sendNewsletter);
/* cron.schedule("* * * * *", sendNewsletter); */
//cron.schedule("*/3 * * * *", sendNewsletter);

export const createUser = async (req, res) => {
  // Generating salt to encrypt password.
  const salt = await bcrypt.genSalt(10);
  try {
    const user = await new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      expences: req.body.expences,
      passwordHash: await bcrypt.hash(req.body.password, salt),
      role: req.body.role,
      avatarUrl: req.body.avatar,
      emailConfirmed: true,
      newsletterSub: req.body.newsletterSub,
    }).save();
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("CREATE ERROR \n" + error);
    return res.status(500).json({
      success: false,
      error: "CREATE failed",
    });
  }
};

export const registration = async (req, res) => {
  // Generating salt to encrypt password.
  const salt = await bcrypt.genSalt(10);
  const emailConfirmationToken = (await bcrypt.hash(req.body.email, salt))
    .toString()
    .replace(/[^a-zA-Z0-9]/g, "");

  if (!(await checkEmailExistence(req.body.email, emailConfirmationToken))) {
    return res.status(400).json({
      success: false,
      error: "Email error",
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
      newsletterSub: req.body.newsletterSub,
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

export const newsletterUnsubscribe = async (req, res) => {
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
        newsletterSub: false,
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
    const user = await UserModel.updateOne(
      {
        _id: req.userId,
      },
      {
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash: await bcrypt.hash(req.body.password, salt),
        avatarUrl: req.body.avatarUrl,
        expences: req.body.expences,
        newsletterSub: req.body.newsletterSub,
      },
      { new: true }
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

export const updateSpecificUser = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await UserModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
        newsletterSub: req.body.newsletterSub,
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

export const remove = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const deletedUser = await UserModel.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
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
      

      <!DOCTYPE html>
      <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body
    style="
      background-color: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Roboto Light', sans-serif;
      color: white;
      text-align: center;
      margin: 0;
      padding: 0;
    "
  >
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
      <div
        style="
          display: flex;
          justify-content: center;
          text-align: center;
          width: 100%;
          margin-bottom: 20px;
          margin-top: 10px;
          margin-left: 211px;
        "
      >
        <h1 style="font-size: 38px; margin: 0">Socket</h1>
        <p style="font-size: 24px;  margin-bottom: 50px; margin-top: 0px">.store</p>
      </div>
      <p style="font-size: 24px; margin-bottom: 50px">Відновлення пароля</p>
      <div style=" margin-top: 60px; margin-bottom: 60px">
        <p style="font-size: 24px; margin-bottom: 50px; text-align: left; color: white">
          Привіт, щоб відновити пароль від облікового запису в Socket.store,
          введіть цей код:
        </p>
        <h1 style="font-size: 38px; margin: 0">${resetToken.slice(2, 8)}</h1>
      </div>
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

export const getAllUsers = async (req, res) => {
  try {
    // Finding all orders.
    const users = await UserModel.find();

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};
