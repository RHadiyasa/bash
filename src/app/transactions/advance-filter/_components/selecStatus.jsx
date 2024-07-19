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
        <SelectTrigger className="w-full bg-black/30">
          <SelectValue placeholder="Status Transaksi" />
        </SelectTrigger>
        <SelectContent className="bg-black/30 backdrop-blur-lg">
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Berhasil</SelectItem>
          <SelectItem value="failed">Gagal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStatus;
