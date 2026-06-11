// import { Inter as Fontsans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

// const fontSans = Fontsans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "BashApp",
  description: "BankSampah application system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased"
          // fontSans.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
