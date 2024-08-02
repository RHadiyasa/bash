"use client";
import AddCategory from "@/app/trashes/_components/addCategory";
import HeaderPage from "@/components/header/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RafiHadiyasa from "@/components/copyright";
import AddTrash from "./_components/addTrash";
import {
  deleteOneTrash,
  getAllTrashes,
} from "@/modules/services/trash.service";
import {
  deleteOneCategory,
  getCategory,
} from "@/modules/services/category.service";
import TableTrash from "./_components/tableTrash";
import TableCategory from "./_components/tableCategory";
import UploadExcel from "./_components/excelToJson";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UploadIcon } from "lucide-react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const TrashPage = () => {
  const [value, setValue] = useState("trashes");
  const [trashes, setTrashes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTrash, setSelectedTrash] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTrashes, setLoadingTrashes] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchData = async () => {
    setLoadingTrashes(true);
    try {
      const result = await getAllTrashes(page, 10);

      if (result) {
        const { trashes, totalPages, currentPage } = result;
        setTrashes(trashes || []);
        setTotalPages(totalPages || 1);
        setPage(currentPage || 1);
      } else {
        toast.error("Gagal memuat sampah dan kategori");
      }

      const getTrashCategories = await getCategory();

      if (getTrashCategories) {
        setCategories(getTrashCategories);
      } else {
        toast.error("Gagal memuat sampah dan kategori");
      }
    } catch (error) {
      return console.error(error);
    } finally {
      setLoadingTrashes(false);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (selectedTrash && !open) {
      setLoadingUpdate(true);
      router.push(`/trashes/${selectedTrash._id}`);
    }
  }, [selectedTrash]);

  const fetchHandler = () => {
    fetchData();
  };

  const onClickHandle = (newValue) => {
    setValue(newValue);
  };

  const handleClickTrash = (trash) => {
    setSelectedTrash(trash);
  };

  const handleClickTrashDetails = useCallback((trash) => {
    try {
      setSelectedTrash(trash);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  const handleClickCategory = (category) => {
    setSelectedCategory(category);
  };

  async function deleteTrash() {
    try {
      await deleteOneTrash(selectedTrash._id);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("error : ", error);
    }
  }

  async function deleteCategory() {
    try {
      await deleteOneCategory(selectedCategory._id);
      setOpen(false);
      toast.success("Kategori berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("error : ", error);
    }
  }

  return (
    <div className="min-h-screen bg-earth bg-cover bg-fixed bg-center">
      <HeaderPage />
      <div className="grid lg:flex px-5 md:px-10 lg:px-24 mt-10 gap-6">
        <div className="grid w-full">
          <div className="flex items-center justify-between">
            <div className="grid">
              <span className="font-bold text-2xl lg:text-3xl">Sampah & Kategori</span>
              <span className="font-normal text-sm lg:text-base text-white/60 mt-2">
                Trashes and Category
              </span>
            </div>
            {value === "trashes" ? (
              <div className="grid md:flex items-center gap-2">
                <Popover>
                  <PopoverTrigger className="flex justify-center gap-2 text-sm border font-semibold px-4 py-3 rounded-lg hover:bg-black hover:border-none">
                    <UploadIcon size={16} />
                    <div className="text-xs">Upload data</div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full bg-black/50">
                    <UploadExcel onUploadData={fetchData} />
                  </PopoverContent>
                  <AddTrash onTrashAdded={fetchHandler} />
                </Popover>
              </div>
            ) : (
              <AddCategory onCategoryAdded={fetchHandler} />
            )}
          </div>
          <Card className="bg-black/30 mt-5">
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
                    <div className="">
                      {value === "trashes" ? (
                        <div className="flex items-center gap-4">
                          <div className="flex justify-center lg:justify-end items-center p-4 gap-1 md:gap-3 lg:gap-5">
                            <Button
                              className="bg-transparent text-white hover:bg-white/20 p-2"
                              onClick={handlePreviousPage}
                              disabled={page === 1}
                            >
                              <GrPrevious size={15} />
                            </Button>
                            <span className="text-xs lg:text-sm">
                              Page {page} of {totalPages}
                            </span>
                            <Button
                              className="bg-transparent text-white hover:bg-white/20 p-2"
                              onClick={handleNextPage}
                              disabled={page === totalPages}
                            >
                              <GrNext size={15} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <TableTrash // Table for trashes data and features
                    loadingTrashes={loadingTrashes}
                    trashes={trashes}
                    loadingUpdate={loadingUpdate}
                    open={open}
                    setOpen={setOpen}
                    selectedTrash={selectedTrash}
                    deleteTrash={deleteTrash}
                    handleClickTrash={handleClickTrash}
                    handleClickTrashDetails={handleClickTrashDetails}
                  />
                  <TableCategory // Table for category data and features
                    loadingCategories={loadingCategories}
                    categories={categories}
                    handleClickCategory={handleClickCategory}
                    open={open}
                    setOpen={setOpen}
                    selectedCategory={selectedCategory}
                    fetchHandler={fetchHandler}
                    deleteCategory={deleteCategory}
                  />
                </Tabs>
              </div>
            </CardContent>
          </Card>
          <RafiHadiyasa />
        </div>
        {/* <TrashCategoryDetails /> */}
      </div>
    </div>
  );
};

export default TrashPage;
