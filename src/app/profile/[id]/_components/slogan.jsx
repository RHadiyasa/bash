import React from "react";
import { MdOutlineRecycling } from "react-icons/md";

const Slogan = () => {
  return (
    <div className="glass-card flex h-full items-center gap-4 rounded-lg p-5">
      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
        <MdOutlineRecycling size={28} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Prinsip operasional
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-sm font-bold text-red-400">
            Reduce
          </span>
          <span className="rounded-md border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-sm font-bold text-blue-400">
            Reuse
          </span>
          <span className="rounded-md border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-sm font-bold text-green-400">
            Recycle
          </span>
        </div>
      </div>
    </div>
  );
};

export default Slogan;
