import {
  LayoutDashboard,
  Briefcase,
  Users,
  UploadCloud,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Candidates",
    href: "/candidates",
    icon: Users,
  },
  {
    name: "Upload Resume",
    href: "/upload",
    icon: UploadCloud,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];