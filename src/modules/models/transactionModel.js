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
    clientRequestId: {
      type: String,
    },
    batchId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const session = this.getOptions().session;
    const nextStatus = update.transactionStatus || update.$set?.transactionStatus;

    if (nextStatus === "failed") {
      const transaction = await this.model
        .findOne(this.getQuery())
        .session(session);

      if (
        !transaction ||
        transaction.transactionStatus === "failed" ||
        transaction.transactionType !== "deposit"
      ) {
        return next();
      }

      const trash = await mongoose
        .model("Trash")
        .findById(transaction.trash)
        .session(session);
      const bankSampah = await mongoose
        .model("User")
        .findById(transaction.bankSampah)
        .select("transactionFee")
        .session(session);

      const feePercentage = bankSampah.transactionFee / 100;
      const transactionValue = transaction.trashWeight * trash.trashPrice;
      const fee = transactionValue * feePercentage;

      await mongoose.model("Customer").updateOne(
        { _id: transaction.customer },
        {
          $inc: {
            totalDeposit: -(transaction.transactionAmount - fee),
            balance: -(transaction.transactionAmount - fee),
            totalWeight: -transaction.trashWeight,
          },
        },
        { session }
      );

      await mongoose.model("User").updateOne(
        { _id: transaction.bankSampah },
        {
          $inc: {
            revenue: -fee,
            totalTrashWeight: -transaction.trashWeight,
          },
        },
        { session }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Hitung total transaksi dari sampahnya
transactionSchema.pre("save", async function (next) {
  try {
    const session = this.$session();
    // Cari sampah yang sesuai dengan ID trash dan ID bankSampahnya

    if (this.transactionType === "deposit") {
      const trash = await mongoose.model("Trash").findOne({
        _id: this.trash,
        user: this.bankSampah,
      }).session(session);

      if (!trash) {
        throw new Error(
          "Trash not found or does not belong to the specified bankSampah"
        );
      }

      const bankSampah = await mongoose
        .model("User")
        .findById(this.bankSampah)
        .select("transactionFee")
        .session(session);

      if (!bankSampah) {
        throw new Error("Bank Sampah not found");
      }

      const feePercentage = bankSampah.transactionFee / 100;
      const transactionValue = this.trashWeight * trash.trashPrice;
      const fee = transactionValue * feePercentage;

      this.transactionAmount = transactionValue;

      // Logic menambah dan mengurangi saldo berdasarkan jenis transaksinya
      // 1. Cari dulu customernya
      const customer = await mongoose
        .model("Customer")
        .findById(this.customer)
        .select("_id")
        .session(session);
      if (customer) {
        await mongoose.model("Customer").updateOne(
          { _id: this.customer },
          {
            $inc: {
              balance: this.transactionAmount - fee,
              totalDeposit: this.transactionAmount - fee,
              totalWeight: this.trashWeight,
            },
          },
          { session }
        );

        await mongoose.model("User").updateOne(
          { _id: this.bankSampah },
          {
            $inc: {
              revenue: fee,
              totalTrashWeight: this.trashWeight,
            },
          },
          { session }
        );
      } else {
        throw new Error("Customer not found");
      }
    } else if (this.transactionType === "withdraw") {
      const customer = await mongoose
        .model("Customer")
        .findById(this.customer)
        .session(session);
      if (customer) {
        if (customer.balance >= this.transactionAmount) {
          // Kurangin saldo kalo saldonya cukup dan jenis transaksinya withdraw. Tambahin totalwithdraw
          await mongoose.model("Customer").updateOne(
            { _id: this.customer },
            {
              $inc: {
                balance: -this.transactionAmount,
                totalWithdraw: this.transactionAmount,
              },
            },
            { session }
          );
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

transactionSchema.index({ bankSampah: 1, createdAt: -1 });
transactionSchema.index({ bankSampah: 1, customer: 1 });
transactionSchema.index({ bankSampah: 1, transactionStatus: 1 });
transactionSchema.index({ bankSampah: 1, transactionType: 1 });
transactionSchema.index(
  { bankSampah: 1, clientRequestId: 1 },
  { unique: true, sparse: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
export default Transaction;
