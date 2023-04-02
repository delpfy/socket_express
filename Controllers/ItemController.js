import ItemModel from "../Models/Item.js";
import { validationResult } from "express-validator";

export const create = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({
      success: false,
      error: validationResult(req).array(),
    });
  }

  try {
    const item = await new ItemModel({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      rating: req.body.rating,
      image: req.body.image,
    }).save();

    return res.status(200).json({
      success: true,
      item: item,
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
    const items = await ItemModel.find();

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
    const item = await ItemModel.findById(req.params.id);
    if(item){
        res.status(200).json({
            success: true,
            items: item,
          });
    }
    
  } catch (error) {
    res.status(500).json({
        success: false,
        items: error,
      });
  }
};

export const remove = async (req, res) => {};

export const update = async (req, res) => {};
