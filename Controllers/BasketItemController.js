import BasketItemModel from "../Models/BasketItem.js";
import UserModel from "../Models/User.js";
import jwt from "jsonwebtoken";

export const create = async (req, res) => {
  try {
    // Trying to find item by provided name and if found increment
    // its amount value, istead of creating a new one.

    await BasketItemModel.findOneAndUpdate(
      { user: req.body._id, name: req.body.name },
      { $inc: { amount: 1 } }, // Increment
      { new: false, upsert: false }
    )
      .then(async (doc) => {
        // If not found, create new item and add to database.
        if (!doc) {
          const item = await new BasketItemModel({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            sale: req.body.sale,
            rating: req.body.rating,
            image: req.body.image,
            amount: req.body.amount,
            user: req.userId,
          }).save();

          await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { $inc: { expences: req.body.price } }, // Increment
            { new: false, upsert: false }
          );

          return res.status(200).json({
            success: true,
            items: item,
          });
        } else {
          await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { $inc: { expences: req.body.price } }, // Increment
            { new: false, upsert: false }
          );

          return res.status(200).json({
            success: true,
            items: doc,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          error: error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // Trying to get all items,
    // populate("user").exec() - to display full user info, insted of token.
    const items = await BasketItemModel.find().populate("user").exec();

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      items: error,
    });
  }
};

export const getAllByUser = async (req, res) => {
  try {
    // Trying to find item by id.
    const item = await BasketItemModel.find({ user: { $eq: req.params.id } });

    if (!item) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        items: item,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // Trying to get one item by id.
    const item = await BasketItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      items: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    // Trying to find item by provided id and if found decrement
    // its amount value, istead of removing full item.
    await BasketItemModel.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { amount: -1 } }, // Decrement
      { new: false, upsert: false }
    )
      .then(async (doc) => {
        console.log("DOC AMOUNT " + doc.amount);
        // If amount is 0 or lower - remove item from database.
        if (doc.amount - 1 <= 0) {
          await BasketItemModel.findOneAndDelete({ _id: req.params.id })
            .then(async () => {
              await UserModel.findOneAndUpdate(
                { _id: req.userId },
                { $inc: { expences: -doc.price } }, // Increment
                { new: false, upsert: false }
              );
              return res.status(200).json({
                success: true,
              });
            })
            .catch(() => {
              return res.status(404).json({
                success: false,
                error: "Not found",
              });
            });
        } else {
          await UserModel.findOneAndUpdate(
            { _id: req.userId },
            { $inc: { expences: -doc.price } }, // Decrement
            { new: false, upsert: false }
          );
          return res.status(200).json({
            success: true,
            items: doc,
          });
        }
      })
      .catch((error) => {
        return res.status(404).json({
          success: false,
          error: "Not found",
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const deleteItem = async (req, res) => {
  await BasketItemModel.findOneAndDelete({ _id: req.params.id })
    .then(async (doc) => {
      await UserModel.findOneAndUpdate(
        { _id: req.userId },
        { $inc: { expences: -doc.price * doc.amount } }, // Increment
        { new: false, upsert: false }
      );
      return res.status(200).json({
        success: true,
      });
    })
    .catch(() => {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    });
};

export const update = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await BasketItemModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        sale: req.body.sale,
        rating: req.body.rating,
        image: req.body.image,
        amount: req.body.amount,
        user: req.userId,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
