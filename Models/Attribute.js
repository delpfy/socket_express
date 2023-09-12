import mongoose from "mongoose";

const AttributesSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    attributes: [
      {
        name: {
          type: String,
          required: true,
          unique: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Attributes", AttributesSchema);
