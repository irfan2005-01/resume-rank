import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeRank Dashboard",
  description: "AI-Powered Smart Candidate Matcher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-50">
      <body className="h-full antialiased font-sans">
        <div className="min-h-screen flex">
          {/* Persistent Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area Frame Wrapper */}
          <div className="flex-1 pl-64 flex flex-col">
            <main className="p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}