import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";
import { fetchCategories } from "@/lib/lib/api";
import { Label } from "../ui/label";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const UpdateTrash = ({
  onTrashUpdate,
  _id,
  trashName: existingTrashName,
  trashPrice: existingTrashPrice,
  trashCategory: existingTrashCategory,
  trashDescription: existingTrashDescription,
  images: existingTrashImages,
}) => {
  const [trashName, setTrashName] = useState(existingTrashName || "");
  const [trashPrice, setTrashPrice] = useState(existingTrashPrice || "");
  const [trashCategory, setTrashCategory] = useState(
    existingTrashCategory || ""
  );
  const [trashDescription, setTrashDescription] = useState(
    existingTrashDescription || ""
  );
  const [images, setImages] = useState(existingTrashImages || []);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    existingTrashCategory || ""
  );
  const route = useRouter();

  const setExistingValue = () => {
    console.log("----------------");
    console.log("use1", existingTrashName);
    console.log("use1", existingTrashPrice);
    console.log("use1", existingTrashCategory);
    console.log("use1", existingTrashDescription);
    setTrashName(existingTrashName || "");
    setTrashPrice(existingTrashPrice || "");
    setTrashCategory(existingTrashCategory || "");
    setTrashDescription(existingTrashDescription || "");
    setImages(existingTrashImages || []);
    setSelectedCategory(existingTrashCategory || "");
  };

  useEffect(() => {
    const loadCategory = async () => {
      const token = process.env.TOKEN_SECRET;
      const categoriesData = await fetchCategories(token);
      if (!categoriesData) {
        toast.error("Kategori gagal diambil");
      } else {
        setCategories(categoriesData);
      }
    };
    loadCategory();
  }, []);

  useEffect(() => {
    setExistingValue();
  }, []);

  // useEffect(() => {
  //   console.log("use2")
  //   const loadCategory = async () => {
  //     const token = process.env.TOKEN_SECRET;
  //     const categoriesData = await fetchCategories(token);
  //     if (!categoriesData) {
  //       toast.error("Kategori gagal diambil");
  //     } else {
  //       setCategories(categoriesData);
  //     }
  //   };

  //   loadCategory();
  // }, []);

  const handleCategoryChange = value => {
    setSelectedCategory(value);
  };

  const handleUpdate = async () => {
    if (
      trashName === existingTrashName &&
      trashPrice === existingTrashPrice &&
      selectedCategory._id === existingTrashCategory._id &&
      trashDescription === existingTrashDescription
    ) {
      toast.error("Tidak ada yang berubah");
      return;
    }

    setSelectedCategory(existingTrashCategory);
    try {
      const updatedTrash = {
        _id,
        trashName,
        trashPrice,
        trashCategory: selectedCategory,
        trashDescription,
        images,
      };

      const token = process.env.TOKEN_SECRET;
      const response = await axios.put(
        `/api/users/trash/${updatedTrash._id}`,
        updatedTrash,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        route.push("/trashes");
        toast.success("Sampah berhasil diupdate");
        if (onTrashUpdate) {
          onTrashUpdate(updatedTrash);
        }
      }
    } catch (error) {
      console.error("Error updating trash:", error);
      toast.error("Sampah sudah ada");
    }
  };

  return (
    <div className="grid gap-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 justify-between gap-5">
        <div className="grid gap-2 w-full">
          <div className="font-semibold text-sm">Nama</div>
          <Input
            value={trashName}
            placeholder="Nama sampah baru"
            className="bg-black"
            onChange={event => setTrashName(event.target.value)}
          />
        </div>
        <div className="grid gap-2 w-full">
          <div className="font-semibold text-sm">Harga</div>
          <div className="flex items-center">
            <span className="text-right text-sm font-semibold pr-3">Rp. </span>
            <Input
              value={trashPrice}
              className="bg-black"
              placeholder="Harga (Rupiah)"
              onChange={event => setTrashPrice(event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2 w-full">
          <div className="font-semibold text-sm">Kategori</div>
          <Select
            defaultValue={existingTrashCategory}
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-black">
              <SelectValue
                defaultValue={existingTrashCategory}
                placeholder="Pilih Kategori"
              />
            </SelectTrigger>
            <SelectContent className="bg-black">
              {Array.isArray(categories) &&
                categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2 w-full">
        <div className="font-semibold text-sm">Deskripsi</div>
        <Textarea
          value={trashDescription}
          placeholder="Deskripsi sampah"
          className="bg-black"
          onChange={event => setTrashDescription(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label className="text-left text-sm font-semibold">Gambar</Label>
        <div className="grid gap-2">
          <Label
            htmlFor="picture"
            className="flex gap-2 items-center w-1/3 lg:w-1/4 bg-slate-900 hover:bg-slate-800 text-white/80 text-left font-normal py-4 px-4 rounded-md border cursor-pointer"
          >
            <Upload size={15} />
            Pilih Gambar
          </Label>
          <span className="text-[10pt] font-normal text-white/60">
            Maks 5 gambar
          </span>
        </div>
        <Input className="text-white hidden" id="picture" type="file" />
      </div>
      <div className="grid lg:flex w-full lg:w-1/2 gap-2">
        <Button
          className="font-bold w-full"
          variant="destructive"
          onClick={() => route.push("/trashes")}
        >
          Batal
        </Button>
        <Button className="font-bold w-full" onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default UpdateTrash;
