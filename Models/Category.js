import mongoose from "mongoose";

const SubCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slugString: {
    type: String,
  },
});

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slugString: {
      type: String,
    },
    subcategories: [SubCategorySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
