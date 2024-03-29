import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    slugString: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
