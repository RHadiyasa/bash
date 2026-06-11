import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOutIcon, Loader2, UserCogIcon } from "lucide-react";
import { useState } from "react";
import LoadingBar from "react-top-loading-bar";
import Avatar from "react-avatar";

const ProfilePopover = ({ data, logout, bankSampah, setProgress }) => {
  const [loadingAccount, setLoadingAccount] = useState(false);

  const handleAccount = () => {
    setLoadingAccount(true);
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
      <PopoverTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar
          size="40"
          color={Avatar.getRandomColor("sitebase", [
            "#F87171",
            "#4ADE80",
            "#60A5FA",
          ])}
          name={bankSampah.name}
          round={true}
        />
      </PopoverTrigger>
      <PopoverContent className="mt-2 mr-8">
        <div className="flex flex-col mt-2 gap-3">
          <Link onClick={handleAccount} href={`/profile/${data}/details`}>
            {loadingAccount ? (
              <div className="flex items-center gap-2 px-3 text-sm font-semibold py-3 rounded-lg hover:bg-accent hover:text-accent-foreground">
                <Loader2 className="animate-spin" size={18} />{" "}
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 text-sm font-semibold py-3 rounded-lg hover:bg-accent hover:text-accent-foreground">
                <UserCogIcon className="h-4" />
                <span>Akun & Konfigurasi</span>
              </div>
            )}
          </Link>
          <Button
            onClick={logout}
            variant="destructive"
            className="mt-4"
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
