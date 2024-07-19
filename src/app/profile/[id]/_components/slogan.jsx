import React from "react";
import { MdOutlineRecycling } from "react-icons/md";

const Slogan = () => {
  return (
    <>
      <div className="py-5 flex justify-center sm:w-full md:w-1/2 lg:w-1/3">
        <div className="flex items-center gap-5">
          <MdOutlineRecycling size={120} />
          <div>
            <div className="text-3xl font-bold text-red-400">Reduce</div>
            <div className="text-3xl font-bold text-blue-400">Reuse</div>
            <div className="text-3xl font-bold text-green-400">Recycle</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slogan;
