"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { LucideCopyPlus } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import toPascalCase from "@/lib/helpers/toPascalCase";

const AddCategory = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const token = process.env.TOKEN_SECRET;

  const saveCategory = async () => {
    if (!categoryName) {
      toast.error("Kategori tidak boleh kosong");
      return;
    }

    const trashCategory = toPascalCase(categoryName);

    try {
      const response = await axios.post(
        "/api/users/category",
        { trashCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Kategori berhasil ditambahkan");
        setOpen(false);
        setCategoryName("");
        onCategoryAdded();
      } else {
        toast.error(response.data.error || "Gagal menambahkan kategori");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menambahkan kategori");
      console.error(error);
    }
    console.log(categoryName);
  };

  const handledKeyPress = (event) => {
    if (event.key === "Enter") {
      saveCategory();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-white gap-1 flex items-center text-[8pt] md:text-[9pt]"
          onClick={() => setOpen(true)}
        >
          <LucideCopyPlus className="h-4 w-4 md:w-5 md:h-5" />
          <span>Tambah Kategori</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/10 backdrop-blur-sm w-auto">
        <DialogHeader>
          <DialogTitle className="font-bold">Tambah Kategori Baru</DialogTitle>
          <DialogDescription>
            Tambahkan kategori sampah baru, pastikan tidak duplikat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama Kategori
            </Label>
            <Input
              placeholder="Plastik"
              className="col-span-3"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              onKeyPress={handledKeyPress}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-red-900 text-foreground hover:bg-red-900/55"
            type="submit"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button type="submit" onClick={saveCategory}>
            Tambah Baru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
