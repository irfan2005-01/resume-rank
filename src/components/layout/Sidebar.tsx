"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navigation } from "./navigation";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigate?: () => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-zinc-800 bg-[#09090B] transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}

      <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">

        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-44 opacity-100"
          }`}
        >
          <h1 className="text-xl font-bold">
            Resume<span className="text-indigo-500">Rank</span>
          </h1>

          <p className="text-xs text-zinc-500">
            AI Recruitment Platform
          </p>
        </div>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg p-2 transition hover:bg-zinc-800"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigation.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            onClick={onNavigate}
          />
        ))}
      </nav>

      {/* Footer */}

      <div className="border-t border-zinc-800 p-4">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0 h-0" : "opacity-100 h-auto"
          }`}
        >
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm font-semibold">
              ResumeRank AI
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Smart Hiring for MSMEs
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}