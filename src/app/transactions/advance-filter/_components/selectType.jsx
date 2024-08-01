import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Title from "./title";

const SelectType = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState("all");

  useEffect(() => {
    onChange(selectedValue); // Memanggil fungsi onChange dengan nilai default
  }, [selectedValue, onChange]);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="grid gap-2">
      <Title title={"Deposit / Tarik Tunai"} />
      <Select onValueChange={handleValueChange} value={selectedValue}>
        <SelectTrigger className="w-full bg-black/30">
          <SelectValue placeholder="Jenis Transaksi" />
        </SelectTrigger>
        <SelectContent className="bg-black/30 backdrop-blur-md">
          <SelectItem value="all">Semua Jenis</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdraw">Tarik Tunai</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectType;
