"use client";
import AddCategory from "@/app/trashes/_components/addCategory";
import HeaderPage from "@/components/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TrashCategoryDetails from "@/components/trashCategoryDetails";
import RafiHadiyasa from "@/components/copyright";
import AddTrash from "./_components/addTrash";
import {
  deleteOneTrash,
  getAllTrashes,
} from "@/modules/users/services/trash.service";
import {
  deleteOneCategory,
  getCategory,
} from "@/modules/users/services/category.service";
import TableTrash from "./_components/tableTrash";
import TableCategory from "./_components/tableCategory";

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
  const router = useRouter();

  const fetchData = async () => {
    setLoadingTrashes(true);
    try {
      const getTrashes = await getAllTrashes();
      const getTrashCategories = await getCategory();

      if (getTrashes) {
        setTrashes(getTrashes);
      } else {
        toast.error("Gagal memuat sampah dan kategori");
      }

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
  }, []);

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
      console.log(error);
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
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="grid lg:flex px-5 md:px-10 lg:px-24 mt-10 gap-6">
        <div className="grid w-auto lg:w-2/3">
          <span className="font-bold text-2xl">Sampah & Kategori</span>
          <span className="font-normal text-sm text-white/60">
            Trashes and Category
          </span>
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
                    <div className="">
                      {value === "trashes" ? (
                        <AddTrash onTrashAdded={fetchHandler} />
                      ) : (
                        <AddCategory onCategoryAdded={fetchHandler} />
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
        <TrashCategoryDetails />
      </div>
    </div>
  );
};

export default TrashPage;
