import React from "react";
import { TbUserQuestion } from "react-icons/tb";
import { Button } from "./ui/button";
import Link from "next/link";
import HeaderPage from "./header/header";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#151518]">
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
