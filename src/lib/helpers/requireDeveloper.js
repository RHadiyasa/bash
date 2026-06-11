import { getAuthData } from "./getAuthData";
import User from "@/modules/models/userModel";

// Verifikasi requester adalah developer aktif. Return user dev atau null.
export const requireDeveloper = async (request) => {
  const auth = getAuthData(request);
  if (!auth?.id || auth.role !== "developer") return null;

  const dev = await User.findOne({ _id: auth.id }).select("-password");
  if (
    !dev ||
    dev.role !== "developer" ||
    dev.isActive === false ||
    dev.isDeleted === true
  ) {
    return null;
  }

  return dev;
};
