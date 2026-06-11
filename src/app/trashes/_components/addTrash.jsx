"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { BanknoteIcon, PackageIcon, PackagePlusIcon } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { IconInput } from "@/components/ui/icon-input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

const AddTrash = ({ onTrashAdded }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [trashName, setTrashName] = useState("");
  const [trashPrice, setTrashPrice] = useState("");
  const [trashSellPrice, setTrashSellPrice] = useState("");
  const [fieldMessage, setFieldMessage] = useState("");
  const [trashDescription, setTrashDescription] = useState("");
  const [trashImages, setTrashImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const saveTrash = async () => {
    if (!trashName || !trashPrice || !selectedCategory) {
      setFieldMessage("Tidak boleh kosong");
      toast.error("Nama, Harga, atau Kategori sampah tidak boleh kosong.");
      return;
    }

    const trashData = {
      trashName,
      trashPrice,
      trashSellPrice: trashSellPrice === "" ? 0 : Number(trashSellPrice),
      trashCategory: selectedCategory,
      trashDescription,
      trashImages,
    };

    try {
      const response = await axios.post("/api/users/trash", trashData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Sampah berhasil ditambahkan");
        setOpen(false);
        onTrashAdded();
        setFieldMessage("");

        setTrashName("");
        setTrashPrice("");
        setTrashSellPrice("");
        setSelectedCategory("");
        setTrashDescription("");
      } else {
        toast.error(response.data.error || "Gagal menambahkan sampah");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menambahkan sampah");
      console.error("Error : ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/users/category", {
        withCredentials: true,
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-10 gap-2 bg-primary px-4 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          onClick={() => setOpen(true)}
        >
          <PackagePlusIcon size={16} />
          <span>Tambah Sampah</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="glass-card max-h-[90vh] !w-[min(94vw,860px)] overflow-y-auto rounded-lg p-0"
      >
        <DialogHeader className="border-b border-border/60 p-6 pr-12">
          <DialogTitle className="text-xl font-extrabold">
            Tambah Sampah Baru
          </DialogTitle>
          <DialogDescription className="leading-6">
            Lengkapi data material untuk katalog transaksi bank sampah.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 p-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="trash-name" className="text-left font-bold">
              Nama
            </Label>
            <div>
              <IconInput
                icon={PackageIcon}
                id="trash-name"
                value={trashName}
                placeholder="Nama Sampah"
                className="glass-input h-11"
                onChange={(event) => setTrashName(event.target.value)}
              />
              {!trashName ? (
                <span className="text-xs font-bold text-destructive">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trash-price" className="text-left font-bold">
              Harga Beli (nasabah)
            </Label>
            <div>
              <IconInput
                icon={BanknoteIcon}
                id="trash-price"
                value={trashPrice}
                type="number"
                placeholder="Harga beli /kg"
                className="glass-input h-11"
                min={0}
                onChange={(event) => setTrashPrice(event.target.value)}
              />
              {!trashPrice ? (
                <span className="text-xs font-bold text-destructive">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trash-sell-price" className="text-left font-bold">
              Harga Jual (pengepul)
            </Label>
            <IconInput
              icon={BanknoteIcon}
              id="trash-sell-price"
              value={trashSellPrice}
              type="number"
              placeholder="Harga jual /kg (opsional)"
              className="glass-input h-11"
              min={0}
              onChange={(event) => setTrashSellPrice(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trash-category" className="text-left font-bold">
              Kategori
            </Label>
            <div>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger
                  id="trash-category"
                  className="glass-input h-11 w-full"
                >
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {!selectedCategory ? (
                <span className="text-xs font-bold text-destructive">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="trash-description" className="text-left font-bold">
              Deskripsi
            </Label>
            <Textarea
              id="trash-description"
              value={trashDescription}
              placeholder="Deskripsi sampah yang akan diupload (Opsional)"
              className="glass-input min-h-28 resize-y"
              onChange={(event) => setTrashDescription(event.target.value)}
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
          <Button className="font-bold" type="button" onClick={saveTrash}>
            Tambah Baru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrash;
