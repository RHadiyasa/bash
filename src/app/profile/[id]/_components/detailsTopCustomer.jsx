import Avatar from "react-avatar";

const DetailTopCustomer = ({ no, name, id, transaction }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/35 p-3">
      <div className="flex min-w-0 items-center gap-4 md:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-black text-primary">
          {no}
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={name}
            size="32" // Ukuran avatar
            textSizeRatio={2.75} // Rasio ukuran teks
            round={true}
          />
          <div className="flex min-w-0 flex-col justify-center">
            <span className="truncate font-semibold text-[10pt] md:text-sm lg:text-sm">
              {name}
            </span>
            <span className="truncate text-xs text-muted-foreground">{id}</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-end text-right">
        <span className="rounded-md bg-primary/10 px-2 py-1 text-[8pt] font-bold text-primary md:text-xs">
          {transaction}
        </span>
      </div>
    </div>
  );
};

export default DetailTopCustomer;
