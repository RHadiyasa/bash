import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Layers3Icon, Loader2, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdatedCategory from "@/app/trashes/_components/updateCategory";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import React from "react";

const TableCategory = ({
  loadingCategories,
  categories,
  handleClickCategory,
  open,
  setOpen,
  selectedCategory,
  fetchHandler,
  deleteCategory,
  emptyMessage = "Tidak ada kategori",
}) => {
  return (
    <TabsContent value="categories" className="mt-0">
      {loadingCategories ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="text-sm font-bold">Memuat kategori</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Daftar kategori sedang disiapkan.
              </p>
            </div>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
          <div>
            <p className="text-sm font-bold">{emptyMessage}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Kategori baru akan muncul di sini setelah tersedia.
            </p>
          </div>
        </div>
      ) : (
        <Table className="min-w-[560px] text-xs lg:text-sm">
          <TableHeader>
            <TableRow className="border-y bg-muted/35 hover:bg-muted/35">
              <TableHead className="font-bold uppercase tracking-[0.12em]">
                Kategori
              </TableHead>
              <TableHead className="hidden font-bold uppercase tracking-[0.12em] sm:table-cell">
                Tanggal Dibuat
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id} className="hover:bg-primary/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-200">
                      <Layers3Icon size={16} />
                    </span>
                    <span className="font-bold">{category.categoryName}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDateToIndonesian(category.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <UpdatedCategory
                      _id={category._id}
                      categoryName={category.categoryName}
                      onCategoryUpdated={fetchHandler}
                    />

                    <Dialog
                      open={open && selectedCategory?._id === category._id}
                      onOpenChange={(nextOpen) => {
                        if (nextOpen) handleClickCategory(category);
                        setOpen(nextOpen);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="h-9 gap-2 px-3"
                          size="sm"
                          onClick={() => handleClickCategory(category)}
                          aria-label={`Hapus kategori ${category.categoryName}`}
                        >
                          <Trash2Icon className="w-4" />
                          <span className="hidden md:flex">Hapus</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card flex !w-[min(94vw,420px)] flex-col items-center rounded-lg p-6 text-center">
                        <DialogHeader className="items-center text-center">
                          <DialogTitle className="text-xl font-extrabold">
                            Hapus kategori {selectedCategory?.categoryName}
                          </DialogTitle>
                          <DialogDescription className="text-sm">
                            {`Apakah Anda yakin ingin menghapus kategori ${selectedCategory?.categoryName}?`}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-2 !grid w-full gap-2 sm:grid-cols-2 sm:space-x-0">
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-full font-bold"
                            onClick={deleteCategory}
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
                          Category ID {selectedCategory?._id}
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

export default TableCategory;
