import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
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
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={`Edit ${edit}`}
        >
          <EditIcon size={15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="glass-card grid !w-[min(90vw,420px)] gap-4 rounded-lg p-4"
      >
        <div>
          <div className="font-extrabold">Update {edit}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Simpan perubahan data nasabah.
          </p>
        </div>
        <Separator />
        <div className="grid gap-3 text-sm">
          <div className="grid gap-2">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {edit}
            </div>
            <IconInput
              icon={EditIcon}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size={10}
              className="glass-input h-10 w-full"
            />
          </div>
          {loading ? (
            <Button disabled className="h-10 gap-2 font-bold">
              <Loader2 size={15} className="animate-spin" />
              Menyimpan...
            </Button>
          ) : (
            <Button
              onClick={updateValue}
              className="h-10 font-bold"
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
