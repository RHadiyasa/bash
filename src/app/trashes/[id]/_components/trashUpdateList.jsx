import { fetchTrashesById } from "@/lib/api";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { useEffect, useState } from "react";
import {
  BanknoteIcon,
  ClockIcon,
  FileTextIcon,
  HistoryIcon,
  Layers3Icon,
  Loader2,
  MoveRightIcon,
  PencilLineIcon,
} from "lucide-react";

const TrashUpdateList = ({ notFound, trashes, featured = false }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const showList = async () => {
      if (!trashes?._id) {
        setLoading(false);
        return;
      }

      try {
        const token = process.env.TOKEN_SECRET;
        const categoriesData = await fetchTrashesById(trashes._id, token);

        setLogs(categoriesData?.changeLogs || []);
      } catch (error) {
        console.error("Gagal memuat riwayat sampah", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    showList();
  }, [trashes?._id]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const changeItems = [
    {
      key: "trashPrice",
      label: "Update Harga",
      icon: BanknoteIcon,
      render: (value) => (
        <span className="inline-flex items-center gap-1">
          Dari <MoveRightIcon size={12} /> {formatRupiah(value)}
        </span>
      ),
    },
    {
      key: "trashName",
      label: "Update Nama",
      icon: PencilLineIcon,
      render: (value) => value,
    },
    {
      key: "trashCategory",
      label: "Perubahan Kategori",
      icon: Layers3Icon,
      render: () => "Kategori diperbarui",
    },
    {
      key: "trashDescription",
      label: "Perubahan Deskripsi",
      icon: FileTextIcon,
      render: () => "Deskripsi diperbarui",
    },
  ];

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  return (
    <Card className="glass-card w-full overflow-hidden rounded-lg">
      <CardHeader className="border-b border-border/60 bg-background/30">
        {notFound ? (
          <div>Sampah tidak ditemukan</div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-200">
                <HistoryIcon size={20} />
              </span>
              <div>
                <div
                  className={
                    featured
                      ? "text-xl font-black tracking-tight"
                      : "text-lg font-black xl:text-xl"
                  }
                >
                  Riwayat Update
                </div>
                <p className="text-sm text-muted-foreground font-bold">
                  {trashes?.trashName || "Material"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <div className="w-fit rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">
                {logs.length} perubahan
              </div>
              <p className="mt-1 text-sm font-semibold text-primary">
                Perubahan terbaru ditampilkan paling atas
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className={featured ? "p-5 sm:p-6" : "p-4"}>
        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-bold">Memuat riwayat</p>
            </div>
          </div>
        ) : sortedLogs.length > 0 ? (
          <div
            className={
              featured
                ? "max-h-[380px] overflow-y-auto pr-2 [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]"
                : "max-h-[320px] overflow-y-auto pr-2 [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin]"
            }
          >
            <div className="relative grid gap-4">
              <div className="absolute bottom-4 left-5 top-4 w-px bg-border/70" />
              {sortedLogs.map((log, index) => {
                const { changes, updatedAt } = log;
                const activeChanges = changeItems.filter(
                  (item) => changes?.[item.key],
                );
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
                  },
                );
                return (
                  <div
                    key={index}
                    className="relative grid grid-cols-[42px_minmax(0,1fr)] gap-3"
                  >
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-background text-primary shadow-sm">
                      <ClockIcon size={17} />
                    </div>
                    <div className="rounded-lg border border-border/60 bg-background/45 p-4 shadow-sm backdrop-blur">
                      <div className="text-sm font-black">
                        {updatedAtChange}
                      </div>
                      <div className="mt-3 grid gap-2">
                        {activeChanges.length > 0 ? (
                          activeChanges.map((item) => {
                            const Icon = item.icon;
                            const value = changes[item.key];

                            return (
                              <div
                                key={item.key}
                                className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/55 px-3 py-2 text-xs font-semibold text-muted-foreground"
                              >
                                <span className="inline-flex items-center gap-2 text-foreground">
                                  <Icon size={14} className="text-primary" />
                                  {item.label}
                                </span>
                                <span className="text-right">
                                  {item.render(value)}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-md border border-border/60 bg-background/55 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Perubahan tersimpan
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/25 p-8 text-center text-sm font-bold">
            Belum ada perubahan
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrashUpdateList;
