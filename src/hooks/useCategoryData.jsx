import { getCategory } from "@/modules/users/services/category.service";
import React, { useEffect, useState } from "react";

const useCategoryData = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategory();

        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch categories data", error);
      }
    };

    fetchData();
  }, []);

  return { categories };
};

export default useCategoryData;
