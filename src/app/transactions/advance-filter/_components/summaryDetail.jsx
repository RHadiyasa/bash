import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatNumber from "@/lib/helpers/formatNumber";
import React from "react";

const SummaryDetail = ({ uniqueCustomers, totalWeightPerTrashType }) => {
  return (
    <div>
      <div>
        <Separator className="my-2" />
        <div className="text-center font-semibold">List Nasabah</div>
        <div className="text-sm">{uniqueCustomers.join(", ")}</div>
        <Separator className="my-2" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sampah</TableHead>
              <TableHead>Berat (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(totalWeightPerTrashType).map(
              ([trashName, weight]) => (
                <TableRow key={trashName}>
                  <TableCell>{trashName}</TableCell>
                  <TableCell>{formatNumber(weight)} kg</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SummaryDetail;
