import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "E-Money",
  description: "Money isn't real, but it doesn't have to be",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className={`bg-black text-white`}>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </>
  );
}
