import { Construction } from "lucide-react";
import React from "react";

const LoginCustomer = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="grid gap-3">
        <div className="flex gap-5 items-center justify-center">
          <Construction size={100} />
          <div className="text-center font-bold text-6xl">
            Under Construction
          </div>
        </div>
        <p className="text-center text-lg">
          Aplikasi nasabah sedang dalam tahap pengembangan
        </p>
      </div>
    </div>
  );
};

export default LoginCustomer;
