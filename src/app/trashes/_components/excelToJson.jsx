import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloudIcon } from "lucide-react";
import toast from "react-hot-toast";
import toPascalCase from "@/lib/helpers/toPascalCase";

function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

const UploadExcel = ({ onUploadData }) => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Konversi tanggal di sini
      const formattedJson = json.map((item) => ({
        ...item,
        trashName: toPascalCase(item.trashName),
        trashCategory: toPascalCase(item.trashCategory),
        createdAt: ExcelDateToJSDate(item.createdAt),
      }));

      setJsonData(formattedJson);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToAPI = async () => {
    if (!jsonData) {
      console.error("No data to send");
      toast.error("No data uploaded");
      return;
    }

    setLoading(true);
    const toastUploading = toast.loading("Uploading data...");

    try {
      for (const item of jsonData) {
        const {
          trashName,
          trashPrice,
          trashCategory,
          trashDescription,
          createdAt,
          images,
        } = item;

        await axios.post("/api/users/trash?isBulkUpload=true", {
          trashName,
          trashPrice,
          trashCategory,
          trashDescription,
          createdAt,
          images,
        });
      }

      onUploadData();
      toast.success("Data berhasil di Upload");
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal upload data");
    } finally {
      setLoading(false);
      toast.dismiss(toastUploading);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/45 p-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <UploadCloudIcon size={18} />
        </div>
        <div>
          <p className="text-sm font-extrabold">Upload Excel</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {fileName || "Format .xlsx atau .xls"}
          </p>
        </div>
      </div>
      <Input
        className="glass-input h-11 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary-foreground"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
      />
      <Button className="h-10 gap-2 font-bold" onClick={sendDataToAPI}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={15} />
            Mengunggah...
          </>
        ) : (
          <>
            <UploadCloudIcon size={15} />
            Upload Data
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadExcel;
