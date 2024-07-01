import mongoose from "mongoose";

const trashSchema = new mongoose.Schema(
  {
    trashName: {
      type: String,
      required: [true, "Please provide a name"],
    },
    trashPrice: {
      type: Number,
      required: [true, "Please provide trash price"],
      min: 0,
    },
    trashCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    trashDescription: {
      type: String,
    },
    images: [{ type: String }],
    user: { // maksudnya si bank sampah
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changeLogs: [
      {
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        changes: {
          type: Map,
          of: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

trashSchema.index({ trashName: 1, user: 1 }, { unique: true });

const Trash = mongoose.models.Trash || mongoose.model("Trash", trashSchema);
export default Trash;
