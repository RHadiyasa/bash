import { Avatar, AvatarImage } from "./ui/avatar";

const Customer = ({ no, name, email, transaction }) => {
  return (
    <div className="flex items-center justify-between mt-5 gap-3">
      <div className="flex items-center gap-7">
        <div>
          <div className="text-xl font-bold">{no}</div>
        </div>
        <div className="flex gap-5">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold">{name}</span>
            <span className="text-sm font-normal text-white/50">
              {email}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-end text-right">
        <span className="text-sm font-bold">{transaction}</span>
      </div>
    </div>
  );
};

export default Customer;
