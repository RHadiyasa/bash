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
import formatRupiah from "@/lib/helpers/formatRupiah";
import { getDeletedCustomer } from "@/modules/services/deletedCustomer.service";
import { Loader2 } from "lucide-react";

const TableDeletedCustomers = ({ searchTerm }) => {
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
          customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  return (
    <Table className="min-w-[760px] text-xs lg:text-sm">
      <TableHeader>
        <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            No Rekening
          </TableHead>
          <TableHead className="font-bold uppercase tracking-[0.12em]">
            Nama Customer
          </TableHead>
          <TableHead className="hidden font-bold uppercase tracking-[0.12em] sm:table-cell">
            Saldo Tabungan (Rp)
          </TableHead>
          <TableHead className="hidden font-bold uppercase tracking-[0.12em] lg:table-cell">
            Tanggal Bergabung
          </TableHead>
          <TableHead className="hidden font-bold uppercase tracking-[0.12em] lg:table-cell">
            Tanggal Dihapus
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingCustomer ? (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <div>
                    <p className="text-sm font-bold">Memuat arsip nasabah</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Data nasabah non-aktif sedang disiapkan.
                    </p>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <TableRow key={customer._id} className="hover:bg-destructive/5">
              <TableCell className="font-semibold">
                {customer.accountNumber}
              </TableCell>
              <TableCell>
                <div className="grid gap-1">
                  <span className="font-bold">{customer.fullName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    Arsip nasabah
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden font-semibold sm:table-cell">
                {formatRupiah(customer.balance)}
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {formatDateToIndonesian(customer.joinDate)}
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {formatDateToIndonesian(customer.deletedAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                <div>
                  <p className="text-sm font-bold">Tidak ada nasabah non-aktif</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Arsip nasabah yang dihapus akan muncul di sini.
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableDeletedCustomers;
