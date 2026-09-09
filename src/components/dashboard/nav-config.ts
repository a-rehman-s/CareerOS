/**
 * Dashboard navigation configuration.
 * Using string icon names instead of importing Lucide here
 * to keep this config file server-safe and tree-shakeable.
 */

export type NavItemConfig = {
  title: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: string;
  description?: string;
};

export type NavGroupConfig = {
  title?: string;
  items: NavItemConfig[];
};

export const dashboardNav: NavGroupConfig[] = [
  {
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: "LayoutDashboard",
        description: "Career summary and insights",
      },
    ],
  },
  {
    title: "Profile",
    items: [
      {
        title: "Career Profile",
        href: "/dashboard/profile",
        icon: "User",
        description: "Personal and professional information",
      },
      {
        title: "Resumes",
        href: "/dashboard/resumes",
        icon: "FileText",
        description: "Resume versions and management",
      },
      {
        title: "Portfolio",
        href: "/dashboard/portfolio",
        icon: "Globe",
        description: "Public portfolio settings",
      },
    ],
  },
  {
    title: "Job Search",
    items: [
      {
        title: "Jobs",
        href: "/dashboard/jobs",
        icon: "Briefcase",
        description: "Discover and manage jobs",
      },
      {
        title: "Applications",
        href: "/dashboard/applications",
        icon: "Send",
        description: "Track your applications",
      },
      {
        title: "Interviews",
        href: "/dashboard/interviews",
        icon: "Calendar",
        description: "Interview schedule and prep",
      },
    ],
  },
  {
    title: "Intelligence",
    items: [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: "BarChart3",
        description: "Career performance analytics",
      },
      {
        title: "AI Assistant",
        href: "/dashboard/ai",
        icon: "Sparkles",
        description: "AI-powered career guidance",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: "Settings",
        description: "Account and preferences",
      },
    ],
  },
];
