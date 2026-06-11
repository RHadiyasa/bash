import mongoose from "mongoose";

const inventoryStockSchema = new mongoose.Schema(
  {
    bankSampah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trash: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trash",
      required: true,
    },
    trashNameSnapshot: {
      type: String,
      default: "",
    },
    currentWeight: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWeightIn: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWeightSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCostBasis: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSalesRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProfit: {
      type: Number,
      default: 0,
    },
    // Akumulasi susut berat (bisa negatif = selisih lebih). Invarian:
    // totalWeightIn = currentWeight + totalWeightSold + totalShrinkWeight
    totalShrinkWeight: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

inventoryStockSchema.index({ bankSampah: 1, trash: 1 }, { unique: true });
inventoryStockSchema.index({ bankSampah: 1, currentWeight: -1 });

const InventoryStock =
  mongoose.models.InventoryStock ||
  mongoose.model("InventoryStock", inventoryStockSchema);

export default InventoryStock;
