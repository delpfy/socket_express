import mongoose from "mongoose";
import Item from "../Item.js";

export default Item.discriminator(
  "Tablet",
  new mongoose.Schema({
    fields: {
      brand: {
        type: String,
        required: true,
      },
      line: {
        type: String,
        required: true,
      },
      preinstalledOS: {
        type: String,
        required: true,
      },
      screenDiagonal: {
        type: Number,
        required: true,
      },
      resolution: {
        type: String,
        required: true,
      },
      matrixType: {
        type: String,
        required: true,
      },
      lightSensor: {
        type: Boolean,
        required: true,
      },
      memoryRAM: {
        type: String,
        required: true,
      },
      builtInMemory: {
        type: String,
        required: true,
      },
      memoryExpansionSlot: {
        type: String,
        required: true,
      },
      processor: {
        type: String,
        required: true,
      },
      processorFrequency: {
        type: String,
        required: true,
      },
      processorCores: {
        type: Number,
        required: true,
      },
      builtInSpeakers: {
        type: Boolean,
        required: true,
      },
      batteryCapacity: {
        type: String,
        required: true,
      },
      frontCamera: {
        type: String,
        required: true,
      },
      rearCamera: {
        type: String,
        required: true,
      },
      wifi: {
        type: String,
        required: true,
      },
      cellularNetwork: {
        type: String,
        required: true,
      },
      voiceCommunication: {
        type: Boolean,
        required: true,
      },
      gps: {
        type: String,
        required: true,
      },
      nfc: {
        type: Boolean,
        required: true,
      },
      externalPorts: {
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
      bodyColor: {
        type: String,
        required: true,
      },
      frontPanelColor: {
        type: String,
        required: true,
      },
    },
  })
);
