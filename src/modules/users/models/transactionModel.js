import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    bankSampah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    trash: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trash",
      required: function () {
        return this.transactionType === "deposit";
      },
    },
    trashWeight: {
      type: Number,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["deposit", "withdraw"],
      required: true,
    },
    transactionStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hitung total transaksi dari sampahnya
transactionSchema.pre("save", async function (next) {
  try {
    // Cari sampah yang sesuai dengan ID trash dan ID bankSampahnya

    if (this.transactionType === "deposit") {
      const trash = await mongoose.model("Trash").findOne({
        _id: this.trash,
        user: this.bankSampah,
      });

      if (!trash) {
        throw new Error(
          "Trash not found or does not belong to the specified bankSampah"
        );
      }

      this.transactionAmount = this.trashWeight * trash.trashPrice;
    }

    // Logic menambah dan mengurangi saldo berdasarkan jenis transaksinya
    // 1. Cari dulu customernya
    const customer = await mongoose.model("Customer").findById(this.customer);
    if (customer) {
      // 2. Cek jenis transaksinya
      if (this.transactionType === "deposit") {
        // 3. Tambah saldo kalo deposit dan totalin jumlah deposit yang sudah mereka lakukan
        customer.balance += this.transactionAmount; // Tambah available balance
        customer.totalDeposit += this.transactionAmount; // Naikin total deposit
        customer.totalWeight += this.trashWeight; // Naikin total sampah

        // Kalo withdraw
      } else if (this.transactionType === "withdraw") {
        // Cek saldo dulu
        if (customer.balance > this.transactionAmount) {
          // Kurangin saldo kalo saldonya cukup dan jenis transaksinya withdraw. Tambahin totalwithdraw
          customer.balance -= this.transactionAmount;
          customer.totalWithdraw += this.transactionAmount;
        } else {
          // Kalo saldo ga cukup -> error
          throw new Error("Insufficient balance");
        }
      }

      await customer.save();
    } else {
      throw new Error("Customer not found");
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
export default Transaction;
