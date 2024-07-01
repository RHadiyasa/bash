import React from "react";
import HeaderPage from "./header";
import { TbUserQuestion } from "react-icons/tb";
import { Button } from "./ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  const goBack = () => {};
  return (
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="flex flex-col items-center justify-center gap-5 mt-32">
        <TbUserQuestion size={70} />
        <div className="text-white text-xl font-bold">
          Nasabah tidak ditemukan
        </div>
        <Link href={"/customers"}>
          <Button>Kembali</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
