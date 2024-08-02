import { logout } from "@/lib/helpers";
import { getUserDetail } from "@/modules/services/user.service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const useBankSampahData = () => {
  const [bankSampahProfile, setBankSampahProfile] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bankSampahData = await getUserDetail();
        setBankSampahProfile(bankSampahData);
      } catch (error) {
        console.error("Failed to fetch Bank Sampah data", error);
        logout(router);
      }
    };

    fetchData();
  }, []);

  return { bankSampahProfile };
};

export default useBankSampahData;
