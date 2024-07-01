import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const AddressForm = ({ address, setAddress, style, isEmpty }) => {
  const handleInputChange = (e, field) => {
    const newAddress = { ...address, [field]: e.target.value };
    setAddress(newAddress);
  };

  return (
    <div className="grid grid-cols-2 items-center text-left gap-5">
      <div className="grid gap-2">
        <div className={address.street ? isEmpty : style}>Jalan</div>
        <Input
          type="text"
          value={address.street}
          onChange={(e) => handleInputChange(e, "street")}
          placeholder="Jalanin aja dulu"
          className="bg-black"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.region ? isEmpty : style}>Wilayah</div>
        <Input
          type="text"
          value={address.region}
          onChange={(e) => handleInputChange(e, "region")}
          placeholder="Pesanggrahan"
          className="bg-black"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.city ? isEmpty : style}>Kabupaten Kota</div>
        <Input
          type="text"
          value={address.city}
          onChange={(e) => handleInputChange(e, "city")}
          placeholder="Kota Malang"
          className="bg-black"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.postalCode ? isEmpty : style}>
          Postal Code
        </div>
        <Input
          type="text"
          value={address.postalCode}
          onChange={(e) => handleInputChange(e, "postalCode")}
          placeholder="12320"
          className="bg-black"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.province ? isEmpty : style}>Province</div>
        <Input
          type="text"
          value={address.province}
          onChange={(e) => handleInputChange(e, "province")}
          placeholder="Jawa Timur"
          className="bg-black"
        />
      </div>
    </div>
  );
};

export default AddressForm;
