import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GrMoney } from "react-icons/gr";
import { getAllTrashes } from "@/modules/users/services/trash.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectTrash from "./selectTrash";
import { Input } from "@/components/ui/input";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { IoIosWarning } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { addTransaction } from "@/modules/users/services/transaction.service";
import toast from "react-hot-toast";

const AddTransaction = ({ customer, bankSampah, onAddTransaction }) => {
  const [open, setOpen] = useState(false);
  const [trashes, setTrashes] = useState([]);
  const [selectedTrash, setSelectedTrash] = useState("");
  const [selectedTrashData, setSelectedTrashData] = useState([]);
  const [trashWeight, setTrashWeight] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTrashes = async () => {
    setLoading(true);
    try {
      const trashesData = await getAllTrashes();
      setTrashes(trashesData);
    } catch (error) {
      console.error("Error fetching trashes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTrash) {
      const selectedTrashData = trashes.find(
        (trash) => trash._id === selectedTrash
      );
      setSelectedTrashData(selectedTrashData);
    }
  });

  useEffect(() => {
    loadTrashes();
  }, []);

  const handleCreateTransaction = async () => {
    setLoading(true);
    const transactionAmount = trashWeight * selectedTrashData.trashPrice;
    const transactionData = {
      customer: customer._id,
      bankSampah: bankSampah._id,
      trash: selectedTrash,
      trashWeight,
      transactionAmount,
      transactionType,
    };

    try {
      const response = await addTransaction(transactionData);
      toast.success("Transaksi berhasil dibuat");
      console.log("response", response);
      onAddTransaction();
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm font-semibold flex gap-2">
          Buat transaksi
          <GrMoney />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            Transaksi Baru
          </DialogTitle>
          <DialogDescription>
            Tambahkan transaksi baru untuk {customer.fullName}{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <div className="grid gap-2 w-1/2">
            <div className="text-sm font-semibold ml-2">Jenis Transaksi</div>
            <Select
              value={transactionType}
              onValueChange={(value) => setTransactionType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis Transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdraw">Tarik Tunai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!transactionType ? (
            <div className="w-2/3 text-center text-green-300 text-base font-semibold">
              Silahkan tentukan jenis transaksi
            </div>
          ) : transactionType === "withdraw" ? (
            <div className="grid gap-2 w-1/2">
              <div className="text-sm font-semibold ml-2">Tarik Tunai</div>
              <Input placeholder="Nominal" />
            </div>
          ) : (
            <div className="grid gap-2 w-1/2">
              <div className="text-sm font-semibold ml-2">Sampah</div>
              <SelectTrash trashes={trashes} onSelect={setSelectedTrash} />
            </div>
          )}
        </div>
        {selectedTrash && transactionType === "deposit" ? (
          <div>
            <div className="text-sm text-center text-green-300 font-semibold">
              <span>Harga {selectedTrashData.trashName} saat ini </span>
              <span>{formatRupiah(selectedTrashData.trashPrice)}/kg</span>
            </div>
            <div className="flex items-end gap-5">
              <div className="grid gap-2 w-1/2">
                <div className="text-sm font-semibold ml-2">Berat Sampah</div>
                <Input
                  value={trashWeight}
                  onChange={(event) => setTrashWeight(event.target.value)}
                  type="number"
                  placeholder="Berat (kg)"
                />
              </div>
              <div className="grid w-1/2">
                <div className="text-sm font-semibold">Nilai Transaksi :</div>
                <div className="text-sm font-semibold">
                  {formatRupiah(trashWeight * selectedTrashData.trashPrice)}
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-5 font-semibold">
                  Buat Transaksi
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
                <DialogHeader>
                  <DialogTitle>
                    <div className="items-center">
                      <div className="text-center text-xl font-bold">
                        Konfirmasi transaksi untuk {customer.fullName}
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogDescription className="text-center text-xs">
                    Transaksi yang dibuat bersifat final dan tidak dapat diubah
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm text-right mr-2">Bank Sampah</div>
                    <div className="text-sm flex items-end gap-1">
                      {bankSampah.username}
                      <span className="text-xs text-white/50">
                        ({bankSampah._id})
                      </span>
                    </div>
                    <div className="text-sm text-right mr-2">
                      Pemilik Transaksi
                    </div>
                    <div className="text-sm">{customer.fullName}</div>
                    <div className="text-sm text-right mr-2">Sampah</div>
                    <div className="text-sm">{selectedTrashData.trashName}</div>
                    <div className="text-sm text-right mr-2">Berat</div>
                    <div className="text-sm">{trashWeight} kilogram</div>
                    <div className="text-sm text-right mr-2">
                      Nilai Transaksi
                    </div>
                    <div className="text-sm">
                      {formatRupiah(trashWeight * selectedTrashData.trashPrice)}
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <DialogFooter>
                  <div className="flex items-center gap-5">
                    <div className="text-sm">
                      Transaksi akan ditambahkan ke dalam profile nasabah dan
                      Bank Sampah
                    </div>
                    <div className="flex gap-3">
                      {loading ? (
                        <div className="bg-white/20 rounded-md px-4 text-sm flex items-center">Loading...</div>
                      ) : (
                        <Button
                          onClick={handleCreateTransaction}
                          className="w-full"
                        >
                          Ya, Buat Transaksi
                        </Button>
                      )}

                      <Button variant="destructive" className="w-full">
                        Batal
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1 text-sm font-bold text-yellow-200">
              <IoIosWarning size={18} />
              Perhatian
              <IoIosWarning size={18} />
            </div>
            <div className="text-xs text-white">
              Mencegah adanya manipulasi data
            </div>
            <div className="text-xs text-white/50">
              Pastikan data yang input benar, kami tidak memperkenankan adanya
              perubahan transaksi. Segala bentuk transaksi yang dibuat besifat
              final dan tidak dapat diubah.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
