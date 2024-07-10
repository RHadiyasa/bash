import React from "react";
import { TbUserQuestion } from "react-icons/tb";
import { Button } from "./ui/button";
import Link from "next/link";
import HeaderPage from "./header/header";
import { FileQuestionIcon } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-5 bg-[#151518]">
      <div className="text-white text-3xl font-semibold">
        404 Not Found : Nasabah tidak ditemukan
      </div>
      <Link href={"/customers"}>
        <Button>Kembali</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
