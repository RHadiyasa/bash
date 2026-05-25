import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import Title from "./title";

const SelectStatus = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState("all");

  useEffect(() => {
    onChange(selectedValue); // Call the onChange function with the default value
  }, [selectedValue, onChange]);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="grid gap-2">
      <Title title={"Status"} />
      <Select onValueChange={handleValueChange} value={selectedValue}>
        <SelectTrigger className="glass-input h-11 w-full">
          <SelectValue placeholder="Status Transaksi" />
        </SelectTrigger>
        <SelectContent className="glass-card">
          <SelectItem value="all">Semua Transaksi</SelectItem>
          <SelectItem value="pending">Belum Dijual</SelectItem>
          <SelectItem value="completed">Sudah Dijual</SelectItem>
          <SelectItem value="failed">Dibatalkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStatus;
