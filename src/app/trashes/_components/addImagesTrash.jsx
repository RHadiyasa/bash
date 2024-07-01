import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import React from "react";

const AddTrashImages = () => {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-left">Gambar</Label>
      <div className="grid gap-2">
        <Label
          htmlFor="picture"
          className="flex gap-2 items-center md:w-1/2 bg-slate-900 hover:bg-slate-800 text-white/80 text-left font-normal py-4 px-4 rounded-md border cursor-pointer"
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
  );
};

export default AddTrashImages;
