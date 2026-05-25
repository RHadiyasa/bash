import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { Loader2, Search } from "lucide-react";
import React from "react";

const Indicator = ({ onSearchTermChange, searchTerm, handleSearchClick, loading }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-background/45 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:max-w-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Search size={18} />
        </div>
        <IconInput
          icon={Search}
          type="search"
          placeholder="Cari Transaksi"
          className="glass-input h-10 w-full rounded-md"
          value={searchTerm}
          onChange={onSearchTermChange}
        />
        <Button
          onClick={handleSearchClick}
          className="h-10 shrink-0 items-center justify-center gap-2 px-4 text-sm font-bold"
        >
          {!loading ? (
            <span>Cari Transaksi</span>
          ) : (
            <Loader2 className="animate-spin" size={18} />
          )}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-zinc-800 dark:bg-zinc-200" />
          Deposit
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
          Tarik Tunai
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
          Nasabah Dihapus
        </span>
      </div>
    </div>
  );
};

export default Indicator;
