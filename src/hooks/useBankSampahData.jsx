import { getUserDetail } from "@/modules/users/services/user.service";
import React, { useEffect, useState } from "react";

const useBankSampahData = () => {
  const [bankSampahProfile, setBankSampahProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bankSampahData = await getUserDetail();
        setBankSampahProfile(bankSampahData);
      } catch (error) {
        console.error("Failed to fetch Bank Sampah data", error);
      }
    };

    fetchData();
  }, []);

  return { bankSampahProfile };
};

export default useBankSampahData;
