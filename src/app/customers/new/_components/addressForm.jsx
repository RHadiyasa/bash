import React from "react";
import { IconInput } from "@/components/ui/icon-input";
import {
  Building2Icon,
  HashIcon,
  HomeIcon,
  MapPinIcon,
  MapPinnedIcon,
} from "lucide-react";

const AddressForm = ({ address, setAddress, style, isEmpty }) => {
  const handleInputChange = (e, field) => {
    const newAddress = { ...address, [field]: e.target.value };
    setAddress(newAddress);
  };

  return (
    <div className="grid gap-5 text-left md:grid-cols-2">
      <div className="grid gap-2">
        <div className={address.street ? isEmpty : style}>Jalan</div>
        <IconInput
          icon={HomeIcon}
          type="text"
          value={address.street}
          onChange={(e) => handleInputChange(e, "street")}
          placeholder="Jalanin aja dulu"
          className="glass-input h-11"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.region ? isEmpty : style}>Wilayah</div>
        <IconInput
          icon={MapPinnedIcon}
          type="text"
          value={address.region}
          onChange={(e) => handleInputChange(e, "region")}
          placeholder="Pesanggrahan"
          className="glass-input h-11"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.city ? isEmpty : style}>Kabupaten Kota</div>
        <IconInput
          icon={Building2Icon}
          type="text"
          value={address.city}
          onChange={(e) => handleInputChange(e, "city")}
          placeholder="Kota Malang"
          className="glass-input h-11"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.postalCode ? isEmpty : style}>
          Postal Code
        </div>
        <IconInput
          icon={HashIcon}
          type="text"
          value={address.postalCode}
          onChange={(e) => handleInputChange(e, "postalCode")}
          placeholder="12320"
          className="glass-input h-11"
        />
      </div>
      <div className="grid gap-2">
        <div className={address.province ? isEmpty : style}>Province</div>
        <IconInput
          icon={MapPinIcon}
          type="text"
          value={address.province}
          onChange={(e) => handleInputChange(e, "province")}
          placeholder="Jawa Timur"
          className="glass-input h-11"
        />
      </div>
    </div>
  );
};

export default AddressForm;
