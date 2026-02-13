import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoodCrust Foods — DOSS ERP Dashboard",
  description:
    "Interactive case study analyzing GoodCrust Foods' DOSS ERP implementation, order-to-fulfillment reconciliation, and 3PL performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-base leading-relaxed">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            <div className="max-w-[1280px] mx-auto p-8">
              <div className="animate-fade-up">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
