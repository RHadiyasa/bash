import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/modules/users/services/user.service";
import { Dialog } from "@radix-ui/react-dialog";
import bcrypt from "bcryptjs";
import { Loader2 } from "lucide-react";

import React, { useState } from "react";
import toast from "react-hot-toast";

const EditProfile = ({ bankSampahProfile }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: bankSampahProfile.name || "",
    email: bankSampahProfile.email || "",
    phoneNumber: bankSampahProfile.phoneNumber || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  console.log(profile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Hash the password before sending it to the server
    // const hashedPassword = await bcrypt.hash(profile.password, 10);
    // const updatedProfile = { ...profile, password: hashedPassword };

    // Call your update profile API here with updatedProfile
    try {
      setLoading(true);
      const response = await updateProfile(profile, bankSampahProfile._id);
      if (response.data.status === 200) {
        toast.success("Profile updated! Mohon tunggu...");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <div className="text-sm pl-2">Nama Bank Sampah</div>
            <Input
              className="bg-black/30"
              name="name"
              placeholder="Nama Bank Sampah"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Email</div>
            <Input
              className="bg-black/30"
              name="email"
              placeholder="example@email.com"
              value={profile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Whatsapp</div>
            <Input
              className="bg-black/30"
              name="phoneNumber"
              placeholder="+62"
              type="number"
              value={profile.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-1">
            <div className="text-sm pl-2">Password</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-black/30">
                  Ganti Password
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/30 backdrop-blur-md">
                <DialogTitle className="grid gap-2">
                  <div>Ganti Password</div>
                  <DialogDescription className="font-normal">
                    Ganti Password {profile.email}
                  </DialogDescription>
                </DialogTitle>
                <Input
                  type="password"
                  className="bg-black/30"
                  placeholder="Password Baru"
                />
                <Input
                  type="password"
                  className="bg-black/30"
                  placeholder="Konfirmasi Password"
                />
                <Button>Ganti Password</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-5">
          <Button type="submit">
            {loading ? (
              <div className="flex items-center gap-2 font-normal px-5">
                {" "}
                <Loader2 className="animate-spin" size={18} /> Loading...{" "}
              </div>
            ) : (
              <div className="px-5 text-sm">Submit Data Profile</div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
