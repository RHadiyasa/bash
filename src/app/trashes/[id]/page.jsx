"use client";
import React, { useEffect, useState } from "react";
import { fetchTrashesById } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import UpdateTrash from "@/app/trashes/[id]/_components/updateTrash";
import TrashUpdateList from "@/app/trashes/[id]/_components/trashUpdateList";
import RafiHadiyasa from "@/components/copyright";
import HeaderPage from "@/components/header/header";

export default function DetailTrashPage() {
  const [trashes, setTrashes] = useState([]);
  const [notFound, setNotFound] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadTrashes = async () => {
      try {
        // const token = process.env.TOKEN_SECRET;
        const token = localStorage.getItem("token");
        const trashesData = await fetchTrashesById(id, token);

        if (!trashesData) {
          setNotFound("Sampah tidak ditemukan...");
          router.push("/trashes");
          return;
        }
        setTrashes(trashesData);
      } catch (error) {
        console.error("An error occurred while fetching trash");
        setNotFound("Sampah tidak ditemukan...");
        router.push("/trashes");
      }
    };
    loadTrashes();
  }, []);

  return (
    <div className="bg-cover bg-fixed bg-center min-h-screen">
      <HeaderPage />
      <div className="grid lg:flex mt-8 px-5 md:px-14 w-auto gap-10">
        <div className="w-full lg:w-2/3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/trashes`}>
                  Sampah & Kategori
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`#`} className="font-semibold text-white">
                  Edit Sampah
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid mt-10">
            <div className="flex gap-5">
              <Link href={`/trashes`}>
                <div className="flex items-center gap-3">
                  <ChevronLeftIcon
                    className="bg-[#09090B]/30 text-foreground p-1 rounded-md border"
                    size={30}
                  />
                </div>
              </Link>
              <span className="text-2xl font-semibold">Edit Sampah</span>
            </div>
            <div className="flex gap-10">
              <Card className="bg-[#09090B]/30 p-5 mt-8 w-full">
                <CardHeader>
                  {notFound ? (
                    <div>Sampah tidak ditemukan</div>
                  ) : (
                    <div className="font-semibold text-2xl">
                      {trashes.trashName ? (
                        trashes.trashName
                      ) : (
                        <div className="animate-pulse font-bold">
                          Loading sampah...
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {trashes && Object.keys(trashes).length > 0 ? (
                    <UpdateTrash {...trashes} />
                  ) : (
                    <div>Loading data</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <RafiHadiyasa />
        </div>
        <TrashUpdateList trashes={trashes} notFound={notFound} />
      </div>
    </div>
  );
}
