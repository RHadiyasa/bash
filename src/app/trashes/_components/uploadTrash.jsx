import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import React from "react";

const UploadTrashFile = ({ handleFile }) => {
  return (
    <div className="flex flex-col gap-3">
      <Label
        htmlFor="trash-file"
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-primary/35 bg-primary/10 px-4 py-3 text-left text-sm font-bold text-primary transition hover:bg-primary/15"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background/70">
          <Upload size={16} />
        </span>
        <span>Upload file sampah</span>
      </Label>
      <Input
        id="trash-file"
        className="hidden"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
      />
    </div>
  );
};

export default UploadTrashFile;
