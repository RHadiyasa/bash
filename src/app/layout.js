import { Inter as Fontsans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/lib/utils";

const fontSans = Fontsans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "BashApp",
  description: "BankSampah application system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark min-h-screen bg-black font-sans antialiased",
          fontSans.className
        )}
      >
        {children}
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider> */}
      </body>
    </html>
  );
}
