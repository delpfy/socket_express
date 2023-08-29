import mongoose from "mongoose";
import Item from "../Item.js";

export default Item.discriminator(
  "NetworkEquipment",
  new mongoose.Schema({
    fields: {
        brand: {
            type: String,
            required: true,
          },
      type: {
        type: String,
        required: true,
      },
      ports: {
        type: Number,
        required: true,
      },
      maxSpeed: {
        type: String,
        required: true,
      },
      powerSupply: {
        type: String,
        required: true,
      },
      rackMountable: {
        type: Boolean,
        required: true,
      },
      poeSupport: {
        type: Boolean,
        required: true,
      },
      vpnSupport: {
        type: Boolean,
        required: true,
      },
      firewall: {
        type: Boolean,
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
      color: {
        type: String,
        required: true,
      },
    },
  })
);
