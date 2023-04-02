import BasketItemModel from "../Models/BasketItem.js";
import { validationResult } from "express-validator";

export const create = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  try {
    await BasketItemModel.findOneAndUpdate(
      { name: req.body.name },
      { $inc: { amount: 1 } },
      { new: false, upsert: false }
    )
      .then(async (doc) => {
        if (!doc) {
          const item = await new BasketItemModel({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            rating: req.body.rating,
            image: req.body.image,
            amount: req.body.amount,
            user: req.userId,
          }).save();

          return res.status(200).json({
            success: true,
            item: item,
          });
        } else {
          return res.status(200).json({
            success: true,
            doc: doc,
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

export const getOne = async (req, res) => {
  try {
    const item = await BasketItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      item: item,
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
    await BasketItemModel.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { amount: -1 } },
      { new: false, upsert: false }
    )
      .then(async (doc) => {
        if (doc.amount - 1 <= 0) {
          await BasketItemModel.findOneAndDelete({ _id: req.params.id })
            .then(() => {
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
          return res.status(200).json({
            success: true,
            doc: doc,
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
