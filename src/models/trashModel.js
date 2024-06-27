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
    user: {
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

// trashSchema.pre("findByIdAndUpdate", async function (nexnpm run devt) {
//   try {
//     const updateFields = this.getUpdate();
//     const changes = {};
//     Object.keys(updateFields).forEach((key) => {
//       if (key !== "_id") {
//         // Exclude _id from changes log
//         changes[key] = updateFields[key];
//       }
//     });

//     const userId = await getDataFromToken(request); // Mendapatkan userId dari query

//     if (!userId) {
//       throw new Error("User ID not found");
//     }

//     // Menyimpan log perubahan ke dalam changeLogs
//     this.findByIdAndUpdate(
//       uswr,
//       {
//         $push: {
//           changeLogs: {
//             modifiedBy: userId,
//             changes: changes,
//           },
//         },
//       },
//       { upsert: true } // Menambahkan opsi upsert untuk memastikan pencatatan log selalu terjadi
//     ).exec();

//     next();
//   } catch (error) {
//     next(error); // Menangani kesalahan dengan memanggil next(error)
//   }
// });

const Trash = mongoose.models.Trash || mongoose.model("Trash", trashSchema);
export default Trash;
