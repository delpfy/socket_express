import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
// Validations
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";
import { addingItemValidator } from "./Validations/AddingItem.js";

// checkAuthorization - checks if user is authorized.
import checkAuthorization from "./Utils/checkAuthorization.js";
import checkRole from "./Utils/checkRole.js";

// Controllers
import * as userController from "./Controllers/UserController.js";
import * as itemController from "./Controllers/ItemController.js";
import * as basketController from "./Controllers/BasketItemController.js";

// validationErrorsHandler - in case that field are named wrong or its value is invalid.
import validationErrorsHandler from "./Utils/validationErrorsHandler.js";
import multer from "multer";

// Connecting to database.
mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.x5jmimk.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => console.log("DATABASE OK"))
  .catch((err) => console.log("DATABASE ERROR \n" + err));

  
const app = express();
var cors = require('cors')
app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if(!fs.existsSync('uploads')){
      fs.mkdirSync('uploads')
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage });

// Trying to run server on port 4000.
app.listen(process.env.PORT || 4000, (err) => {
  return err ? console.log("SERVER ERROR \n" + err) : console.log("SERVER OK");
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// <User>
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.post("/upload", checkAuthorization, upload.single(`image`), (req, res) => {
  res.status(200).json({
    url: `/uploads/${Date.now()}${req.file.originalname}`,
  });
});

app.get("/authme", checkAuthorization, userController.authorizationStatus);

app.post(
  "/authorize",
  authorizationValidator,
  validationErrorsHandler,
  userController.authorization
);

app.post(
  "/register",
  registrationValidator,
  validationErrorsHandler,
  userController.registration
);

app.patch(
  "/update",
  checkAuthorization,
  validationErrorsHandler,
  registrationValidator,
  userController.update
);

// </User>

// <Items CRUD>

app.post(
  "/items",
  checkAuthorization,
  checkRole,
  addingItemValidator,
  validationErrorsHandler,
  itemController.create
);
app.get("/items", itemController.getAll);
app.get("/items/:id", itemController.getOne);
app.get("/items/category/:category", itemController.getOneCategory);
app.delete("/items/:id", checkAuthorization, checkRole, itemController.remove);
app.patch(
  "/items/:id",
  checkAuthorization,
  checkRole,
  addingItemValidator,
  validationErrorsHandler,
  itemController.update
);

// </Items CRUD>

// <Basket items CRUD>

app.post(
  "/basketitems",
  checkAuthorization,
  addingItemValidator,
  validationErrorsHandler,
  basketController.create
);
app.get("/basketitems", checkAuthorization, basketController.getAll);
app.get(
  "/basketitems/user/:id",
  checkAuthorization,
  basketController.getAllByUser
);
app.get("/basketitems/:id", checkAuthorization, basketController.getOne);
app.delete("/basketitems/:id", checkAuthorization, basketController.remove);
app.delete(
  "/basketitems/remove/:id",
  checkAuthorization,
  basketController.deleteItem
);
app.patch(
  "/basketitems/:id",
  checkAuthorization,
  addingItemValidator,
  validationErrorsHandler,
  basketController.update
);

// <Basket items CRUD>
