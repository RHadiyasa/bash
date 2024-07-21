import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { fetchHeader } from "@/lib/helpers/fetchHeader";
import { checkUrl } from "@/lib/helpers/checkUrl";
import toast from "react-hot-toast";
import { setCookie } from "cookies-next";

const useHeaderData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const params = useParams().id;
  const path = usePathname();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (path !== `/profile/${params}`) {
          await fetchHeader(router, setData, setUserId);
        } else {
          await checkUrl(params, router, setData, setUserId);
        }
      } catch (error) {
        // console.error(error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, router]);

  const logout = async () => {
    try {
      // await axios.get("/api/users/logout");
      setCookie("token", "");
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during logout"
        );
      }
    }
  };

  return { loading, data, userId, logout };
};

export default useHeaderData;
