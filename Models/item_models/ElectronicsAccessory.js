import mongoose from "mongoose";
import Item from "../Item.js";

export default Item.discriminator(
  "ElectronicsAccessory",
  new mongoose.Schema({
    fields: {
      type: {
        type: String,
        required: true,
      },
      compatibility: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      material: {
        type: String,
        required: true,
      },
      wireless: {
        type: Boolean,
        required: true,
      },
      features: {
        type: [String],
        required: true,
      },
      dimensions: {
        type: {
          width: Number,
          height: Number,
          depth: Number,
        },
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
    },
  })
);
