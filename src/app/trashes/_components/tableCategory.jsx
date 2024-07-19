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
import { Trash2Icon } from "lucide-react";
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
import { ClipLoader } from "react-spinners";
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
}) => {
  return (
    <TabsContent value="categories" className="mt-6">
      {loadingCategories ? (
        <div className="flex items-center gap-3 py-5">
          <ClipLoader color="#3498db" loading={true} size={20} />
          Loading Kategori...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-3 font-semibold">Tidak ada kategori</div>
      ) : (
        <Table>
          <TableHeader className="border-t">
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead className="hidden sm:table-cell">
                Tanggal Dibuat
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDateToIndonesian(category.createdAt)}
                </TableCell>
                <TableCell className="flex gap-3">
                  {/*UPDATE CATEGORY COMPONENT*/}
                  <UpdatedCategory
                    _id={category._id}
                    categoryName={category.categoryName}
                    onCategoryUpdated={fetchHandler} // Panggil fetchCategories setelah update berhasil
                  />

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-red-800 text-white hover:bg-red-500 h-8 px-3 flex items-center w-auto gap-2"
                        size="icon"
                        onClick={() => handleClickCategory(category)}
                      >
                        <Trash2Icon className="w-4" />
                        <span className="hidden md:flex">Delete</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col bg-black/10 items-center rounded-lg w-auto h-auto px-16 py-14 sm:px-32">
                      <DialogHeader className="items-center">
                        <DialogTitle className="text-2xl font-bold uppercase">
                          HAPUS KATEGORI {selectedCategory?.categoryName}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-semibold">
                          {`Apakah Anda yakin ingin menghapus kategori ${selectedCategory?.categoryName}?`}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className={"mt-2"}>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            className="w-40 bg-orange-800 text-foreground hover:bg-orange-800/70"
                            onClick={deleteCategory}
                          >
                            Hapus
                          </Button>
                          <Button
                            type="submit"
                            className="w-40"
                            onClick={() => setOpen(false)}
                          >
                            Batal
                          </Button>
                        </div>
                      </DialogFooter>
                      <span className="text-[8pt] font-light">
                        Category ID {selectedCategory?._id}
                      </span>
                    </DialogContent>
                  </Dialog>
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
