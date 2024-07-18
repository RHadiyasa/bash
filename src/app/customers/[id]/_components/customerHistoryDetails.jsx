import { GrTransaction } from "react-icons/gr";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import formatRupiah from "@/lib/helpers/formatRupiah";
import formatDateToIndonesian from "@/lib/helpers/formatDate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const CustomerHistoryDetails = ({ customerData, transactionHistoryData }) => {
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTransactionHistories(transactionHistoryData.transactions);
  }, []);

  const handleLoading = () => {
    setLoading(true);
  };

  return (
    <div className="grid">
      {transactionHistories !== 0 ? (
        <div>
          <div className="font-semibold text-lg text-center py-2">
            Transaksi Terakhir {customerData.fullName}
          </div>
          <Separator />
          <ScrollArea className="max-h-72 rounded-md">
            {Array.isArray(transactionHistories) &&
              transactionHistories.map((trans) => (
                <div key={trans._id}>
                  <div className={trans.transactionStatus === "failed" ? "opacity-20 bg-red-500 rounded-lg" : ""}>
                    <div className="bg-white/10 py-2 px-5 mt-3 text-white font-semibold text-sm rounded-lg flex items-center justify-between">
                      <div>{formatDateToIndonesian(trans.createdAt)}</div>
                      <div className="flex items-center gap-2">
                        <div
                          className={
                            trans.transactionType === "deposit"
                              ? "text-blue-300"
                              : "text-orange-400"
                          }
                        >
                          {trans.transactionType}
                        </div>
                        <div>({formatRupiah(trans.transactionAmount)})</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <Separator className="mt-3" />
      <Link
        onClick={handleLoading}
        href={`/customers/${customerData._id}/detailtransaction`}
      >
        <div className="flex items-center justify-center gap-2 text-sm p-2 bg-white text-black rounded-lg mt-5">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Loading...
            </div>
          ) : (
            <div className="flex items-center gap-2 font-semibold">
              Lihat detail transaksi <GrTransaction />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CustomerHistoryDetails;
