import { Button } from "@/components/ui/button";
import { GrNext, GrPrevious } from "react-icons/gr";

const Pagination = ({ handleNextPage, handlePrevPage, currentPage, totalPages }) => {
  return (
    <div className="flex justify-center lg:justify-end items-center p-4 gap-5">
      <Button
        className="bg-transparent text-white hover:bg-white/10"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <GrPrevious size={15} />
      </Button>
      <span className="text-xs lg:text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        className="bg-transparent text-white hover:bg-black/30"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <GrNext size={15} />
      </Button>
    </div>
  );
};

export default Pagination;
