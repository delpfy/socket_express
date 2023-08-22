import mongoose from "mongoose";
import Item from "../Item.js";



export default Item.discriminator(
  "Laptop",
  new mongoose.Schema({
    fields: {
        processor: {
          type: String,
          required: true,
        },
        RAM: {
          type: String,
          required: true,
        },
        brand: {
          type: String,
          required: true,
        },
        series: {
          type: String,
          required: true,
        },
        construction: {
          type: String,
          required: true,
        },
        operatingSystem: {
          type: String,
          required: true,
        },
        screenDiagonal: {
          type: String,
          required: true,
        },
        matrixType: {
          type: String,
          required: true,
        },
        coatingType: {
          type: String,
          required: true,
        },
        resolution: {
          type: String,
          required: true,
        },
        touchScreen: {
          type: Boolean,
          required: true,
        },
        refreshRate: {
          type: String,
          required: true,
        },
        brightness: {
          type: String,
          required: true,
        },
        otherDisplayFeatures: {
          type: String,
          required: true,
        },
        maxRAM: {
          type: String,
          required: true,
        },
        storageType: {
          type: String,
          required: true,
        },
        storageCapacity: {
          type: String,
          required: true,
        },
        opticalDrive: {
          type: Boolean,
          required: true,
        },
        gpuAdapter: {
          type: String,
          required: true,
        },
        externalPorts: {
          type: [String],
          required: true,
        },
        cardReader: {
          type: Boolean,
          required: true,
        },
        webcam: {
          type: Boolean,
          required: true,
        },
        keyboardBacklight: {
          type: Boolean,
          required: true,
        },
        passiveCooling: {
          type: Boolean,
          required: true,
        },
        fingerprintScanner: {
          type: Boolean,
          required: true,
        },
        numericKeypad: {
          type: Boolean,
          required: true,
        },
        intelEvoCertification: {
          type: Boolean,
          required: true,
        },
        ethernetAdapter: {
          type: Boolean,
          required: true,
        },
        wifi: {
          type: String,
          required: true,
        },
        bluetooth: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
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
        bodyMaterial: {
          type: String,
          required: true,
        },
        lidColor: {
          type: String,
          required: true,
        },
        bodyColor: {
          type: String,
          required: true,
        },
        ruggedLaptop: {
          type: Boolean,
          required: true,
        },
      },
  })
);
