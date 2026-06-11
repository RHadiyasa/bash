import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Pagination = ({
  handleNextPage,
  handlePrevPage,
  currentPage,
  totalPages,
  totalItems = 0,
  pageSize = 10,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-muted-foreground">
        Menampilkan {startItem}-{endItem} dari {totalItems} transaksi
      </p>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon size={17} />
        </Button>
        <span className="min-w-[116px] rounded-md border border-border/60 bg-background/45 px-3 py-2 text-center text-xs font-bold text-muted-foreground">
          Halaman {currentPage} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRightIcon size={17} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
