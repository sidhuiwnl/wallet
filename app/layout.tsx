import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "CRYWO",
  description: "A web based wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
        >
        <Navbar/>
        <main> 
        {children}
        </main>
        </ThemeProvider>
       
        </body>
    </html>
  );
}
