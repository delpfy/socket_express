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
        { new: true, upsert: true } 
      )
      .then((doc) => {
        if(!doc){
            const item = new BasketItemModel({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                rating: req.body.rating,
                image: req.body.image,
                amount: req.body.amount,
                user: req.userId,
              }).save();
          
            res.status(200).json({
              success: true,
              item: item,
            });
        }

        return res.status(200).json({
            success: true,
            doc: doc,
          });
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
