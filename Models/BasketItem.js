import mongoose from "mongoose";

const BasketItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    amount: {
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

export default mongoose.model("BasketItem", BasketItemSchema);
