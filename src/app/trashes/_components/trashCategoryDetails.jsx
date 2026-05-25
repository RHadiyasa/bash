import { Card, CardHeader } from "../../../components/ui/card";
import { Layers3Icon } from "lucide-react";

const TrashCategoryDetails = () => {
  return (
    <div className="w-auto lg:w-1/3">
      <Card className="glass-card rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-3 text-lg font-extrabold">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Layers3Icon size={18} />
            </span>
            Sampah dan Kategori
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TrashCategoryDetails;
