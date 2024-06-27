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

const UpdateTrash = trash => {
  const [trashName, setTrashName] = useState(trash.trashName || "");
  const [trashPrice, setTrashPrice] = useState(trash.trashPrice || "");
  const [selectedCategory, setSelectedCategory] = useState(
    // Ini pokoknya ID dari si kategori
    trash.trashCategory?._id || ""
  );
  console.log(trash.trashCategory?._id);
  const [trashCategory, setTrashCategory] = useState(
    // kalo ini baru nama kategorinya, sebenernya gabutuh butuh amat ya
    trash.trashCategory?.categoryName || ""
  );
  const [trashDescription, setTrashDescription] = useState(
    trash.trashDescription || ""
  );
  const [images, setImages] = useState(trash.images || []);
  const [categories, setCategories] = useState([]);
  const route = useRouter();

  const existTrashId = trash._id;
  console.log(existTrashId);

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
  }, [
    trashName,
    trashPrice,
    trashCategory.categoryName,
    trashDescription,
    images,
  ]);

  const handleCategoryChange = value => {
    setSelectedCategory(value);
  };

  const handleUpdate = async () => {
    if (
      trashName === trash.trashName &&
      trashPrice === trash.trashPrice &&
      selectedCategory === trash.trashCategory?._id &&
      trashDescription === trash.trashDescription
    ) {
      toast.error("Tidak ada yang berubah");
      return;
    }

    try {
      const updatedTrash = {
        existTrashId,
        trashName,
        trashPrice,
        trashCategory: selectedCategory,
        trashDescription,
        images,
      };

      const token = process.env.TOKEN_SECRET;
      const response = await axios.put(
        `/api/users/trash/${existTrashId}`,
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
        // if (onTrashUpdate) {
        //   onTrashUpdate(updatedTrash);
        // }
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
              type="number"
              onChange={event => setTrashPrice(event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2 w-full">
          <div className="font-semibold text-sm">Kategori</div>
          <Select
            defaultValue={trashCategory}
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-black">
              <SelectValue
                defaultValue={trashCategory}
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
            className="flex gap-2 items-center w-full md:w-1/4 bg-slate-900 hover:bg-slate-800 text-white/80 text-left font-normal py-4 px-4 rounded-md border cursor-pointer"
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
