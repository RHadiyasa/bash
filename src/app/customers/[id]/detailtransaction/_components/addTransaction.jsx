import React, { useEffect, useMemo, useState } from "react";
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
import { getAllTrashes } from "@/modules/services/trash.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectTrash from "./selectTrash";
import { IconInput } from "@/components/ui/icon-input";
import formatRupiah from "@/lib/helpers/formatRupiah";
import { Separator } from "@/components/ui/separator";
import { addTransaction } from "@/modules/services/transaction.service";
import toast from "react-hot-toast";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  Loader2,
  PlusIcon,
  ScaleIcon,
} from "lucide-react";

const AddTransaction = ({ customer, bankSampah, onAddTransaction }) => {
  const [open, setOpen] = useState(false);
  const [trashes, setTrashes] = useState({ trashes: [] });
  const [selectedTrash, setSelectedTrash] = useState("");
  const [trashWeight, setTrashWeight] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTrashes, setLoadingTrashes] = useState(false);

  const selectedTrashData = useMemo(() => {
    return trashes.trashes?.find((trash) => trash._id === selectedTrash);
  }, [selectedTrash, trashes.trashes]);

  const loadTrashes = async () => {
    setLoadingTrashes(true);
    try {
      const trashesData = await getAllTrashes(1, 0);
      setTrashes(trashesData || { trashes: [] });
    } catch (error) {
      console.error("Error fetching trashes", error);
    } finally {
      setLoadingTrashes(false);
    }
  };

  useEffect(() => {
    loadTrashes();
  }, []);

  useEffect(() => {
    if (transactionType === "deposit") {
      setTransactionAmount(
        Number(trashWeight) * Number(selectedTrashData?.trashPrice || 0)
      );
    } else if (transactionType === "withdraw") {
      setTrashWeight(0);
      setTransactionAmount(Number(withdrawAmount));
    }
  }, [trashWeight, selectedTrashData, transactionType, withdrawAmount]);

  const handleCreateTransaction = async () => {
    setLoading(true);

    if (transactionType === "withdraw" && transactionAmount < 1000) {
      toast.error("Minimum Withdraw Rp. 1,000");
      setLoading(false);
      return;
    } else if (transactionAmount <= 0) {
      toast.error("Transaksi tidak boleh Rp. 0");
      setLoading(false);
      return;
    }

    const transactionData = {
      customer: customer._id,
      bankSampah: bankSampah?._id,
      trash: transactionType === "deposit" ? selectedTrash : null,
      trashWeight,
      transactionAmount,
      transactionType,
      transactionStatus:
        transactionType === "deposit" ? "pending" : "completed",
    };

    try {
      if (withdrawAmount > customer.balance) {
        toast.error("Saldo Tidak Cukup");
        return;
      }
      await addTransaction(transactionData);
      toast.success("Transaksi berhasil dibuat");

      onAddTransaction();
      setOpen(false);
      setTransactionType("");
      setSelectedTrash("");
      setTrashWeight(0);
      setWithdrawAmount(0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawChange = (event) => {
    const value = Number(event.target.value);
    setWithdrawAmount(value);
    setTransactionAmount(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 gap-2 px-4 font-bold">
          <PlusIcon size={16} />
          Buat Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-h-[90vh] !w-[min(94vw,760px)] overflow-y-auto rounded-lg p-0">
        <DialogHeader className="border-b border-border/60 p-6 pr-12">
          <DialogTitle className="text-xl font-extrabold">
            Transaksi Baru
          </DialogTitle>
          <DialogDescription>
            Tambahkan transaksi untuk {customer.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Jenis Transaksi
              </div>
              <Select
                value={transactionType}
                onValueChange={(value) => setTransactionType(value)}
              >
                <SelectTrigger className="glass-input h-11">
                  <SelectValue placeholder="Jenis Transaksi" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdraw">Tarik Tunai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!transactionType ? (
              <div className="flex items-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-4 text-sm font-bold text-muted-foreground">
                Tentukan jenis transaksi terlebih dahulu.
              </div>
            ) : transactionType === "withdraw" ? (
              <div className="grid gap-2">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Tarik Tunai
                </div>
                <IconInput
                  icon={BanknoteIcon}
                  type="number"
                  value={withdrawAmount}
                  onChange={handleWithdrawChange}
                  placeholder="Nominal"
                  className="glass-input h-11"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Sampah
                </div>
                <SelectTrash trashes={trashes} onSelect={setSelectedTrash} />
              </div>
            )}
          </div>

          {selectedTrash && transactionType === "deposit" ? (
            <div className="grid gap-5 rounded-lg border border-border/60 bg-background/45 p-4">
              <div className="flex flex-col gap-2 rounded-lg bg-primary/10 p-3 text-sm font-bold text-primary sm:flex-row sm:items-center sm:justify-between">
                <span>Harga {selectedTrashData?.trashName} saat ini</span>
                <span>{formatRupiah(selectedTrashData?.trashPrice || 0)}/kg</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <ScaleIcon size={15} />
                    Berat Sampah
                  </div>
                  <IconInput
                    icon={ScaleIcon}
                    value={trashWeight}
                    onChange={(event) => setTrashWeight(event.target.value)}
                    type="number"
                    placeholder="Berat (kg)"
                    className="glass-input h-11"
                  />
                </div>
                <div className="rounded-lg border border-border/60 bg-background/55 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <BanknoteIcon size={15} />
                    Nilai Transaksi
                  </div>
                  <div className="mt-2 text-2xl font-extrabold">
                    {formatRupiah(transactionAmount)}
                  </div>
                </div>
              </div>
            </div>
          ) : transactionType !== "withdraw" ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-amber-700 dark:text-amber-200">
                <AlertTriangleIcon size={18} />
                Perhatian
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Pastikan data yang diinput benar. Transaksi yang dibuat bersifat
                final dan tidak dapat diubah.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 rounded-lg border border-border/60 bg-background/45 p-4">
              <div className="text-center text-sm font-bold">
                Total Tabungan: {formatRupiah(customer.balance)}
              </div>
              <div className="text-center text-2xl font-extrabold">
                {formatRupiah(withdrawAmount)}
              </div>
            </div>
          )}
        </div>

        <Separator />
        <DialogFooter className="grid gap-2 p-6 sm:flex sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="bg-background/60"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="gap-2 font-bold"
            onClick={handleCreateTransaction}
            disabled={
              loading ||
              loadingTrashes ||
              !transactionType ||
              (transactionType === "deposit" && !selectedTrash)
            }
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {transactionType === "withdraw" ? "Tarik Tunai" : "Buat Transaksi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
