"use client";
import AddCategory from "@/app/trashes/_components/addCategory";
import HeaderPage from "@/components/header/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import RafiHadiyasa from "@/components/copyright";
import AddTrash from "./_components/addTrash";
import {
  deleteOneTrash,
  getAllTrashes,
} from "@/modules/services/trash.service";
import {
  deleteOneCategory,
  getCategory,
} from "@/modules/services/category.service";
import TableTrash from "./_components/tableTrash";
import TableCategory from "./_components/tableCategory";
import UploadExcel from "./_components/excelToJson";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@/components/ui/popover";
import {
  BanknoteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Layers3Icon,
  PackageSearchIcon,
  RecycleIcon,
  SearchIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import formatRupiah from "@/lib/helpers/formatRupiah";

const TrashPage = () => {
  const [value, setValue] = useState("trashes");
  const [trashes, setTrashes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTrash, setSelectedTrash] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTrashes, setLoadingTrashes] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTrashes = useMemo(() => {
    if (!normalizedSearch) return trashes;

    return trashes.filter((trash) => {
      const categoryName = trash?.trashCategory?.categoryName || "";
      return [trash?.trashName, categoryName, trash?.trashPrice]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(normalizedSearch));
    });
  }, [normalizedSearch, trashes]);

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return categories;

    return categories.filter((category) =>
      category?.categoryName?.toLowerCase().includes(normalizedSearch)
    );
  }, [categories, normalizedSearch]);

  const averageTrashPrice = useMemo(() => {
    const prices = trashes
      .map((trash) => Number(trash?.trashPrice))
      .filter(Number.isFinite);

    if (!prices.length) return 0;

    return Math.round(
      prices.reduce((total, price) => total + price, 0) / prices.length
    );
  }, [trashes]);

  const summaryCards = [
    {
      label: "Data sampah",
      value: loadingTrashes ? "..." : trashes.length,
      caption: `Halaman ${page} dari ${totalPages}`,
      icon: PackageSearchIcon,
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    },
    {
      label: "Kategori",
      value: loadingCategories ? "..." : categories.length,
      caption: "Kelompok material",
      icon: Layers3Icon,
      className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-200",
    },
    {
      label: "Harga rata-rata",
      value: loadingTrashes ? "..." : formatRupiah(averageTrashPrice),
      caption: "Dari data halaman ini",
      icon: BanknoteIcon,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
    },
  ];

  const fetchData = useCallback(async () => {
    setLoadingTrashes(true);
    try {
      const result = await getAllTrashes(page, 10);

      if (result) {
        const { trashes, totalPages, currentPage } = result;
        setTrashes(trashes || []);
        setTotalPages(totalPages || 1);
        setPage(currentPage || 1);
      } else {
        toast.error("Gagal memuat sampah dan kategori");
      }

      const getTrashCategories = await getCategory();

      if (getTrashCategories) {
        setCategories(getTrashCategories);
      } else {
        toast.error("Gagal memuat sampah dan kategori");
      }
    } catch (error) {
      return console.error(error);
    } finally {
      setLoadingTrashes(false);
      setLoadingCategories(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const fetchHandler = () => {
    fetchData();
  };

  const onClickHandle = (newValue) => {
    setValue(newValue);
  };

  const handleClickTrash = (trash) => {
    setSelectedTrash(trash);
  };

  const handleClickTrashDetails = useCallback(
    (trash) => {
      setSelectedTrash(trash);
      setLoadingUpdate(true);
      router.push(`/trashes/${trash._id}`);
    },
    [router]
  );

  const handleClickCategory = (category) => {
    setSelectedCategory(category);
  };

  async function deleteTrash() {
    try {
      await deleteOneTrash(selectedTrash._id);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("error : ", error);
    }
  }

  async function deleteCategory() {
    try {
      await deleteOneCategory(selectedCategory._id);
      setOpen(false);
      toast.success("Kategori berhasil dihapus");
      fetchData();
    } catch (error) {
      console.error("error : ", error);
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-earth dark:bg-cover dark:bg-fixed dark:bg-center">
      <HeaderPage />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="glass-card relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary dark:text-primary">
                <RecycleIcon size={14} />
                Katalog Material
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Sampah & Kategori
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Kelola data material, harga per kilogram, kategori, dan upload
                data massal dalam satu tampilan yang lebih ringkas.
              </p>
            </div>
            {value === "trashes" ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 justify-center gap-2 border-border/70 bg-background/60 px-4 font-bold shadow-sm hover:bg-accent"
                    >
                      <UploadCloudIcon size={16} />
                      <span>Upload Data</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="glass-card !w-[min(92vw,420px)] rounded-lg p-4"
                  >
                    <UploadExcel onUploadData={fetchData} />
                  </PopoverContent>
                </Popover>
                <AddTrash onTrashAdded={fetchHandler} />
              </div>
            ) : (
              <AddCategory onCategoryAdded={fetchHandler} />
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-extrabold tracking-tight">
                        {item.value}
                      </p>
                    </div>
                    <div className={`rounded-md p-2 ${item.className}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {item.caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <Card className="glass-card overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <Tabs value={value} onValueChange={onClickHandle} className="w-full">
              <div className="flex flex-col gap-4 border-b border-border/60 bg-background/35 p-4 lg:flex-row lg:items-center lg:justify-between">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-muted/50 p-1 sm:w-[360px]">
                  <TabsTrigger
                    value="trashes"
                    className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                  >
                    Daftar Sampah
                  </TabsTrigger>
                  <TabsTrigger
                    value="categories"
                    className="rounded-md px-3 py-2 text-xs font-bold data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground sm:text-sm"
                  >
                    Daftar Kategori
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="relative w-full lg:w-80">
                    <SearchIcon
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Cari data di halaman ini"
                      className="glass-input h-10 w-full rounded-md pl-9 pr-10"
                    />
                    {searchTerm ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setSearchTerm("")}
                        aria-label="Bersihkan pencarian"
                      >
                        <XIcon size={15} />
                      </Button>
                    ) : null}
                  </div>

                  {value === "trashes" ? (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeftIcon size={17} />
                      </Button>
                      <span className="min-w-[116px] text-center text-xs font-bold text-muted-foreground">
                        Halaman {page} / {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        aria-label="Halaman berikutnya"
                      >
                        <ChevronRightIcon size={17} />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold">
                    {value === "trashes"
                      ? "Daftar material sampah"
                      : "Daftar kategori sampah"}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {value === "trashes"
                      ? `Menampilkan ${filteredTrashes.length} dari ${trashes.length} data halaman ini`
                      : `Menampilkan ${filteredCategories.length} dari ${categories.length} kategori`}
                  </p>
                </div>

                <TableTrash
                  loadingTrashes={loadingTrashes}
                  trashes={filteredTrashes}
                  loadingUpdate={loadingUpdate}
                  open={open}
                  setOpen={setOpen}
                  selectedTrash={selectedTrash}
                  deleteTrash={deleteTrash}
                  handleClickTrash={handleClickTrash}
                  handleClickTrashDetails={handleClickTrashDetails}
                  emptyMessage={
                    normalizedSearch
                      ? "Tidak ada sampah yang cocok"
                      : "Tidak ada sampah"
                  }
                />
                <TableCategory
                  loadingCategories={loadingCategories}
                  categories={filteredCategories}
                  handleClickCategory={handleClickCategory}
                  open={open}
                  setOpen={setOpen}
                  selectedCategory={selectedCategory}
                  fetchHandler={fetchHandler}
                  deleteCategory={deleteCategory}
                  emptyMessage={
                    normalizedSearch
                      ? "Tidak ada kategori yang cocok"
                      : "Tidak ada kategori"
                  }
                />
              </div>
            </Tabs>
          </CardContent>
        </Card>
        <RafiHadiyasa />
      </main>
    </div>
  );
};

export default TrashPage;
