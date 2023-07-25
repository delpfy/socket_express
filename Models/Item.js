import mongoose from "mongoose";

const ItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    sale: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    reviewsAmount: {
      type: Number,
      required: true,
    },

    image: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", ItemSchema);
