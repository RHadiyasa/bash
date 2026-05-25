import { useEffect, useState } from "react";
import { IconInput } from "@/components/ui/icon-input";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import toast from "react-hot-toast";
import { fetchCategories } from "@/lib/api";
import { Label } from "../../../../components/ui/label";
import {
  BanknoteIcon,
  FileTextIcon,
  ImageIcon,
  Layers3Icon,
  Loader2,
  PackageIcon,
  SaveIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const UpdateTrash = (trash) => {
  const token = null;

  const [trashName, setTrashName] = useState(trash.trashName || "");
  const [trashPrice, setTrashPrice] = useState(trash.trashPrice || "");
  const [trashSellPrice, setTrashSellPrice] = useState(
    trash.trashSellPrice ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    // Ini pokoknya ID dari si kategori
    trash.trashCategory?._id || ""
  );
  const trashCategory = trash.trashCategory?.categoryName || "";
  const [trashDescription, setTrashDescription] = useState(
    trash.trashDescription || ""
  );
  const [images] = useState(trash.images || []);
  const [categories, setCategories] = useState([]);
  const route = useRouter();
  const [loading, setLoading] = useState(false);

  const existTrashId = trash._id;

  useEffect(() => {
    const loadCategory = async () => {
      // const token = process.env.TOKEN_SECRET;
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
    setTrashName(trash.trashName || "");
    setTrashPrice(trash.trashPrice || "");
    setTrashSellPrice(trash.trashSellPrice ?? "");
    setSelectedCategory(trash.trashCategory?._id || "");
    setTrashDescription(trash.trashDescription || "");
  }, [
    trash._id,
    trash.trashName,
    trash.trashPrice,
    trash.trashSellPrice,
    trash.trashCategory?._id,
    trash.trashDescription,
  ]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleUpdate = async () => {
    if (
      trashName === trash.trashName &&
      trashPrice === trash.trashPrice &&
      Number(trashSellPrice || 0) === Number(trash.trashSellPrice || 0) &&
      selectedCategory === trash.trashCategory?._id &&
      trashDescription === trash.trashDescription
    ) {
      toast.error("Tidak ada yang berubah");
      return;
    }

    try {
      setLoading(true);
      const updatedTrash = {
        existTrashId,
        trashName,
        trashPrice,
        trashSellPrice: Number(trashSellPrice || 0),
        trashCategory: selectedCategory,
        trashDescription,
        images,
      };

      const token = process.env.TOKEN_SECRET;
      const response = await axios.put(
        `/api/users/trash/${existTrashId}`,
        updatedTrash,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
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
    } finally {
      setLoading(false);
    }
  };

  const formSections = [
    {
      label: "Nama Material",
      icon: PackageIcon,
      content: (
        <IconInput
          icon={PackageIcon}
          value={trashName}
          placeholder="Nama sampah baru"
          className="glass-input h-12 rounded-lg text-base font-semibold"
          onChange={(event) => setTrashName(event.target.value)}
        />
      ),
    },
    {
      label: "Harga Beli /kg (nasabah)",
      icon: BanknoteIcon,
      content: (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-black text-primary">
            Rp
          </span>
          <Input
            value={trashPrice}
            className="glass-input h-12 rounded-lg pl-14 text-base font-semibold"
            placeholder="Harga beli"
            type="number"
            onChange={(event) => setTrashPrice(event.target.value)}
          />
        </div>
      ),
    },
    {
      label: "Harga Jual /kg (pengepul)",
      icon: BanknoteIcon,
      content: (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-black text-primary">
            Rp
          </span>
          <Input
            value={trashSellPrice}
            className="glass-input h-12 rounded-lg pl-14 text-base font-semibold"
            placeholder="Harga jual (opsional)"
            type="number"
            onChange={(event) => setTrashSellPrice(event.target.value)}
          />
        </div>
      ),
    },
    {
      label: "Kategori",
      icon: Layers3Icon,
      content: (
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="glass-input h-12 rounded-lg text-base font-semibold">
            <SelectValue placeholder={trashCategory || "Pilih Kategori"} />
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
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-3">
        {formSections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.label}
              className="rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon size={15} />
                </span>
                {section.label}
              </div>
              {section.content}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileTextIcon size={15} />
            </span>
            Deskripsi
          </div>
          <Textarea
            value={trashDescription}
            placeholder="Deskripsi sampah"
            className="glass-input min-h-40 rounded-lg leading-6"
            onChange={(event) => setTrashDescription(event.target.value)}
          />
        </div>

        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/10 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background/70">
              <ImageIcon size={15} />
            </span>
            Gambar
          </div>
          <Label
            htmlFor="picture"
            className="flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-border/70 bg-background/55 px-4 py-5 text-center text-sm font-bold text-foreground transition hover:bg-accent"
          >
            <UploadCloudIcon size={24} className="text-primary" />
            <span>Pilih Gambar</span>
            <span className="text-xs font-medium text-muted-foreground">
              Maks 5 gambar
            </span>
          </Label>
          <div className="mt-3 rounded-md border border-border/60 bg-background/45 px-3 py-2 text-xs font-semibold text-muted-foreground">
            Tersimpan: {Array.isArray(images) ? images.length : 0} gambar
          </div>
          <Input
            className="hidden"
            id="picture"
            type="file"
            accept="image/*"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          className="h-11 gap-2 border-border/70 bg-background/60 px-5 font-bold sm:w-auto"
          onClick={() => route.push("/trashes")}
        >
          <XIcon size={16} />
          Batal
        </Button>
        {loading ? (
          <Button disabled className="h-11 gap-2 px-5 font-bold sm:w-auto">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </Button>
        ) : (
          <Button className="h-11 gap-2 px-5 font-bold sm:w-auto" onClick={handleUpdate}>
            <SaveIcon size={16} />
            Update
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpdateTrash;
