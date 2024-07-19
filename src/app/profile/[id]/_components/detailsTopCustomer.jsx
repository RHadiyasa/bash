import Avatar from "react-avatar";

const DetailTopCustomer = ({ no, name, id, transaction }) => {
  return (
    <div className="flex items-center justify-between mt-5 gap-3">
      <div className="flex items-center gap-4 md:gap-3">
        <div className="font-bold text-base md:text-lg">{no}</div>
        <div className="flex items-center gap-3">
          <Avatar
            name={name}
            size="32" // Ukuran avatar
            textSizeRatio={2.75} // Rasio ukuran teks
            round={true}
          />
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-[10pt] md:text-sm lg:text-sm">
              {name}
            </span>
            <span className="text-xs text-white/40">{id}</span>
          </div>
        </div>
      </div>
      <div className="flex items-end text-right">
        <span className="text-[8pt] md:text-xs font-bold">{transaction}</span>
      </div>
    </div>
  );
};

export default DetailTopCustomer;
