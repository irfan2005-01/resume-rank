"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#09090B] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={false}
        setCollapsed={setCollapsed}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#09090B] px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-semibold">
            Resume<span className="text-indigo-500">Rank</span>
          </h1>

          <div className="text-sm text-zinc-400">
            Welcome
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}