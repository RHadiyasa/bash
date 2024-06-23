import HeaderPage from "@/components/header";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

const CustomerPage = () => {
  return (
    <div>
      <HeaderPage />
      <div className="flex justify-center font-bold text-4xl pt-20">
        Customers Page
      </div>
    </div>
  );
};

export default CustomerPage;
