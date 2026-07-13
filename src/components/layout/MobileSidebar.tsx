"use client";

import { X } from "lucide-react";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileSidebar({
  open,
  onClose,
  collapsed,
  setCollapsed,
}: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative">

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-lg bg-zinc-900 p-2 hover:bg-zinc-800"
          >
            <X size={18} />
          </button>

          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onNavigate={onClose}
          />

        </div>
      </div>
    </>
  );
}
