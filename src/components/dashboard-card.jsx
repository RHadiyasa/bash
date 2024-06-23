"use cliet";

import { PackageOpenIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const DashboardCard = ({title, number, type, icon}) => {
  return (
    <div className="w-full">
      <Card className="bg-black">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-base font-semibold">
              {title}
            </span>
            <div className="text-slate-700 font-bold">{icon}</div>
            
            {/* <PackageOpenIcon className="w-5 text-slate-700 font-bold"/> */}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-[-10px]">
          <span className="text-2xl font-bold">{number} <span className="font-bold text-sm">{type}</span></span>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
