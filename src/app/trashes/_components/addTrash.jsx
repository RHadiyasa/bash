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
import { PackagePlusIcon, Upload } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
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
  const [fieldMessage, setFieldMessage] = useState("");
  const [trashDescription, setTrashDescription] = useState("");
  const [trashImages, setTrashImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const token = process.env.TOKEN_SECRET;

  const saveTrash = async () => {
    trashImages;

    if (!trashName || !trashPrice || !selectedCategory) {
      setFieldMessage("Tidak boleh kosong");
      toast.error("Nama, Harga, atau Kategori sampah tidak boleh kosong.");
      return;
    }

    const trashData = {
      trashName,
      trashPrice,
      trashCategory: selectedCategory,
      trashDescription,
      trashImages,
    };

    try {
      const response = await axios.post("/api/users/trash", trashData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Sampah berhasil ditambahkan");
        setOpen(false);
        onTrashAdded();
        setFieldMessage("");

        setTrashName("");
        setTrashPrice("");
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
      const token = localStorage.getItem("token");
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
          className="bg-white gap-1 flex items-center text-[8pt] md:text-[9pt] hover:scale-95 hover:bg-white/20 hover:text-white"
          onClick={() => setOpen(true)}
        >
          <PackagePlusIcon size={18} />
          <span className="text-xs font-semibold">Tambah Sampah</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full md:w-2/3 bg-gray-900/10 backdrop-blur-sm p-10 md:p-16"
        size="lg"
      >
        <DialogHeader>
          <DialogTitle className="font-bold">Tambah Sampah Baru</DialogTitle>
          <DialogDescription>
            Tambahkan sampah baru, pastikan sampah tidak duplikat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-5 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="text-left">
              Nama
            </Label>
            <div className="">
              <Input
                value={trashName}
                placeholder="Nama Sampah"
                className="col-span-3"
                onChange={(event) => setTrashName(event.target.value)}
              />
              {!trashName ? (
                <span className="text-red-400 font-bold text-[10pt]">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="text-left">
              Harga
            </Label>
            <div>
              <Input
                value={trashPrice}
                type="number"
                placeholder="Harga"
                className="col-span-3"
                min={0}
                onChange={(event) => setTrashPrice(event.target.value)}
              />
              {!trashPrice ? (
                <span className="text-red-400 font-bold text-[10pt]">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="text-left">
              Kategori
            </Label>
            <div>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {!selectedCategory ? (
                <span className="text-red-400 font-bold text-[10pt]">
                  {fieldMessage}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-3">
            <Label htmlFor="name" className="text-left">
              Desrkipsi
            </Label>
            <Textarea
              value={trashDescription}
              placeholder="Deskripsi sampah yang akan diupload (Opsional)"
              className="resize-y"
              onChange={(event) => setTrashDescription(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter className={"grid md:flex gap-2 md:gap-0"}>
          <Button className="bg-white" type="submit" onClick={saveTrash}>
            Tambah Baru
          </Button>
          <Button
            className="bg-red-900 text-foreground hover:bg-red-900/55"
            type="submit"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrash;
