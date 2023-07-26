import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BasketItem",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    replies: [
      {
        user: {
          type: String,
          required: true,
        },

        userName: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },
      },
    ],

    description: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
    },

    advantages: {
      type: String,
    },

    disadvantages: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", ReviewSchema);
