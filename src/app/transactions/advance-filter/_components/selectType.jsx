import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Title from "./title";

const SelectType = ({ onChange }) => {
  return (
    <div className="grid gap-2">
      <Title title={"Deposit / Tarik Tunai"} />
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full bg-black">
          <SelectValue placeholder="Jenis Transaksi" />
        </SelectTrigger>
        <SelectContent className="bg-black">
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdraw">Tarik Tunai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectType;
