import { Avatar, AvatarImage } from "./ui/avatar";

const Customer = ({ no, name, email, transaction }) => {
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
            <span className="font-semibold text-[8pt] md:text-lg">{name}</span>
            <span className="hidden md:flex text-sm font-normal text-white/50">
              {email}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-end text-right">
        <span className="text-[8pt] md:text-sm font-bold">{transaction}</span>
      </div>
    </div>
  );
};

export default Customer;
