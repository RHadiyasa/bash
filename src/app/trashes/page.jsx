"use client";
import AddCategory from "@/components/category/addCategory";
import AddTrash from "@/components/trash/addTrash";
import HeaderPage from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { PenBoxIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { el, id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const TrashPage = () => {
  const [value, setValue] = useState("trashes");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTrash, setSelectedTrash] = useState(null);
  const [open, setOpen] = useState(false);
  const token = process.env.TOKEN_SECRET;

  const [trashes, setTrashes] = useState([]);

  const fetchTrashes = async () => {
    try {
      const response = await axios.get("/api/users/trash", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTrashes(response.data.trashes);
      } else {
        toast.error("Gagal memuat sampah");
      }

      // fetch untuk kategori
    } catch (error) {
      toast.error("An error occurred while fetching trashes");
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/users/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Gagal memuat kategori");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTrashes();
    fetchCategories();
  }, []);

  const onClickHandle = (newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

  const formatDateToIndonesian = (dateString) => {
    return format(parseISO(dateString), "dd MMMM yyyy HH:mm", {
      locale: id,
    });
  };

  const handleClickTrash = (trash) => {
    setSelectedTrash(trash);
  };

  const handleClickCategory = (category) => {
    setSelectedCategory(category);
  };

  const addTrashHandler = () => {
    fetchTrashes();
  };
  const addCategoryHandler = () => {
    fetchCategories(); // This function will be called after adding category
  };

  async function deleteTrash() {
    try {
      const response = await axios.delete(`/api/users/trash`, {
        data: {
          trashId: selectedTrash._id,
        },
      });
      console.log(response.data);
      setOpen(false);
      toast.success("Sampah berhasil dihapus");
      fetchTrashes();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menghapus sampah");
      console.error("error : ", error);
    }
  }

  async function deleteCategory() {
    try {
      const response = await axios.delete(`/api/users/category`, {
        data: {
          categoryId: selectedCategory._id,
        },
      });
      console.log(response.data);
      setOpen(false);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menghapus kategori");
      console.error("error : ", error);
    }
  }

  return (
    <div className="min-h-screen">
      <HeaderPage />
      <div className="p-5 md:p-8 lg:p-14">
        <span className="font-bold text-2xl">Sampah & Kategori</span>
        <br></br>
        <span className="font-semibold text-sm text-white/60">
          Trashes and Category
        </span>
        <div className="">
          <Tabs defaultValue={value} className="mt-10 w-2/3">
            <div className="flex items-center justify-between">
              <TabsList className="flex gap-1 bg-white/20 border text-foreground">
                <TabsTrigger
                  value="trashes"
                  onClick={() => onClickHandle("trashes")}
                >
                  Daftar Sampah
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="hidden sm:flex"
                  onClick={() => onClickHandle("categories")}
                >
                  Daftar Kategori
                </TabsTrigger>
              </TabsList>
              {value === "trashes" ? (
                <AddTrash onTrashAdded={addTrashHandler} />
              ) : (
                <AddCategory onCategoryAdded={addCategoryHandler} />
              )}
              {/* <AddTrash /> */}
            </div>

            {/* SAMPAH TABS START */}

            <TabsContent value="trashes" className="mt-6">
              <Table>
                <TableHeader className="border-t">
                  <TableRow>
                    <TableHead>Nama Sampah</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
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
                      <TableCell>{trash.trashPrice}</TableCell>
                      <TableCell>
                        {formatDateToIndonesian(trash.createdAt)}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          className="bg-green-700 text-white hover:bg-green-500 h-8"
                          size="icon"
                        >
                          <PenBoxIcon className="w-3.5" />
                        </Button>

                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="bg-red-800 text-white hover:bg-red-500 h-8"
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
                            <DialogFooter className={"mt-2"}>
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
            </TabsContent>
            {/* SAMPAH TABS END */}

            {/* KATEGORI TABS START */}

            <TabsContent value="categories" className="mt-6">
              <Table>
                <TableHeader className="border-t">
                  <TableRow>
                    <TableHead>Nama Category</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length == 0 ? (
                    <div className="mt-6 text-left font-bold text-gray-400 px-5">
                      Data kategori kosong
                    </div>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>{category.categoryName}</TableCell>
                        <TableCell>
                          {formatDateToIndonesian(category.createdAt)}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            className="bg-green-700 text-white hover:bg-green-500 h-8"
                            size="icon"
                          >
                            <PenBoxIcon className="w-3.5" />
                          </Button>

                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="bg-red-800 text-white hover:bg-red-500 h-8"
                                size="icon"
                                onClick={() => handleClickCategory(category)}
                              >
                                <Trash2Icon className="w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col bg-white/5 backdrop-blur-sm items-center">
                              <DialogHeader className="items-center">
                                <DialogTitle className="text-2xl font-extrabold uppercase">
                                  HAPUS KATEGORI{" "}
                                  {selectedCategory?.categoryName}
                                </DialogTitle>
                                <DialogDescription className="font-semibold">
                                  {`Apakah Anda yakin ingin menghapus kategori ${selectedCategory?.categoryName}?`}
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className={"mt-2"}>
                                <Button
                                  type="submit"
                                  className="w-40 bg-orange-800 text-foreground hover:bg-orange-800/70"
                                  onClick={deleteCategory}
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
                                Category ID {selectedCategory?._id}
                              </span>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* KATEGORI TABS END */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrashPage;
