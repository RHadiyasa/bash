"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import {
  deleteCustomer,
  getCustomersPage,
} from "@/modules/services/customer.service";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  LucideEye,
  LucideTrash2,
  MapPinIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteCustomer from "../new/_components/deleteCustomer";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import formatRupiah from "@/lib/helpers/formatRupiah";

const TableListCustomer = ({
  router,
  searchTerm,
  regionFilter,
  limit,
  page,
  setPage,
  progress,
  setProgress,
  onMetaChange,
  onRegionsChange,
}) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCustomers: 0,
    filteredCustomers: 0,
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingCustomerId, setLoadingCustomerId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoadingCustomer(true);
    try {
      const result = await getCustomersPage({
        page,
        limit,
        search: searchTerm,
        region: regionFilter,
      });
      setCustomers(result.customers);
      setPagination(result.pagination);
      onMetaChange?.({
        pagination: result.pagination,
        summary: result.summary,
      });
      onRegionsChange?.(result.regions);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoadingCustomer(false);
    }
  }, [
    limit,
    onMetaChange,
    onRegionsChange,
    page,
    regionFilter,
    searchTerm,
  ]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerDelete = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomer(selectedCustomer._id);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleClickProfile = (id) => {
    setLoadingCustomerId(id);
    setProgress((currentProgress) => currentProgress + 30);
    if (id) {
      router.push(`/customers/${id}`);
      setProgress((currentProgress) => currentProgress + 50);
    }
  };

  return (
    <div className="grid gap-4">
      <Table className="min-w-[900px] text-xs lg:text-sm">
        <TableHeader>
          <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
            <TableHead className="font-bold uppercase tracking-[0.12em]">
              No Rekening
            </TableHead>
            <TableHead className="font-bold uppercase tracking-[0.12em]">
              Nama Customer
            </TableHead>
            <TableHead className="font-bold uppercase tracking-[0.12em]">
              RT/RW
            </TableHead>
            <TableHead className="hidden font-bold uppercase tracking-[0.12em] sm:table-cell">
              Saldo Tabungan (Rp)
            </TableHead>
            <TableHead className="hidden font-bold uppercase tracking-[0.12em] lg:table-cell">
              Tanggal Bergabung
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCustomer ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <div>
                      <p className="text-sm font-bold">Memuat nasabah</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Data nasabah aktif sedang disiapkan.
                      </p>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : customers && customers.length > 0 ? (
            customers.map((customer) => {
              const region = customer.address?.[0]?.region || "-";

              return (
                <TableRow key={customer._id} className="hover:bg-primary/5">
                  <TableCell className="font-semibold">
                    {customer.accountNumber}
                  </TableCell>
                  <TableCell>
                    <div className="grid gap-1">
                      <span className="font-bold">{customer.fullName}</span>
                      <span className="text-[11px] text-muted-foreground">
                        @{customer.username || "nasabah"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/55 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                      <MapPinIcon size={13} />
                      {region}
                    </span>
                  </TableCell>
                  <TableCell className="hidden font-semibold sm:table-cell">
                    {formatRupiah(customer.balance)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatDateToIndonesian(customer.joinDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClickProfile(customer._id)}
                        className="h-9 gap-2 border-border/70 bg-background/60 px-3 font-bold"
                        disabled={loadingCustomerId === customer._id}
                      >
                        {loadingCustomerId === customer._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LucideEye className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Profil</span>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleCustomerDelete(customer)}
                            aria-label={`Hapus ${customer.fullName}`}
                          >
                            <LucideTrash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DeleteCustomer
                          customer={selectedCustomer}
                          onConfirmDelete={handleConfirmDelete}
                        />
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
                  <div>
                    <p className="text-sm font-bold">Tidak ada nasabah</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Data nasabah aktif akan muncul di sini.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-semibold text-muted-foreground">
          Menampilkan {customers.length} dari {pagination.filteredCustomers}{" "}
          hasil
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-border/70 bg-background/60 font-bold"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={loadingCustomer || page <= 1}
          >
            <ChevronLeftIcon size={16} />
            Prev
          </Button>
          <span className="min-w-[120px] text-center text-xs font-bold text-muted-foreground">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-border/70 bg-background/60 font-bold"
            onClick={() =>
              setPage((current) =>
                Math.min(current + 1, pagination.totalPages)
              )
            }
            disabled={loadingCustomer || page >= pagination.totalPages}
          >
            Next
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableListCustomer;
