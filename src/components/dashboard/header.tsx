import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { Bell, LogOut, Settings, User } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
}

export async function DashboardHeader({ title }: DashboardHeaderProps) {
  const session = await auth();
  const user = session?.user;
  const initials = getInitials(user?.name ?? user?.email);

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 shrink-0">
      {/* Left: page title */}
      <div className="flex items-center gap-2">
        {title && (
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {/* Right: notifications + user menu */}
      <div className="flex items-center gap-2">
        {/* Notification bell (stub for Phase 6+) */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User dropdown stub */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="User menu"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground leading-tight max-w-32 truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground leading-tight max-w-32 truncate">
                {user?.email}
              </p>
            </div>
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
            <a
              href="/dashboard/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
            <div className="border-t border-border my-1" />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/sign-in" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
