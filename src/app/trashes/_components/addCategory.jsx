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
import { IconInput } from "@/components/ui/icon-input";
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
          className="h-10 gap-2 bg-primary px-4 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          onClick={() => setOpen(true)}
        >
          <LucideCopyPlus size={16} />
          <span>Tambah Kategori</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card !w-[min(94vw,520px)] rounded-lg p-0">
        <DialogHeader className="border-b border-border/60 p-6 pr-12">
          <DialogTitle className="text-xl font-extrabold">
            Tambah Kategori Baru
          </DialogTitle>
          <DialogDescription className="leading-6">
            Buat kelompok material untuk memudahkan pengelolaan sampah.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="font-bold">
              Nama Kategori
            </Label>
            <IconInput
              icon={LucideCopyPlus}
              id="category-name"
              placeholder="Plastik"
              className="glass-input h-11"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              onKeyDown={handledKeyPress}
            />
          </div>
        </div>
        <DialogFooter className="border-t border-border/60 p-6">
          <Button
            variant="outline"
            className="bg-background/60"
            type="button"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button className="font-bold" type="button" onClick={saveCategory}>
            Tambah Baru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
