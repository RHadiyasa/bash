import { EditIcon, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Separator } from "../../../components/ui/separator";
import { IconInput } from "@/components/ui/icon-input";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const UpdatedCategory = ({
  onCategoryUpdated,
  _id,
  categoryName: existingCategoryName,
}) => {
  const [categoryName, setCategoryName] = useState(existingCategoryName || "");
  const [messageField, setMessageField] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const token = process.env.TOKEN_SECRET;

  const updateSelectedCategory = async () => {
    if (!categoryName) {
      toast.error("Kategori tidak boleh kosong.");
      setMessageField("Kategori tidak boleh kosong.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "/api/users/category",
        { _id, categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Kategori berhasil diupdate!");
        onCategoryUpdated();
        setOpen(false);
      }
    } catch (error) {
      toast.error("Kategori sudah ada");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-auto gap-2 border-border/70 bg-background/60 px-3 font-bold"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <EditIcon className="w-4" />
          <span className="hidden md:flex">Update</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="glass-card grid !w-[min(90vw,420px)] gap-4 rounded-lg p-4"
      >
        <div>
          <div className="font-extrabold">Update Kategori</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Perbarui nama kategori material.
          </p>
        </div>
        <Separator />
        <div className="grid gap-3 text-sm">
          <div className="grid gap-2">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Kategori
            </div>
            <IconInput
              icon={EditIcon}
              size={10}
              className="glass-input h-10"
              placeholder={categoryName}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          {loading ? (
            <Button disabled className="h-10 gap-2 font-bold">
              <Loader2 size={15} className="animate-spin" />
              Menyimpan...
            </Button>
          ) : (
            <Button
              onClick={updateSelectedCategory}
              className="h-10 font-bold"
            >
              Update
            </Button>
          )}
        </div>
        {!categoryName ? (
          <div className="text-xs font-bold text-destructive">
            {messageField}
          </div>
        ) : (
          ""
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UpdatedCategory;
