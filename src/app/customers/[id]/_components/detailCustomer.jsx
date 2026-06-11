import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import React from "react";
import EditCustomer from "./editCustomer";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDaysIcon,
  ContactIcon,
  CreditCardIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserRoundIcon,
} from "lucide-react";

const DetailCustomer = ({ dataCustomer, onDataUpdated }) => {
  const address = dataCustomer?.address?.[0] || {};
  const initials = (dataCustomer?.fullName || "N")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const fields = [
    {
      label: "Nama Lengkap",
      value: dataCustomer?.fullName,
      icon: UserRoundIcon,
      edit: {
        fields: "fullName",
        selectedValue: dataCustomer?.fullName,
        edit: "Nama",
      },
    },
    {
      label: "Email",
      value: dataCustomer?.email,
      icon: MailIcon,
      edit: {
        fields: "email",
        selectedValue: dataCustomer?.email,
        edit: "Email",
      },
    },
    {
      label: "NIK",
      value: dataCustomer?.nik,
      icon: ContactIcon,
      edit: {
        fields: "nik",
        selectedValue: dataCustomer?.nik,
        edit: "NIK",
      },
    },
    {
      label: "Nomor Rekening",
      value: dataCustomer?.accountNumber,
      icon: CreditCardIcon,
      edit: {
        fields: "accountNumber",
        selectedValue: dataCustomer?.accountNumber,
        edit: "Rekening",
      },
    },
    {
      label: "No Telp",
      value: dataCustomer?.phone ? `+62 ${dataCustomer.phone}` : "-",
      icon: PhoneIcon,
      edit: {
        fields: "phone",
        selectedValue: dataCustomer?.phone,
        edit: "Handphone",
      },
    },
    {
      label: "Tanggal Bergabung",
      value: formatDateToIndonesian(dataCustomer?.joinDate),
      icon: CalendarDaysIcon,
    },
  ];

  const profileRows = [
    ...fields,
    {
      label: "Jalan",
      value: address.street,
      icon: HomeIcon,
      edit: {
        fields: "address.0.street",
        selectedValue: address.street,
        edit: "Street",
      },
    },
    {
      label: "RT/RW",
      value: address.region,
      icon: MapPinIcon,
      edit: {
        fields: "address.0.region",
        selectedValue: address.region,
        edit: "Wilayah",
      },
    },
    {
      label: "Kode Pos",
      value: address.postalCode,
      icon: MapPinIcon,
      edit: {
        fields: "address.0.postalCode",
        selectedValue: address.postalCode,
        edit: "KodePos",
      },
    },
    {
      label: "Kabupaten Kota",
      value: address.city,
      icon: MapPinIcon,
      edit: {
        fields: "address.0.city",
        selectedValue: address.city,
        edit: "Kota",
      },
    },
    {
      label: "Provinsi",
      value: address.province,
      icon: MapPinIcon,
      edit: {
        fields: "address.0.province",
        selectedValue: address.province,
        edit: "Provinsi",
      },
    },
  ];

  return (
    <Card className="glass-card overflow-hidden rounded-lg">
      <CardHeader className="border-b border-border/60 bg-background/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-xl font-black text-primary shadow-sm">
              {initials || "N"}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-2xl font-black tracking-tight">
                  {dataCustomer?.fullName || "Detail Nasabah"}
                </h2>
                <EditCustomer
                  onDataUpdated={onDataUpdated}
                  fields="fullName"
                  _id={dataCustomer?._id}
                  selectedValue={dataCustomer?.fullName}
                  edit="Nama"
                />
              </div>
              <CardDescription className="mt-2 leading-6">
                {dataCustomer?.accountNumber || "-"} / @
                {dataCustomer?.username || "nasabah"}
              </CardDescription>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                >
                  {address.region || "RT/RW belum diisi"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-md border-border/60 bg-background/50 px-3 py-1 text-xs font-bold text-muted-foreground"
                >
                  {address.city || "Kota belum diisi"}
                </Badge>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="w-fit rounded-md border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary lg:mt-1"
          >
            ID {dataCustomer?._id || "-"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-x-8 gap-y-1 lg:grid-cols-2">
          {profileRows.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group flex min-h-16 items-center justify-between gap-4 border-b border-border/50 py-3 last:border-b-0 lg:last:border-b"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-1 break-words text-sm font-extrabold">
                    {item.value || "-"}
                    </div>
                  </div>
                </div>
                {item.edit ? (
                  <div className="shrink-0 opacity-80 transition group-hover:opacity-100">
                    <EditCustomer
                      onDataUpdated={onDataUpdated}
                      fields={item.edit.fields}
                      _id={dataCustomer?._id}
                      selectedValue={item.edit.selectedValue}
                      edit={item.edit.edit}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailCustomer;
