import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingPage = ({message}) => {
  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#3498db" loading={true} size={30} />
        <div className="text-white ml-4">{message}</div>
      </div>
    </div>
  );
};

export default LoadingPage;
