import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import React from "react";

const Indicator = ({ onSearchTermChange, searchTerm, handleSearchClick, loading }) => {
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
        <div className="flex justify-center md:justify-start gap-4">
            <Button
              onClick={handleSearchClick}
              className="flex items-center gap-2 h-9 lg:h-auto text-sm"
            >
              {!loading ? (
                <div>Cari Transaksi</div>
              ) : (
                <Loader2 className="animate-spin w-16" size={18} />
              )}
            </Button>
          </div>
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
