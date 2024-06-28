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
  getCustomers,
} from "@/modules/users/services/customer.service";
import { LucideEye, LucideTrash2, MoreHorizontal } from "lucide-react";
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

const TableListCustomer = ({router, searchTerm}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
   router.push(`/customers/${id}`) 
  }

  return (
    <Table className="text-[9pt] lg:text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>No Rekening</TableHead>
          <TableHead>Nama Customer</TableHead>
          <TableHead className="hidden lg:table-cell">
            Sampah (Kg)
          </TableHead>
          <TableHead className="hidden md:table-cell">Transaksi</TableHead>
          <TableHead className="hidden sm:table-cell">
            Tabungan (Rp)
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            Tanggal Bergabung
          </TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <TableRow key={customer._id} className="h-[70px]">
              <TableCell>{customer.accountNumber}</TableCell>
              <TableCell>{customer.fullName}</TableCell>
              <TableCell className="hidden lg:table-cell">{"12 kg"}</TableCell>
              <TableCell className="hidden md:table-cell">
                {"10 transaksi"}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {"Rp. 12.500.000"}
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
                    <Button onClick={() => handleClickProfile(customer._id)} className="bg-transparent drop-shadow-lg text-white flex gap-2 items-center justify-start hover:bg-white/10 w-full">
                      <LucideEye className="w-4" />
                      <span className="text-sm font-bold">
                        Profile {customer.username}
                      </span>
                    </Button>
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
            <TableCell>No Customer Found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableListCustomer;
