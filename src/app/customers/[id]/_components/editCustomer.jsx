import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { updateCustomer } from "@/modules/services/customer.service";
import { EditIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const EditCustomer = ({ _id, selectedValue, edit, fields, onDataUpdated }) => {
  const [value, setValue] = useState(selectedValue || "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const updateValue = async () => {
    if (!value) {
      toast.error("Tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      const data = { id: _id, [fields]: value };
      const token = process.env.TOKEN_SECRET;

      if (value === selectedValue) {
        toast.error("Data tidak berubah");
        setLoading(false);
        return;
      }

      await updateCustomer(data, token);
      toast.success("Customer Updated");
      onDataUpdated();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal ubah data ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="bg-transparent text-white hover:bg-transparent hover:text-white/60 h-3 w-auto px-0"
        >
          <EditIcon size={17} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="bg-black/5 backdrop-blur-lg grid w-full border"
      >
        <div className="font-bold">Update {edit}</div>
        <Separator className="my-2" />
        <div className="grid md:flex items-center gap-5 text-sm mt-2 px-2 lg:px-4">
          <div className="flex items-center gap-2 lg:gap-4 w-[300px]">
            <div className="font-semibold text-[10pt]">{edit}</div>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size={10}
              className="h-8 bg-black/90 w-full lg:w-[200px]"
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-8 px-3 gap-2 bg-white rounded-md w-auto">
              <Loader2
                size={15}
                className="text-black animate-spin disabled:true"
              />
              <div className="text-[10pt] text-black font-semibold">
                Loading...
              </div>
            </div>
          ) : (
            <Button
              onClick={updateValue}
              className="bg-white font-semibold text-[10pt] h-8"
            >
              Update
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditCustomer;
