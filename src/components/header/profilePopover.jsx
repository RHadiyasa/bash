import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User2Icon, SettingsIcon, LogOutIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import LoadingBar from "react-top-loading-bar";
import Avatar from "react-avatar";

const ProfilePopover = ({ data, logout, bankSampah, setProgress }) => {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingSetting, setLoadingSetting] = useState(false);

  const handleSetting = () => {
    setLoadingSetting(true);
    setProgress(50);

    <LoadingBar
      color="#8dCC9E"
      progress={0}
      onLoaderFinished={() => setProgress(0)}
    />;
  };

  const handleProfile = () => {
    setLoadingProfile(true);
    setProgress(50);

    return (
      <LoadingBar
        color="#8dCC9E"
        progress={0}
        onLoaderFinished={() => setProgress(0)}
      />
    );
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar
          size="40"
          color={Avatar.getRandomColor("sitebase", [
            "#F87171",
            "#4ADE80",
            "#60A5FA",
          ])}
          name={bankSampah.username}
          round={true}
        />
      </PopoverTrigger>
      <PopoverContent className="mt-2 mr-8 bg-[#09090B]/70 backdrop-blur-sm">
        <div className="flex flex-col mt-2 gap-3">
          <Link onClick={handleProfile} href={`/profile/${data}/details`}>
            {loadingProfile ? (
              <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                <Loader2 className="animate-spin" size={18} />{" "}
                <span className="text-sm text-white/60">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                <User2Icon className="h-4" />
                <span>Profile</span>
              </div>
            )}
          </Link>
          <Link onClick={handleSetting} href={`/profile/${data}/setting`}>
            {loadingSetting ? (
              <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                <Loader2 className="animate-spin" size={18} />{" "}
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 text-sm font-semibold py-3 rounded-lg hover:bg-secondary">
                <SettingsIcon className="h-4" />
                <span>Biaya Transaksi</span>
              </div>
            )}
          </Link>
          <Button
            onClick={logout}
            className="mt-4 bg-white hover:bg-white/40 hover:text-white"
          >
            <div className="flex items-center gap-2 px-2 text-sm font-semibold h-10">
              <LogOutIcon className="h-4" />
              <span>Logout</span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
