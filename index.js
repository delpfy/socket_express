import express from "express";
import mongoose from "mongoose";

import { validationResult } from "express-validator";
import { authorizationValidator } from "./Validations/Authorization.js";
import { registrationValidator } from "./Validations/Registration.js";
import { addingItemValidator } from "./Validations/AddingItem.js";

import checkAuthorization from "./Utils/checkAuthorization.js";
import checkRole from "./Utils/checkRole.js";

import * as userController from "./Controllers/UserController.js";
import * as itemController from "./Controllers/ItemController.js";
import * as basketController from "./Controllers/BasketItemController.js";


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

app.post("/items", checkAuthorization , checkRole ,addingItemValidator, itemController.create);
app.get("/items",  itemController.getAll);
app.get("/items/:id", itemController.getOne);
app.delete("/items/:id",  checkAuthorization,checkRole, itemController.remove); 
app.patch("/items/:id",  checkAuthorization, checkRole,  addingItemValidator, itemController.update);

app.post("/basketitems", checkAuthorization , addingItemValidator, basketController.create); 
app.get("/basketitems",  checkAuthorization, basketController.getAll);
app.get("/basketitems/:id", checkAuthorization, basketController.getOne);
app.delete("/basketitems/:id", checkAuthorization, basketController.remove); 
