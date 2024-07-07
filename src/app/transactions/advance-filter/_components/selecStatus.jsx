import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import Title from "./title";

const SelectStatus = ({ onChange }) => {
  return (
    <div className="grid gap-2">
      <Title title={"Status"} />
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full bg-black">
          <SelectValue placeholder="Status Transaksi" />
        </SelectTrigger>
        <SelectContent className="bg-black">
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Berhasil</SelectItem>
          <SelectItem value="failed">Gagal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStatus;
