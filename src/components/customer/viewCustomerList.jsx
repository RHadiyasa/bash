import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const TableListCustomer = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No Rekening</TableHead>
          <TableHead>Nama Customer</TableHead>
          <TableHead>Total Sampah (Kg)</TableHead>
          <TableHead>Transaksi</TableHead>
          <TableHead>Jumlah Tabungan (Rp)</TableHead>
          <TableHead>Tanggal Bergabung</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1234567890</TableCell>
          <TableCell>Rafi Hadiyasa</TableCell>
          <TableCell>123 Kilogram</TableCell>
          <TableCell>23 Transaksi</TableCell>
          <TableCell>Rp. 123.000</TableCell>
          <TableCell>6 Juli 2024</TableCell>
          <TableCell>Aksi</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableListCustomer;
