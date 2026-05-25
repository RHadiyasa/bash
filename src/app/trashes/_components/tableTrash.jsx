import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { EditIcon, Loader2, Trash2Icon } from "lucide-react";
import React from "react";

const TableTrash = ({
  loadingTrashes,
  trashes,
  loadingUpdate,
  open,
  setOpen,
  selectedTrash,
  deleteTrash,
  handleClickTrash,
  handleClickTrashDetails,
  emptyMessage = "Tidak ada sampah",
}) => {
  return (
    <TabsContent value="trashes" className="mt-0">
      {loadingTrashes ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="text-sm font-bold">Memuat data sampah</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Data material sedang disiapkan.
              </p>
            </div>
          </div>
        </div>
      ) : trashes.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
          <div>
            <p className="text-sm font-bold">{emptyMessage}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Data akan muncul di sini setelah tersedia.
            </p>
          </div>
        </div>
      ) : (
        <Table className="min-w-[760px] text-xs lg:text-sm">
          <TableHeader>
            <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
              <TableHead className="font-bold uppercase tracking-[0.12em]">
                Nama
              </TableHead>
              <TableHead className="font-bold uppercase tracking-[0.12em]">
                Kategori
              </TableHead>
              <TableHead className="hidden sm:table-cell">Beli/kg</TableHead>
              <TableHead className="hidden sm:table-cell">Jual/kg</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Update</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trashes.map((trash) => (
              <TableRow key={trash._id} className="hover:bg-primary/5">
                <TableCell className="font-bold">{trash.trashName}</TableCell>
                <TableCell>
                  <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-bold text-primary dark:text-primary">
                    {trash?.trashCategory?.categoryName || "-"}
                  </span>
                </TableCell>
                <TableCell className="hidden font-semibold sm:table-cell">
                  {formatRupiah(trash.trashPrice)}
                </TableCell>
                <TableCell className="hidden font-semibold sm:table-cell">
                  {trash.trashSellPrice ? (
                    formatRupiah(trash.trashSellPrice)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {formatDateToIndonesian(trash.createdAt)}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatDateToIndonesian(trash.updatedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 border-border/70 bg-background/60 px-3 font-bold"
                      onClick={() => handleClickTrashDetails(trash)}
                      disabled={
                        loadingUpdate && selectedTrash?._id === trash._id
                      }
                    >
                      {loadingUpdate && selectedTrash?._id === trash._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <EditIcon className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Detail</span>
                    </Button>

                    <Dialog
                      open={open && selectedTrash?._id === trash._id}
                      onOpenChange={(nextOpen) => {
                        if (nextOpen) handleClickTrash(trash);
                        setOpen(nextOpen);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="h-9 w-9"
                          size="icon"
                          onClick={() => handleClickTrash(trash)}
                          aria-label={`Hapus ${trash.trashName}`}
                        >
                          <Trash2Icon className="w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card flex !w-[min(94vw,420px)] flex-col items-center rounded-lg p-6 text-center">
                        <DialogHeader className="items-center text-center">
                          <DialogTitle className="text-xl font-extrabold">
                            Hapus {selectedTrash?.trashName}
                          </DialogTitle>
                          <DialogDescription className="text-sm">
                            {`Apakah Anda yakin ingin menghapus ${selectedTrash?.trashName}?`}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-2 !grid w-full gap-2 sm:grid-cols-2 sm:space-x-0">
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-full font-bold"
                            onClick={deleteTrash}
                          >
                            Hapus
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-background/60"
                            onClick={() => setOpen(false)}
                          >
                            Batal
                          </Button>
                        </DialogFooter>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Sampah ID {selectedTrash?._id}
                        </span>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TabsContent>
  );
};

export default TableTrash;
