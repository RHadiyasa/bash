import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User2Icon, SettingsIcon, LogOutIcon } from "lucide-react";

const ProfilePopover = ({ data, logout, bankSampah }) => (
  <Popover>
    <PopoverTrigger>
      <Avatar className="h-8 w-8">
        <AvatarImage src={bankSampah.googlePhotoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
      </Avatar>
    </PopoverTrigger>
    <PopoverContent className="mt-2 mr-8 bg-[#09090B]/70 backdrop-blur-sm">
      <div className="flex flex-col mt-2">
        <Link href="#">
          <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
            <User2Icon className="h-4" />
            <span>Profile</span>
          </div>
        </Link>
        <Link href={`/profile/${data}/setting`}>
          <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
            <SettingsIcon className="h-4" />
            <span>Biaya Transaksi</span>
          </div>
        </Link>
        <Button onClick={logout} className="mt-4 bg-white hover:bg-white/40 hover:text-white">
          <div className="flex items-center gap-2 px-2 text-sm font-semibold h-10">
            <LogOutIcon className="h-4" />
            <span>Logout</span>
          </div>
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default ProfilePopover;
