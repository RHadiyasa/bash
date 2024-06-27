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
import {
  Copyright,
  EditIcon,
  LayoutGridIcon,
  LucideEye,
  Trash2Icon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import UpdatedCategory from "@/components/category/updateCategory";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TrashCategoryDetails from "@/components/trashCategoryDetails";
import RafiHadiyasa from "@/components/copyright";

const TrashPage = () => {
  const [value, setValue] = useState("trashes");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTrash, setSelectedTrash] = useState(null);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [trashes, setTrashes] = useState([]);

  const fetchTrashes = async () => {
    try {
      const response = await axios.get("/api/users/trash");

      if (response.data.success) {
        setTrashes(response.data.trashes);
      } else {
        toast.error("Gagal memuat sampah");
      }

      // fetch untuk kategori
    } catch (error) {
      return console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/users/category");
      console.log(response);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Gagal memuat kategori");
      }
    } catch (error) {
      return console.error(error);
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const fetchHandler = () => {
    fetchCategories();
    fetchTrashes();
  };

  const handleClickTrash = (trash) => {
    setSelectedTrash(trash);
  };

  const handleClickTrashDetails = useCallback((trash) => {
    setSelectedTrash(trash);
  }, []);

  useEffect(() => {
    if (selectedTrash && !open) {
      router.push(`/trashes/${selectedTrash._id}`);
    }
  }, [selectedTrash]);

  const handleClickCategory = (category) => {
    setSelectedCategory(category);
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
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="grid lg:flex px-5 md:px-8 lg:px-14 mt-5 gap-6">
        <div className="grid w-auto lg:w-2/3">
          <Card className="bg-[#09090B] w-auto">
            <CardHeader className="flex flex-col w-[auto]">
              <span className="font-bold text-2xl">Sampah & Kategori</span>
              <span className="font-normal text-sm text-white/60">
                Trashes and Category
              </span>
            </CardHeader>
          </Card>
          <Card className="bg-[#09090B] mt-5">
            <CardContent>
              <div className="">
                <Tabs defaultValue={value} className="mt-10 w-full">
                  <div className="flex items-center justify-between">
                    <TabsList className="flex-col sm:flex sm:flex-row h-auto gap-1 bg-white/10 border text-foreground">
                      <TabsTrigger
                        value="trashes"
                        className="text-[9pt] md:text-sm"
                        onClick={() => onClickHandle("trashes")}
                      >
                        Daftar Sampah
                      </TabsTrigger>
                      <TabsTrigger
                        value="categories"
                        className="text-[9pt] md:text-sm"
                        onClick={() => onClickHandle("categories")}
                      >
                        Daftar Kategori
                      </TabsTrigger>
                    </TabsList>
                    {value === "trashes" ? (
                      <AddTrash onTrashAdded={fetchHandler} />
                    ) : (
                      <AddCategory onCategoryAdded={fetchHandler} />
                    )}
                    {/* <AddTrash /> */}
                  </div>

                  {/* SAMPAH TABS START */}

                  <TabsContent value="trashes" className="mt-6">
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
                                  <Button
                                    className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-white/10 w-full"
                                    onClick={() =>
                                      handleClickTrashDetails(trash)
                                    }
                                  >
                                    <EditIcon className="w-4" />
                                    <span className="text-sm font-bold">
                                      Update
                                    </span>
                                  </Button>
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
                  </TabsContent>

                  {/* SAMPAH TABS END */}

                  {/* KATEGORI TABS START */}

                  <TabsContent value="categories" className="mt-6">
                    <Table>
                      <TableHeader className="border-t">
                        <TableRow>
                          <TableHead>Kategori</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Tanggal Dibuat
                          </TableHead>
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
                              <TableCell className="hidden sm:table-cell">
                                {formatDateToIndonesian(category.createdAt)}
                              </TableCell>
                              <TableCell className="flex gap-3">
                                {/*UPDATE CATEGORY COMPONENT*/}
                                <UpdatedCategory
                                  _id={category._id}
                                  categoryName={category.categoryName}
                                  onCategoryUpdated={fetchHandler} // Panggil fetchCategories setelah update berhasil
                                />

                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="bg-red-800 text-white hover:bg-red-500 h-8 px-3 flex items-center w-auto gap-2"
                                      size="icon"
                                      onClick={() =>
                                        handleClickCategory(category)
                                      }
                                    >
                                      <Trash2Icon className="w-4" />
                                      <span className="hidden md:flex">Delete</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="flex flex-col bg-white/5 backdrop-blur-sm items-center border-none w-auto h-auto py-14 px-32">
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
            </CardContent>
          </Card>
          <RafiHadiyasa />
        </div>
        <TrashCategoryDetails />
      </div>
    </div>
  );
};

export default TrashPage;
