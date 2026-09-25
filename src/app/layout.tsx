import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BARJOX - Interactive GPGPU Particle System",
  description: "High-end interactive GPGPU fluid particle simulation with React Three Fiber",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060608] text-white antialiased overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
