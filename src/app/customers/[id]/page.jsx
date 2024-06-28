import HeaderPage from "@/components/header";
import { getUserDetailCustomer } from "@/modules/users/services/customer.service";
import React from "react";

getUserDetailCustomer();

const CustomerPageDetails = () => {
  return (
    <div>
      <HeaderPage />
    </div>
  );
};

export default CustomerPageDetails;
