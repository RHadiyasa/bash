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
        <SelectTrigger className="w-full bg-black/30">
          <SelectValue placeholder="Status Transaksi" />
        </SelectTrigger>
        <SelectContent className="bg-black/30 backdrop-blur-lg">
          <SelectItem value="all">Semua Transaksi</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Berhasil</SelectItem>
          <SelectItem value="failed">Gagal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStatus;
