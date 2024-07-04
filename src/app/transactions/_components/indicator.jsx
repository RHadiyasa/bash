import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const Indicator = ({ onSearchTermChange, searchTerm }) => {
  return (
    <div className="grid md:flex items-center justify-center md:justify-between gap-4 ml-2 px-5 sm:px-0">
      <div className="flex items-center gap-2">
        <Search className="w-auto" size={20} />
        <Input
          type="search"
          placeholder="Cari Transaksi"
          className="w-full rounded-xl bg-[#09090B]"
          value={searchTerm}
          onChange={onSearchTermChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-black/60 rounded-sm p-1.5 w-1 h-1 flex items-center"></div>
        <span className="text-[8pt]">Deposit</span>
        <div className="bg-green-800 rounded-sm p-1.5 w-1 h-1 flex items-center"></div>
        <span className="text-[8pt]">Tarik Tunai</span>
        <div className="bg-red-500 rounded-sm p-1.5 w-1 h-1 flex items-center"></div>
        <span className="text-[8pt]">Nasabah Dihapus</span>
      </div>
    </div>
  );
};

export default Indicator;
