import mongoose, { mongo } from "mongoose";

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

transactionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (update.transactionStatus === "failed") {
      const transaction = await this.model.findOne(this.getQuery());

      const bankSampah = await mongoose
        .model("User")
        .findById(transaction.bankSampah);
      const trash = await mongoose.model("Trash").findById(transaction.trash);

      const feePercentage = bankSampah.transactionFee / 100;
      const transactionValue = transaction.trashWeight * trash.trashPrice;
      const fee = transactionValue * feePercentage;

      const customer = await mongoose
        .model("Customer")
        .findById(transaction.customer);
      customer.totalDeposit =
        customer.balance - (transaction.transactionAmount - fee);
      customer.balance =
        customer.balance - (transaction.transactionAmount - fee);
      customer.totalWeight -= transaction.trashWeight;
      await customer.save();

      bankSampah.revenue -= fee;
      bankSampah.totalTrashWeight -= transaction.trashWeight; // Gunakan transaction.trashWeight
      await bankSampah.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

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

      const bankSampah = await mongoose.model("User").findById(this.bankSampah);

      if (!bankSampah) {
        throw new Error("Bank Sampah not found");
      }

      const feePercentage = bankSampah.transactionFee / 100;
      const transactionValue = this.trashWeight * trash.trashPrice;
      const fee = transactionValue * feePercentage;

      this.transactionAmount = transactionValue;

      // Logic menambah dan mengurangi saldo berdasarkan jenis transaksinya
      // 1. Cari dulu customernya
      const customer = await mongoose.model("Customer").findById(this.customer);
      if (customer) {
        customer.balance += this.transactionAmount - fee; // Tambah available balance
        customer.totalDeposit += this.transactionAmount - fee; // Naikin total deposit
        customer.totalWeight += this.trashWeight; // Naikin total sampah

        await customer.save();

        bankSampah.revenue += fee;
        bankSampah.totalTrashWeight += this.trashWeight; // Tambahin total sampah di bank sampah
        await bankSampah.save();
      } else {
        throw new Error("Customer not found");
      }
    } else if (this.transactionType === "withdraw") {
      const customer = await mongoose.model("Customer").findById(this.customer);
      if (customer) {
        if (customer.balance > this.transactionAmount) {
          // Kurangin saldo kalo saldonya cukup dan jenis transaksinya withdraw. Tambahin totalwithdraw
          customer.balance -= this.transactionAmount;
          customer.totalWithdraw += this.transactionAmount;

          await customer.save();
        } else {
          throw new Error("Insufficient balance");
        }
      } else {
        throw new Error("Customer not found");
      }
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
