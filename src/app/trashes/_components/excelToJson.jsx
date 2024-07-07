import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

const UploadExcel = ({ onUploadData }) => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files[0];
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
        createdAt: ExcelDateToJSDate(item.createdAt),
      }));

      setJsonData(formattedJson);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToAPI = async () => {
    setLoading(true);
    toast.success("Uploading data...");

    
    if (!jsonData) {
      console.error("No data to send");
      return;
    }

    for (const item of jsonData) {
      const {
        trashName,
        trashPrice,
        trashCategory,
        trashDescription,
        createdAt,
        images,
      } = item;

      try {
        const response = await axios.post(
          "/api/users/trash?isBulkUpload=true",
          {
            trashName,
            trashPrice,
            trashCategory,
            trashDescription,
            createdAt,
            images,
          }
        );
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setLoading(false);
      }
    }
    onUploadData();
    toast.success("Data berhasil di Upload");
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <Input
        className="bg-gray-500"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
      />
      <Button className="text-xs font-semibold" onClick={sendDataToAPI}>
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={15} />
            Uploading...
          </div>
        ) : (
          <div>Upload Data</div>
        )}
      </Button>
    </div>
  );
};

export default UploadExcel;
