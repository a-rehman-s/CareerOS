"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Globe,
  Briefcase,
  Send,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNav, type NavItemConfig } from "./nav-config";

// Map icon name strings to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  User,
  FileText,
  Globe,
  Briefcase,
  Send,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
};

interface SidebarNavItemProps {
  item: NavItemConfig;
  isCollapsed?: boolean;
}

function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = iconMap[item.icon] ?? ChevronRight;

  // Active if exact match for dashboard root, or starts-with for sub-routes
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
      )}
      title={isCollapsed ? item.title : undefined}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
        )}
      />
      {!isCollapsed && (
        <span className="truncate">{item.title}</span>
      )}
      {!isCollapsed && item.badge && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold px-1">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 shrink-0",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-500/25 shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sidebar-foreground font-bold text-sm leading-tight truncate">
            Career<span className="text-indigo-400">OS</span>
          </span>
          <span className="text-sidebar-foreground/40 text-xs leading-tight">
            Career Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin">
        {dashboardNav.map((group, i) => (
          <div key={i} className="space-y-1">
            {group.title && (
              <p className="px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1">
                {group.title}
              </p>
            )}
            {group.items.map((item) => (
              <SidebarNavItem key={item.href} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <p className="text-center text-sidebar-foreground/30 text-xs">
          CareerOS v0.1.0
        </p>
      </div>
    </aside>
  );
}
