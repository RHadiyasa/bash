import { EditIcon, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Separator } from "../../../components/ui/separator";
import { Input } from "../../../components/ui/input";
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

      console.log("Response from server:", response.status);

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
          className="bg-white hover:bg-white/70 h-8 w-auto px-3"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center w-auto gap-2">
            <EditIcon className="w-4" />
            <div className="hidden md:flex">Update</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="bg-black/10 backdrop-blur-lg grid w-auto border"
      >
        <div className="font-bold">Update Kategori Baru</div>
        <Separator className="my-2" />
        <div className="grid md:flex items-center gap-5 text-sm mt-2 px-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[10pt]">Kategori</div>
            <Input
              size={10}
              className="h-8 bg-black/90"
              placeholder={categoryName}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-8 px-3 gap-2 bg-white rounded-md w-auto">
              <Loader2 size={15} className="text-black animate-spin disabled:true" />
              <div className="text-[10pt] text-black font-semibold">Loading...</div>
            </div>
          ) : (
            <Button
              onClick={updateSelectedCategory}
              className="bg-white font-semibold text-[10pt] h-8"
            >
              Update
            </Button>
          )}
        </div>
        {!categoryName ? (
          <div className="text-red-200 font-normal mt-2 text-[10pt] drop-shadow-sm">
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
