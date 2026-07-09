"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, BarChart3, Settings, Award, UploadCloud} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Upload Resume", href: "/upload", icon: UploadCloud }, // <-- Add this line
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#030303] text-zinc-200 border-r border-zinc-900 flex flex-col justify-between z-30">
      {/* Top Section / Brand Logo */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-zinc-900 gap-2">
          <Award className="h-5 w-5 text-indigo-400" />
          <span className="text-base font-bold tracking-tight text-white">ResumeRank</span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/10"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Section */}
      <div className="p-4 border-t border-zinc-900">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 ${
            pathname === "/settings" ? "bg-zinc-900 text-white" : ""
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}