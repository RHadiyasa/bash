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


```


                  {/* <TabsContent value="trashes" className="mt-6">
                    {loadingTrashes ? (
                      <div className="flex items-center gap-3 py-5">
                        <ClipLoader color="#3498db" loading={true} size={20} />
                        Loading Sampah...
                      </div>
                    ) : trashes.length === 0 ? (
                      <div className="p-3 font-semibold">Tidak ada sampah</div>
                    ) : (
                      <Table className="text-[9pt] lg:text-sm">
                        <TableHeader className="border-t">
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Harga/kg
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Tanggal Dibuat
                            </TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trashes.map((trash) => (
                            <TableRow key={trash._id}>
                              <TableCell>{trash.trashName}</TableCell>
                              <TableCell>
                                {trash?.trashCategory?.categoryName}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatRupiah(trash.trashPrice)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDateToIndonesian(trash.createdAt)}
                              </TableCell>
                              <TableCell className="flex gap-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      className="bg-white hover:bg-white/70 h-8"
                                      size="icon"
                                    >
                                      <LayoutGridIcon className="w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    side="top"
                                    className="bg-black/80 backdrop-blur-sm grid w-auto md:gap-1 border md:border-none"
                                  >
                                    <Button className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-white/10 w-full">
                                      <LucideEye className="w-4" />
                                      <span className="text-sm font-bold">
                                        Detail Sampah
                                      </span>
                                    </Button>
                                    <Separator />
                                    {loadingUpdate ? (
                                      <div className="bg-transparent drop-shadow-lg py-2.5 rounded-md text-white flex gap-2 items-center justify-center hover:bg-white/10 w-full">
                                        <Loader2 className="animate-spin w-4" />
                                        <div className="text-sm font-semibold">
                                          Loading...
                                        </div>
                                      </div>
                                    ) : (
                                      <Button
                                        className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-white/10 w-full"
                                        onClick={() =>
                                          handleClickTrashDetails(trash)
                                        }
                                      >
                                        <EditIcon className="w-4" />
                                        <span className="text-sm font-bold">
                                          Update?
                                        </span>
                                      </Button>
                                    )}
                                  </PopoverContent>
                                </Popover>

                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="bg-red-800 text-white hover:bg-red-800/80 h-8"
                                      size="icon"
                                      onClick={() => handleClickTrash(trash)}
                                    >
                                      <Trash2Icon className="w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="flex flex-col bg-white/5 backdrop-blur-sm items-center">
                                    <DialogHeader className="items-center">
                                      <DialogTitle className="text-2xl font-extrabold uppercase">
                                        HAPUS {selectedTrash?.trashName}
                                      </DialogTitle>
                                      <DialogDescription className="font-semibold">
                                        {`Apakah Anda yakin ingin menghapus ${selectedTrash?.trashName}?`}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className={"mt-2 gap-2"}>
                                      <Button
                                        type="submit"
                                        className="w-40 bg-orange-800 text-foreground hover:bg-orange-800/70"
                                        onClick={deleteTrash}
                                      >
                                        Hapus
                                      </Button>
                                      <Button
                                        type="submit"
                                        className="w-40"
                                        onClick={() => setOpen(false)}
                                      >
                                        Batal
                                      </Button>
                                    </DialogFooter>
                                    <span className="text-[8pt] font-light">
                                      Category ID {selectedTrash?._id}
                                    </span>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent> */}

                  {/* SAMPAH TABS END */}
```