import React from "react";
import HeaderPage from "./header";
import { ClipLoader } from "react-spinners";

const LoadingPage = ({message}) => {
  return (
    <div className="min-h-screen bg-[#151518]">
      <HeaderPage />
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#3498db" loading={true} size={30} />
        <div className="text-white ml-4">{message}</div>
      </div>
    </div>
  );
};

export default LoadingPage;
