import { fetchTrashesById } from "@/lib/lib/api";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { useEffect, useState } from "react";
import { Separator } from "../../../../components/ui/separator";
import { Dot, DotSquare, MoveRightIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";

const TrashUpdateList = ({ notFound, onTrashUpdate, trashes }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const showList = async () => {
      try {
        const token = process.env.TOKEN_SECRET;
        const categoriesData = await fetchTrashesById(trashes._id, token);

        // console.log(categoriesData)
        setLogs(categoriesData.changeLogs);
      } catch (error) {
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };
    showList();
  }, [trashes._id]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Card className="bg-[#09090B] w-full max-h-screen mb-10 lg:w-1/3">
      <CardHeader>
        {notFound ? (
          <div>Sampah tidak ditemukan</div>
        ) : (
          <div className="font-bold text-lg xl:text-xl">
            Update list {trashes.trashName}
          </div>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="bg-[#09090B] lg:p-3">
        {loading ? (
          <div className="p-5 md:p-3 animate-pulse font-bold">loading data...</div>
        ) : logs && logs.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="flex flex-col-reverse gap-4 mt-5 lg:mt-0">
              {logs.map((log, index) => {
                const { changes, updatedAt } = log;
                const priceChange = changes.trashPrice;
                const nameChange = changes.trashName;
                const categoryChange = changes.trashCategory;
                const descriptionChange = changes.trashDescription;
                const updatedAtChange = new Date(updatedAt).toLocaleString(
                  "id-ID",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "Asia/Jakarta",
                  }
                );
                return (
                  <div
                    key={index}
                    className="grid gap-1 text-[10pt] border rounded-lg bg-[#151518] py-3 md:py-5 px-4 md:px-4 xl:px-8"
                  >
                    <div>
                      <div className="flex gap-1 font-semibold text-[9pt] md:text-[9pt] xl:text-sm">{updatedAtChange}</div>
                    </div>
                    <div className="grid text-white/50 font-light text-[8pt] md:text-[9pt]">
                      <div>
                        {priceChange && (
                          <div className="flex items-center">
                            <Dot size={20} />
                            <div className="w-full flex justify-between">
                              <div>Update Harga</div>
                              <div className="flex items-center gap-1">
                                (Dari <MoveRightIcon size={10} />
                                {formatRupiah(priceChange)})
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {nameChange && (
                          <div className="flex items-center">
                            <Dot size={20} />
                            <div className="w-full flex justify-between">
                              <span>Update Name</span>
                              <span>({nameChange})</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {categoryChange && (
                          <div className="flex items-center">
                            <Dot size={20} />
                            <span>Perubahan kategori</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {descriptionChange && (
                          <div className="flex items-center">
                            <Dot size={20} />
                            <span>Perubahan deskripsi</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-5 animate-pulse font-bold">No changes logged</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrashUpdateList;
