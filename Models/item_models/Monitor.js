import mongoose from "mongoose";
import Item from "../Item.js";

export default Item.discriminator(
  "Monitor",
  new mongoose.Schema({
    fields: {
      brand: {
        type: String,
        required: true,
      },
      screenDiagonal: {
        type: Number,
        required: true,
      },
      matrixType: {
        type: String,
        required: true,
      },
      aspectRatio: {
        type: String,
        required: true,
      },
      resolution: {
        type: String,
        required: true,
      },
      responseTime: {
        type: Number,
        required: true,
      },
      viewingAngles: {
        type: String,
        required: true,
      },
      backlightType: {
        type: String,
        required: true,
      },
      brightness: {
        type: Number,
        required: true,
      },
      contrastRatio: {
        type: String,
        required: true,
      },
      screenCoating: {
        type: String,
        required: true,
      },
      curvedScreen: {
        type: Boolean,
        required: true,
      },
      refreshRate: {
        type: Number,
        required: true,
      },
    },
  })
);
