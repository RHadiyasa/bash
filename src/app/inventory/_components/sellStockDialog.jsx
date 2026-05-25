"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import formatNumber from "@/lib/helpers/formatNumber";
import formatRupiah from "@/lib/helpers/formatRupiah";
import axios from "axios";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  HandCoinsIcon,
  Loader2,
  ScaleIcon,
  UserRoundIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const SHRINK_REASONS = [
  { value: "natural", label: "Susut alami (kadar air)" },
  { value: "scale", label: "Selisih timbangan" },
  { value: "process", label: "Proses / sortir" },
  { value: "loss", label: "Kehilangan" },
];

const SellStockDialog = ({ stock, onSold }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clearStock, setClearStock] = useState(true);
  const [stockOutWeight, setStockOutWeight] = useState("");
  const [soldWeight, setSoldWeight] = useState("");
  const [sellPricePerKg, setSellPricePerKg] = useState("");
  const [revenue, setRevenue] = useState("");
  const [revenueEdited, setRevenueEdited] = useState(false);
  const [shrinkReason, setShrinkReason] = useState("");
  const [buyer, setBuyer] = useState("");
  const [updateMasterPrice, setUpdateMasterPrice] = useState(false);

  const currentWeight = Number(stock?.currentWeight || 0);
  const trashId = stock?.trash?._id || stock?.trash;
  const trashName =
    stock?.trash?.trashName || stock?.trashNameSnapshot || "Sampah";
  const masterSellPrice = Number(stock?.trash?.trashSellPrice || 0);
  const buyPrice = Number(stock?.trash?.trashPrice || 0);

  const avgCost = useMemo(
    () =>
      currentWeight > 0 ? Number(stock?.totalCostBasis || 0) / currentWeight : 0,
    [currentWeight, stock?.totalCostBasis]
  );

  const stockOutValue = clearStock
    ? currentWeight
    : parseFloat(stockOutWeight) || 0;
  const soldValue = parseFloat(soldWeight) || 0;
  const priceValue = parseFloat(sellPricePerKg) || 0;
  const revenueValue = parseFloat(revenue) || 0;

  const shrinkWeight = stockOutValue - soldValue;
  const remaining = currentWeight - stockOutValue;
  const cogs = avgCost * stockOutValue;
  const profit = revenueValue - cogs;
  const marginPerKg = priceValue - buyPrice;
  const priceDiffers =
    masterSellPrice > 0 && Math.abs(priceValue - masterSellPrice) > 0.0001;

  const syncRevenue = (nextSold, nextPrice) => {
    if (revenueEdited) return;
    const s = parseFloat(nextSold) || 0;
    const p = parseFloat(nextPrice) || 0;
    setRevenue(s > 0 && p > 0 ? String(s * p) : "");
  };

  const handleSoldChange = (value) => {
    setSoldWeight(value);
    syncRevenue(value, sellPricePerKg);
  };

  const handlePriceChange = (value) => {
    setSellPricePerKg(value);
    syncRevenue(soldWeight, value);
  };

  const resetForm = () => {
    setClearStock(true);
    setStockOutWeight("");
    setSoldWeight("");
    setSellPricePerKg(masterSellPrice > 0 ? String(masterSellPrice) : "");
    setRevenue("");
    setRevenueEdited(false);
    setShrinkReason("");
    setBuyer("");
    setUpdateMasterPrice(false);
  };

  const handleOpenChange = (next) => {
    setOpen(next);
    if (next) {
      // prefill harga = harga jual master
      setSellPricePerKg(masterSellPrice > 0 ? String(masterSellPrice) : "");
    } else {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (stockOutValue <= 0) {
      toast.error("Berat keluar stok harus lebih dari 0");
      return;
    }
    if (stockOutValue > currentWeight) {
      toast.error(`Berat keluar stok melebihi stok (${currentWeight} kg)`);
      return;
    }
    if (soldValue <= 0) {
      toast.error("Berat timbangan pengepul harus lebih dari 0");
      return;
    }
    if (revenueValue <= 0) {
      toast.error("Nilai penjualan harus lebih dari 0");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/users/sales",
        {
          trash: trashId,
          clearStock,
          stockOutWeight: clearStock ? undefined : stockOutValue,
          soldWeight: soldValue,
          sellPricePerKg: priceValue,
          revenue: revenueEdited ? revenueValue : undefined,
          shrinkReason: shrinkWeight > 0 ? shrinkReason : "",
          buyer: buyer.trim(),
          updateMasterPrice: priceDiffers ? updateMasterPrice : false,
        },
        { withCredentials: true }
      );
      toast.success("Penjualan berhasil dicatat");
      resetForm();
      setOpen(false);
      onSold?.();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal mencatat penjualan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={currentWeight <= 0 ? "outline" : "default"}
          className="h-10 min-w-[112px] gap-2 rounded-md px-4 font-bold"
          disabled={currentWeight <= 0}
        >
          <HandCoinsIcon size={15} />
          {currentWeight <= 0 ? "Stok Habis" : "Jual Stok"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card max-h-[90vh] !w-[min(94vw,580px)] overflow-y-auto rounded-lg p-0">
        <DialogHeader className="border-b border-border/60 p-6 pr-12">
          <DialogTitle className="text-xl font-extrabold">
            Jual Stok — {trashName}
          </DialogTitle>
          <DialogDescription>
            Stok tersedia:{" "}
            <span className="font-bold text-foreground">
              {formatNumber(currentWeight)} kg
            </span>
            . Harga beli nasabah:{" "}
            <span className="font-bold text-foreground">
              {formatRupiah(buyPrice)}/kg
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 p-6">
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/55 p-3 text-sm font-bold">
            <Checkbox
              checked={clearStock}
              onCheckedChange={(v) => setClearStock(Boolean(v))}
            />
            Habiskan seluruh stok ({formatNumber(currentWeight)} kg)
          </label>

          {!clearStock ? (
            <div className="grid gap-2">
              <Label htmlFor="stockOut">Berat keluar stok (kg)</Label>
              <IconInput
                icon={ScaleIcon}
                id="stockOut"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0"
                className="glass-input h-11"
                value={stockOutWeight}
                onChange={(e) => setStockOutWeight(e.target.value)}
              />
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="soldWeight">Berat ditimbang pengepul (kg)</Label>
            <IconInput
              icon={ScaleIcon}
              id="soldWeight"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="0"
              className="glass-input h-11"
              value={soldWeight}
              onChange={(e) => handleSoldChange(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sellPrice">Harga jual / kg (Rp)</Label>
            <IconInput
              icon={BanknoteIcon}
              id="sellPrice"
              type="number"
              min="0"
              step="any"
              inputMode="numeric"
              placeholder="0"
              className="glass-input h-11"
              value={sellPricePerKg}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {masterSellPrice > 0
                ? `Harga jual master: ${formatRupiah(masterSellPrice)}/kg`
                : "Belum ada harga jual master."}
              {priceValue > 0 && buyPrice > 0
                ? ` · Margin: ${formatRupiah(marginPerKg)}/kg`
                : ""}
            </p>
          </div>

          {priceDiffers ? (
            <div className="grid gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
              <p className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                <AlertTriangleIcon size={14} />
                Harga jual beda dari master ({formatRupiah(masterSellPrice)}/kg)
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Checkbox
                  checked={updateMasterPrice}
                  onCheckedChange={(v) => setUpdateMasterPrice(Boolean(v))}
                />
                Perbarui harga jual master ke {formatRupiah(priceValue)}/kg
              </label>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="revenue">Total nilai jual (Rp)</Label>
            <IconInput
              icon={BanknoteIcon}
              id="revenue"
              type="number"
              min="0"
              step="any"
              inputMode="numeric"
              placeholder="0"
              className="glass-input h-11"
              value={revenue}
              onChange={(e) => {
                setRevenueEdited(true);
                setRevenue(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Terisi otomatis dari berat pengepul × harga, bisa diubah manual.
            </p>
          </div>

          {shrinkWeight > 0 ? (
            <div className="grid gap-2">
              <Label htmlFor="shrinkReason">Alasan susut</Label>
              <Select value={shrinkReason} onValueChange={setShrinkReason}>
                <SelectTrigger id="shrinkReason" className="glass-input h-11">
                  <SelectValue placeholder="Pilih alasan" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {SHRINK_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="buyer">Pengepul / catatan (opsional)</Label>
            <IconInput
              icon={UserRoundIcon}
              id="buyer"
              type="text"
              placeholder="Nama pengepul"
              className="glass-input h-11"
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
            />
          </div>

          <div className="grid gap-2 rounded-lg border border-border/60 bg-background/55 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sisa stok</span>
              <span className="font-bold">
                {formatNumber(remaining > 0 ? remaining : 0)} kg
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {shrinkWeight >= 0 ? "Susut" : "Selisih lebih"}
              </span>
              <span
                className={`font-bold ${
                  shrinkWeight > 0
                    ? "text-amber-600 dark:text-amber-300"
                    : shrinkWeight < 0
                      ? "text-emerald-600 dark:text-emerald-300"
                      : ""
                }`}
              >
                {formatNumber(Math.abs(shrinkWeight))} kg
                {stockOutValue > 0
                  ? ` (${((Math.abs(shrinkWeight) / stockOutValue) * 100).toFixed(1)}%)`
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Modal terjual (COGS)</span>
              <span className="font-bold">{formatRupiah(cogs)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-bold">
                {profit >= 0 ? "Keuntungan" : "Kerugian"}
              </span>
              <span
                className={`font-extrabold ${
                  profit >= 0
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-red-600 dark:text-red-300"
                }`}
              >
                {formatRupiah(profit)}
              </span>
            </div>
          </div>
        </div>

        <Separator />
        <DialogFooter className="grid gap-2 p-6 sm:flex sm:justify-end">
          <Button
            variant="outline"
            className="bg-background/60"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            className="gap-2 font-bold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Catat Penjualan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellStockDialog;
