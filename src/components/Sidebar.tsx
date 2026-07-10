"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, UploadCloud, BarChart3, Briefcase } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Upload Resume", href: "/upload", icon: UploadCloud },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#030303] border-r border-zinc-900 h-screen p-6 flex flex-col space-y-6 shrink-0">
      <div className="text-lg font-bold tracking-wider text-white px-2">
        Resume<span className="text-indigo-500">Rank</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}