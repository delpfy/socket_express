import mongoose from "mongoose";

const BannerSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Banners", BannerSchema);
