"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { NavigationItem } from "./navigation";

interface Props {
  item: NavigationItem;
  collapsed: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  item,
  collapsed,
  onClick,
}: Props) {
  const pathname = usePathname();

  const active = pathname === item.href;

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={clsx(
        "flex items-center rounded-xl transition-all duration-300",
        collapsed
          ? "justify-center p-3"
          : "gap-3 px-4 py-3",
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      )}
    >
      <Icon size={20} />

      {!collapsed && (
        <span className="text-sm font-medium">
          {item.name}
        </span>
      )}
    </Link>
  );
}