"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { ClipLoader } from "react-spinners";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { getDeletedCustomer } from "@/modules/users/services/deletedCustomer.service";

const TableDeletedCustomers = ({ router, searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const fetchCustomers = async () => {
    setLoadingCustomer(true);
    try {
      const customersData = await getDeletedCustomer();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching deleted customers:", error);
    } finally {
      setLoadingCustomer(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCustomers(
        customers.filter((customer) =>
          customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  return (
    <Table className="text-[9pt] lg:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>No Rekening</TableHead>
          <TableHead>Nama Customer</TableHead>
          <TableHead className="hidden sm:table-cell">
            Saldo Tabungan (Rp)
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            Tanggal Bergabung
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            Tanggal Dihapus
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingCustomer ? (
          <TableRow>
            <TableCell colSpan="3">
              <div className="flex text-[10pt] items-center gap-3 font-semibold">
                <ClipLoader color="#3498db" loading={true} size={15} />
                Loading Nasabah...
              </div>
            </TableCell>
          </TableRow>
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <TableRow key={customer._id} className="h-[70px]">
              <TableCell>{customer.accountNumber}</TableCell>
              <TableCell>{customer.fullName}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatRupiah(customer.balance)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDateToIndonesian(customer.joinDate)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDateToIndonesian(customer.deletedAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan="3">
              <div className="flex items-center text-[10pt] gap-3 font-semibold">
                Tidak ada nasabah
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableDeletedCustomers;
