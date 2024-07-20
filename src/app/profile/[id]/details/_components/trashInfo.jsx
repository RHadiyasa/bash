import React from "react";

const TrashInfo = ({ trashes, categories }) => {
  console.log(trashes);
  console.log(categories);
  return (
    <div className="flex gap-5">
      <div className="bg-black/30 backdrop-blur-sm rounded-md mt-5 p-10 w-full grid gap-3">
        <div className="text-center">Total Sampah</div>
        <div className="text-center font-semibold text-xl">{trashes.length} items</div>
      </div>
      <div className="bg-black/30 backdrop-blur-sm rounded-md mt-5 p-10 w-full grid gap-3">
        <div className="text-center">Jumlah Kategori</div>
        <div className="text-center font-semibold text-xl">{categories.length} items</div>
      </div>
    </div>
  );
};

export default TrashInfo;
