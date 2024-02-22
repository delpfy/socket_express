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
import * as postController from "./Controllers/PostController.js";
import * as orderController from "./Controllers/OrderController.js";
import * as categoriesController from "./Controllers/CategoryController.js";
import * as attributesController from "./Controllers/AttributesController.js";
import * as bannerController from "./Controllers/BannerController.js";

// validationErrorsHandler - in case that fields are named wrong or their value is invalid.
import validationErrorsHandler from "./Utils/validationErrorsHandler.js";
import multer from "multer";

// Connecting to database.
mongoose
  .connect(
    "mongodb+srv://admin:qqqqqq@cluster0.x5jmimk.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DATABASE OK"))
  .catch((err) => console.log("DATABASE ERROR \n" + err));

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, X-Api-Key"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

const itemImageStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("item_images")) {
      fs.mkdirSync("item_images");
    }
    cb(null, "item_images");
  },
  filename: (_, file, cb) => {
    const formattedDate = new Date()
      .toLocaleString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\D+/g, "_");

    cb(null, `${formattedDate}--${file.originalname}`);
  },
});

const categoryImageStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("category_images")) {
      fs.mkdirSync("category_images");
    }
    cb(null, "category_images");
  },
  filename: (_, file, cb) => {
    const formattedDate = new Date()
      .toLocaleString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\D+/g, "_");

    cb(null, `${formattedDate}--${file.originalname}`);
  },
});

const bannerImageStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("banner_images")) {
      fs.mkdirSync("banner_images");
    }
    cb(null, "banner_images");
  },
  filename: (_, file, cb) => {
    const formattedDate = new Date()
      .toLocaleString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\D+/g, "_");

    cb(null, `${formattedDate}--${file.originalname}`);
  },
});

const itemImageUpload = multer({ storage: itemImageStorage });
const categoryImageUpload = multer({ storage: categoryImageStorage });
const bannerImageUpload = multer({ storage: bannerImageStorage });

// Trying to run server on port 4000.
app.listen(process.env.PORT || 4000, (err) => {
  return err ? console.log("SERVER ERROR \n" + err) : console.log("SERVER OK");
});
app.use(express.json());
app.use("/item_images", express.static("item_images"));
app.use("/category_images", express.static("category_images"));
app.use("/banner_images", express.static("banner_images"));

// <User>
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the backstage");
});

app.get("/authme", checkAuthorization, userController.authorizationStatus);
app.get("/users", userController.getAllUsers);
app.get("/users/:id", userController.getUserById);
app.post("/reset-password", userController.resetPassword);
app.post("/users", userController.createUser);
app.delete("/users/:id", userController.remove);
app.get("/confirm-email", userController.confirmEmail);
app.patch("/update-password", userController.updatePassword);

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

app.post("/unsubscribe", userController.newsletterUnsubscribe);

app.post(
  "/send-urgent-newsletter",
  checkAuthorization,
  validationErrorsHandler,
  registrationValidator,
  userController.sendUrgentNewsletter
);

app.patch(
  "/update",
  validationErrorsHandler,
  registrationValidator,
  userController.update
);

app.patch(
  "/update/:id",

  validationErrorsHandler,
  registrationValidator,
  userController.updateSpecificUser
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
  "/upload",
  checkAuthorization,
  itemImageUpload.array("item_images", 6),
  itemController.uploadFiles
);

app.post(
  "/items",
  checkAuthorization,
  addingItemValidator,
  validationErrorsHandler,
  itemController.create
);
app.get("/items", itemController.getAll);
app.get("/items/:id", itemController.getOne);
app.get("/items/search/:name", itemController.searchItem);
app.get("/items/category/:category", itemController.getOneCategory);
app.get("/items/slug/:slug_str", itemController.getOneBySlug);
app.delete("/items/:id", checkAuthorization, itemController.remove);
app.patch(
  "/items/:id",
  checkAuthorization,
  validationErrorsHandler,
  itemController.update
);
app.patch(
  "/items/update/:id",
  checkAuthorization,
  validationErrorsHandler,
  itemController.updateItemFields
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

// <Posts CRUD>
app.post(
  "/posts",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  postController.create
);
app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getOne);
app.get("/posts/slug/:slug_str", postController.getOneBySlug);
app.delete(
  "/posts/:id",
  checkAuthorization,
  /* checkRole, */ postController.remove
);
app.patch(
  "/posts/:id",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  postController.update
);
// </Posts CRUD>

// <Orders CRUD>
app.post(
  "/orders",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  orderController.create
);
app.get("/orders", orderController.getAll);
app.get("/orders/:id", orderController.getOne);
app.patch("/orders/:id", orderController.update);
app.get("/orders/user/:id", orderController.getByUser);
app.delete(
  "/orders/:id",
  checkAuthorization,
  /* checkRole, */ orderController.remove
);

// </Orders CRUD>

// <ADMIN>

// <categories>
app.post(
  "/categories",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  categoriesController.create
);
app.get("/categories", categoriesController.getAllCategories);
app.get("/categories/:id", categoriesController.getCategoryById);
app.get("/categories/slug/:slug_str", categoriesController.getOneBySlug);
app.get("/categories/search/:name", categoriesController.searchCategory);
app.patch("/categories/:id", categoriesController.update);
app.delete("/categories/:id", checkAuthorization, categoriesController.remove);

app.post(
  "/upload-category-image",
  checkAuthorization,
  categoryImageUpload.single("category_images"),
  categoriesController.uploadFile
);

// </categories>

// <attributes>
app.post(
  "/attributes",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  attributesController.create
);

app.get("/attributes/:category", attributesController.getAttributesByCategory);
app.patch("/attributes/:id", attributesController.update);
app.delete("/attributes/:id", checkAuthorization, attributesController.remove);

// </attributes>

// <banners>
app.post(
  "/upload-banner-image",
  checkAuthorization,
  bannerImageUpload.single("banner_images"),
  bannerController.uploadImage
);
app.post(
  "/banners",
  checkAuthorization,
  /* checkRole, */
  validationErrorsHandler,
  bannerController.create
);

app.get("/banners/", bannerController.getAll);
app.get("/banners/:id", bannerController.getOne);
app.patch("/banners/:id", bannerController.update);
app.delete("/banners/:id", checkAuthorization, bannerController.remove);
// </banners>

// </ADMIN>
