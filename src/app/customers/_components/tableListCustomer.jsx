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
import {
  deleteCustomer,
  getAllCustomers,
} from "@/modules/users/services/customer.service";
import { Loader2, LucideEye, LucideTrash2, MoreHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteCustomer from "../new/_components/deleteCustomer";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { ClipLoader } from "react-spinners";
import formatRupiah from "@/lib/helpers/formatRupiah";

const TableListCustomer = ({ router, searchTerm, progress, setProgress }) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoadingCustomer(true);
    try {
      const customersData = await getAllCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
    setLoading(true);
    setProgress(progress + 30);
    if (id) {
      router.push(`/customers/${id}`);
      setProgress(progress + 50);
    }
  };

  return (
    <Table className="text-[8pt] lg:text-sm">
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
          <TableHead>Action</TableHead>
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
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="bg-transaparant border" size="sm">
                      <MoreHorizontal
                        size={25}
                        className="text-white hover:text-black p-1"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    className="bg-black/80 backdrop-blur-sm grid w-auto md:gap-1 border md:border-none"
                  >
                    {loading ? (
                      <div className="flex gap-2 py-2.5 px-4 rounded-sm bg-transparent drop-shadow-lg text-white items-center justify-start hover:bg-white/10 w-full">
                        <Loader2
                          size={15}
                          className="animate-spin disabled:true"
                        />
                        <div className="text-sm font-semibold">Loading...</div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleClickProfile(customer._id)}
                        className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-white/10 w-full"
                      >
                        <LucideEye className="w-4" />
                        <span className="text-sm font-bold">
                          Profile {customer.username}
                        </span>
                      </Button>
                    )}

                    <Separator />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleCustomerDelete(customer)}
                          className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-red-700/60 w-full"
                        >
                          <LucideTrash2 className="w-4" />
                          <span className="text-sm font-bold">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DeleteCustomer
                        customer={selectedCustomer}
                        onConfirmDelete={handleConfirmDelete}
                      />
                    </Dialog>
                  </PopoverContent>
                </Popover>
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

export default TableListCustomer;
