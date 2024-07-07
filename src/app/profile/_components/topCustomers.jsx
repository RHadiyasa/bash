import { Avatar, AvatarImage } from "../../../components/ui/avatar";

const TopCustomers = ({ no, name, id, transaction }) => {
  return (
    <div className="flex items-center justify-between mt-5 gap-3">
      <div className="flex items-center gap-4 md:gap-7">
        <div>
          <div className="text-xl font-bold">{no}</div>
        </div>
        <div className="flex gap-5">
          <Avatar className="md:h-12 md:w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-[10pt] md:text-sm lg:text-lg">{name}</span>
            <span className="text-xs text-white/40">{id}</span>
          </div>
        </div>
      </div>
      <div className="flex items-end text-right">
        <span className="text-[8pt] md:text-sm font-bold">{transaction}</span>
      </div>
    </div>
  );
};

export default TopCustomers;
