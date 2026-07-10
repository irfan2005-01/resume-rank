import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeRank Dashboard",
  description: "AI-Powered Smart Candidate Matcher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sidebar - Hidden on tiny screens, or collapses */}
      <aside className="hidden md:block w-64 border-r border-zinc-900 p-6 flex-shrink-0">
        {/* Your sidebar content */}
      </aside>

      {/* Main Content Area - Allows horizontal sliding on mobile if content overflows */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-x-auto selection:bg-indigo-500/30">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}