import mongoose from "mongoose";
import Item from "../Item.js";


export default Item.discriminator(
    "CablesAndAdapters",
    new mongoose.Schema({
      fields: {
        brand: {
            type: String,
            required: true,
          },
        connectorType: {
          type: String,
          required: true,
        },
        cableLength: {
          type: String,
          required: true,
        },
        supportedDevices: {
          type: [String],
          required: true,
        },
        compatibility: {
          type: String,
          required: true,
        },
        material: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        packagingContents: {
          type: [String],
          required: true,
        },
        additionalFeatures: {
          type: [String],
          required: true,
        },
      },
    })
  );