import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const UploadTrashFile = ({ handleFile }) => {
  return (
    <div className="flex flex-col gap-3">
      <Label
        htmlFor="picture"
        className="flex gap-2 items-center w-full bg-slate-900 hover:bg-slate-800 text-white/80 text-left font-normal py-2 px-4 rounded-md border cursor-pointer"
      >
        <Upload size={15} />
        <div className="text-xs">Upload file</div>
      </Label>
      <Input
        className="text-white hidden"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
      />
    </div>
  );
};

export default UploadTrashFile;
