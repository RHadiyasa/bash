import formatRupiah from "@/lib/helpers/formatRupiah";
import { getAllTrashes } from "@/modules/services/trash.service";
import React, { useEffect, useState } from "react";

const useTrashesData = () => {
  const [trashes, setTrashes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTrashes(1, 0);
        const trashData = response.trashes;
        const formattedTrashData = trashData.map((trash) => ({
          value: trash._id,
          label: `${trash.trashName || "N/A"} - ${
            formatRupiah(trash.trashPrice) || "N/A"
          }`,
          trashPrice: trash.trashPrice, // Ensure trashPrice is included
          trashName: trash.trashName, // Include trashName for logging and referencing
        }));
        setTrashes(formattedTrashData);
      } catch (error) {
        console.error("Failed to fetch trashes data", error);
      }
    };

    fetchData();
  }, []);

  return { trashes };
};

export default useTrashesData;
