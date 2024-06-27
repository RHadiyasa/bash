import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import {
  LayoutGridIcon,
  MoreHorizontal,
  SquareArrowOutUpRightIcon,
  Trash2Icon,
} from "lucide-react";

const TableListCustomer = () => {
  return (
    <Table className="text-[8pt] md:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>No Rekening</TableHead>
          <TableHead>Nama Customer</TableHead>
          <TableHead className="hidden md:table-cell">
            Total Sampah (Kg)
          </TableHead>
          <TableHead className="hidden md:table-cell">Transaksi</TableHead>
          <TableHead className="hidden md:table-cell">
            Jumlah Tabungan (Rp)
          </TableHead>
          <TableHead className="hidden md:table-cell">
            Tanggal Bergabung
          </TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1234567890</TableCell>
          <TableCell>Rafi Hadiyasa</TableCell>
          <TableCell className="hidden md:table-cell">123 Kilogram</TableCell>
          <TableCell className="hidden md:table-cell">23 Transaksi</TableCell>
          <TableCell className="hidden md:table-cell">Rp. 123.000</TableCell>
          <TableCell className="hidden md:table-cell">6 Juli 2024</TableCell>
          <TableCell>
            <Button className="bg-transparant border text-white hover:text-black">
              <SquareArrowOutUpRightIcon size={15} />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1234567890</TableCell>
          <TableCell>Rafi Hadiyasa</TableCell>
          <TableCell className="hidden md:table-cell">123 Kilogram</TableCell>
          <TableCell className="hidden md:table-cell">23 Transaksi</TableCell>
          <TableCell className="hidden md:table-cell">Rp. 123.000</TableCell>
          <TableCell className="hidden md:table-cell">6 Juli 2024</TableCell>
          <TableCell>
            <Button className="bg-transparant border text-white hover:text-black">
              <SquareArrowOutUpRightIcon size={15} />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1234567890</TableCell>
          <TableCell>Rafi Hadiyasa</TableCell>
          <TableCell className="hidden md:table-cell">123 Kilogram</TableCell>
          <TableCell className="hidden md:table-cell">23 Transaksi</TableCell>
          <TableCell className="hidden md:table-cell">Rp. 123.000</TableCell>
          <TableCell className="hidden md:table-cell">6 Juli 2024</TableCell>
          <TableCell>
            <Button className="bg-transparant border text-white hover:text-black">
              <SquareArrowOutUpRightIcon size={15} />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableListCustomer;
