import { Loader } from "lucide-react";
import React from "react";

const LoadingPage = ({message}) => {
  return (
    <div className="min-h-screen bg-[#151518]">
      <div className="flex justify-center items-center min-h-screen">
        <Loader color="#3498db" loading={true} className="animate-spin" size={30} />
        <div className="text-white ml-4">{message}</div>
      </div>
    </div>
  );
};

export default LoadingPage;
