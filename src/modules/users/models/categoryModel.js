import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Please provide a category"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ categoryName: 1, user: 1 }, { unique: true });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
