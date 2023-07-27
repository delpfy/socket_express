import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
// Validations
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";
import { addingItemValidator } from "./Validations/AddingItem.js";
import { addingReviewValidator } from "./Validations/AddingReview.js";

// checkAuthorization - checks if user is authorized.
import checkAuthorization from "./Utils/checkAuthorization.js";
import checkRole from "./Utils/checkRole.js";

// Controllers
import * as userController from "./Controllers/UserController.js";
import * as itemController from "./Controllers/ItemController.js";
import * as basketController from "./Controllers/BasketItemController.js";
import * as reviewController from "./Controllers/ReviewController.js";

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

app.use(cors({
  origin: ['http://localhost:3000', 'https://socketapp.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
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
  res.status(200).send("Welcome to the backstage");
});

app.get("/authme", checkAuthorization, userController.authorizationStatus);

app.post(
  "/authorize",
  authorizationValidator,
  validationErrorsHandler,
  userController.authorization
);

app.post(
  "/upload",
  checkAuthorization,
  upload.single("image"),
  userController.uploadFile
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

// <Review>
app.post(
  "/reviews",
  checkAuthorization,
  addingReviewValidator,
  validationErrorsHandler,
  reviewController.create
);
app.get("/reviews/:itemId", reviewController.getItemReviews);
app.get(
  "/reviews/user/:userId",
  checkAuthorization,
  reviewController.getUserReviews
);
app.delete(
  "/reviews/:reviewId",
  checkAuthorization,
  reviewController.removeItemReview
);
app.patch(
  "/reviews/:reviewId",
  checkAuthorization,
  addingReviewValidator,
  validationErrorsHandler,
  reviewController.updateItemReview
);
app.patch(
  "/reviews/user/:reviewId",
  checkAuthorization,
  validationErrorsHandler,
  reviewController.updateAllUserReviews
);

//</Review>

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
