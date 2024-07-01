import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";
import React, { useState } from "react";
import EditCustomer from "./editCustomer";
import RafiHadiyasa from "@/components/copyright";

const DetailCustomer = ({ dataCustomer, onDataUpdated }) => {
  const [hoveredField, setHoveredField] = useState(null);

  const handleMouseEnter = (field) => {
    setHoveredField(field);
  };

  return (
    <div className="mt-5">
      <Card className="bg-[#09090B] w-full">
        <CardHeader className="font-semibold text-2xl text-center">
          Detail Nasabah
          <div className="text-sm text-white/50">
            {dataCustomer.username}{" "}
            <span className="text-xs font-light">({dataCustomer._id})</span>
          </div>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                Nama Lengkap
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                {dataCustomer.fullName}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="fullName"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.fullName}
                  edit={"Nama"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                Email
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                {dataCustomer.email}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="email"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.email}
                  edit={"Email"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                Nomor Rekening
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                {dataCustomer.accountNumber}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="accountNumber"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.accountNumber}
                  edit={"Rekening"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                Jumlah Tabungan
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                {formatRupiah(dataCustomer.balance)}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                No Telp
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                +62 {dataCustomer.phone}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="phone"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.phone}
                  edit={"Handphone"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs font-semibold text-gray-400 px-2">
                Tanggal Bergabung
              </div>
              <div className="flex justify-between items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
                {formatDateToIndonesian(dataCustomer.joinDate)}
              </div>
            </div>
          </div>
          <div className="grid gap-2 mt-4">
            <div className="text-xs font-semibold text-gray-400 px-2">
              Alamat
            </div>
            <div className="grid md:flex gap-1 items-center text-sm font-semibold bg-white/5 py-3 px-4 rounded-md">
              <div
                className="flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter("address.street")}
              >
                <span>{dataCustomer.address[0].street}</span>
                {hoveredField === "address.street" && (
                  <EditCustomer
                    onDataUpdated={onDataUpdated}
                    fields="address.0.street"
                    _id={dataCustomer._id}
                    selectedValue={dataCustomer.address[0].street}
                    edit={"Street"}
                  />
                )}
                <span>|</span>
              </div>
              <div
                className="flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter("address.region")}
              >
                <span>{dataCustomer.address[0].region}</span>
                {hoveredField === "address.region" && (
                  <EditCustomer
                    onDataUpdated={onDataUpdated}
                    fields="address.0.region"
                    _id={dataCustomer._id}
                    selectedValue={dataCustomer.address[0].region}
                    edit={"Wilayah"}
                  />
                )}
                <span>|</span>
              </div>
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => handleMouseEnter("address.postalCode")}
              >
                <span>Kode pos : {dataCustomer.address[0].postalCode}</span>
                {hoveredField === "address.postalCode" && (
                  <EditCustomer
                    onDataUpdated={onDataUpdated}
                    fields="address.0.postalCode"
                    _id={dataCustomer._id}
                    selectedValue={dataCustomer.address[0].postalCode}
                    edit={"KodePos"}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-3 mt-3">
              <div className="text-xs font-semibold text-gray-400 px-2 text-right">
                Kabupaten Kota
              </div>
              <div className="text-sm font-semibold bg-white/5 py-3 px-4 rounded-md flex items-center justify-between">
                {dataCustomer.address[0].city}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="address.0.city"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.address[0].city}
                  edit={"Handphone"}
                />
              </div>
              <div className="text-xs font-semibold text-gray-400 px-2 text-right">
                Provinsi
              </div>
              <div className="text-sm font-semibold bg-white/5 py-3 px-4 rounded-md flex items-center justify-between">
                {dataCustomer.address[0].province}
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="address.0.province"
                  _id={dataCustomer._id}
                  selectedValue={dataCustomer.address[0].province}
                  edit={"Handphone"}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <RafiHadiyasa />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DetailCustomer;
