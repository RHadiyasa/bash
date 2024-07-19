"use cliet";

import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

const DashboardCard = ({ title, number, type, icon, footer }) => {
  return (
    <div className="w-full">
      <Card className="bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-sm lg:text-base font-semibold">{title}</span>
            <div className="text-slate-700 font-bold">{icon}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-[-10px]">
          {!number && number ? (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Loader2 className="animate-spin" size={18} />
              Loading data
            </div>
          ) : (
            <div>
              <div className="flex">
                <span className="text-xl lg:text-3xl">
                  {number} <span className="font-semibold text-base">{type}</span>
                </span>
              </div>
              <div className="mt-2 text-xs text-white/60 h-6">{footer}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
