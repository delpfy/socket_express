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
    subcategories: [SubCategorySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
