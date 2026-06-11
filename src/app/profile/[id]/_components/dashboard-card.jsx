"use client";

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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-sm lg:text-base font-semibold text-foreground">
              {title}
            </span>
            <div className="text-muted-foreground font-bold">{icon}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-[-10px]">
          {number === undefined || number === null ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Loader2 className="animate-spin" size={18} />
              Loading data
            </div>
          ) : (
            <div>
              <div className="flex">
                <span className="text-xl lg:text-3xl text-foreground">
                  {number}{" "}
                  <span className="font-semibold text-base text-muted-foreground">
                    {type}
                  </span>
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground h-6">
                {footer}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
