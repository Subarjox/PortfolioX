import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fahreza - Portfolio",
  description: "The Best AI Engineer & Software Engineer from Cimahi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060608] text-white antialiased min-h-screen w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
