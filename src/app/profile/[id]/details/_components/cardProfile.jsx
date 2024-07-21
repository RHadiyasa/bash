import { Card, CardHeader } from "@/components/ui/card";
import React from "react";

const CardProfile = ({
  attribute
}) => {
  return (
    <div>
      <Card className="bg-black/20">
        <div className="font-semibold py-4 text-sm lg:text-base px-6">{attribute}</div>
      </Card>
    </div>
  );
};

export default CardProfile;
