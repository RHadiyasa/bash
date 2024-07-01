### TAKUT BANGET LOH
Sebenernya udah gabutuh, tapi takut aja kalo diapus
```
const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/bash");
        const id = res.data.data._id;
        if (id !== params) {
          router.push(`/profile/${id}`);
          toa2st.error("Invalid URL, redirecting...");
        }
        setData(res.data.data.username); 
        setUserId(res.data.data._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
        logout();
      }
    };

    fetchUserDetails();
```

### TRASH PRE SCHEMA
```

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
```