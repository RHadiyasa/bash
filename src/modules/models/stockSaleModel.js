import mongoose from "mongoose";

// Transaksi bank sampah -> pengepul (penjualan stok).
// Dipisah dari koleksi Transaction (nasabah -> bank sampah).
// Susut/kelebihan berat 100% jadi profit/loss bank (tidak menyentuh saldo nasabah).
const stockSaleSchema = new mongoose.Schema(
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
    // Berat yang keluar dari stok bank sampah.
    stockOutWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    // Berat hasil timbangan pengepul (basis revenue).
    soldWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    // = stockOutWeight - soldWeight. Positif = susut, negatif = selisih lebih.
    shrinkWeight: {
      type: Number,
      default: 0,
    },
    shrinkReason: {
      type: String,
      enum: ["", "natural", "scale", "process", "loss"],
      default: "",
    },
    sellPricePerKg: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Harga jual master (trash.trashSellPrice) saat penjualan terjadi.
    masterSellPriceSnapshot: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Harga jual berbeda dari harga master saat itu.
    priceChanged: {
      type: Boolean,
      default: false,
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
    },
    cogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },
    buyer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

stockSaleSchema.index({ bankSampah: 1, createdAt: -1 });
stockSaleSchema.index({ bankSampah: 1, trash: 1 });

const StockSale =
  mongoose.models.StockSale || mongoose.model("StockSale", stockSaleSchema);

export default StockSale;
