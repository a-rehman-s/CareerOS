import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { Briefcase, Send, Calendar, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

async function getDashboardStats(userId: string) {
  const [
    totalApplications,
    activeApplications,
    interviewCount,
    totalJobs,
  ] = await Promise.all([
    db.application.count({ where: { userId } }),
    db.application.count({
      where: {
        userId,
        status: { in: ["APPLIED", "SCREENING", "INTERVIEW", "FINAL_INTERVIEW"] },
      },
    }),
    db.interview.count({ where: { userId } }),
    db.job.count({ where: { userId } }),
  ]);

  const recentApplications = await db.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      job: {
        include: { company: true },
      },
    },
  });

  return {
    totalApplications,
    activeApplications,
    interviewCount,
    totalJobs,
    recentApplications,
  };
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {trend && (
        <p className="text-xs text-emerald-500 font-medium">{trend}</p>
      )}
    </div>
  );
}

const APPLICATION_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  SAVED: { label: "Saved", className: "bg-slate-500/10 text-slate-400" },
  INTERESTED: { label: "Interested", className: "bg-blue-500/10 text-blue-400" },
  APPLIED: { label: "Applied", className: "bg-indigo-500/10 text-indigo-400" },
  SCREENING: { label: "Screening", className: "bg-yellow-500/10 text-yellow-400" },
  INTERVIEW: { label: "Interview", className: "bg-orange-500/10 text-orange-400" },
  FINAL_INTERVIEW: { label: "Final", className: "bg-purple-500/10 text-purple-400" },
  OFFER: { label: "Offer", className: "bg-emerald-500/10 text-emerald-400" },
  REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-400" },
  WITHDRAWN: { label: "Withdrawn", className: "bg-gray-500/10 text-gray-400" },
  ARCHIVED: { label: "Archived", className: "bg-gray-500/10 text-gray-500" },
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await getDashboardStats(user.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Good {getGreeting()}, {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s your career overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          description="All time"
          icon={<Send className="w-4 h-4" />}
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          description="In progress"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Interviews"
          value={stats.interviewCount}
          description="Scheduled or completed"
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          title="Jobs Tracked"
          value={stats.totalJobs}
          description="In your job library"
          icon={<Briefcase className="w-4 h-4" />}
        />
      </div>

      {/* Recent Applications */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Applications</h2>
          <a
            href="/dashboard/applications"
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View all →
          </a>
        </div>

        {stats.recentApplications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No applications yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Start tracking your job search by saving your first job.
            </p>
            <a
              href="/dashboard/jobs"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Browse jobs →
            </a>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentApplications.map((application) => {
              const statusBadge =
                APPLICATION_STATUS_BADGE[application.status] ??
                APPLICATION_STATUS_BADGE.SAVED;
              return (
                <div
                  key={application.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {application.job.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {application.job.company?.name ?? "Unknown Company"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Add Job", href: "/dashboard/jobs", emoji: "💼" },
            { label: "Update Profile", href: "/dashboard/profile", emoji: "👤" },
            { label: "Create Resume", href: "/dashboard/resumes", emoji: "📄" },
            { label: "AI Assistant", href: "/dashboard/ai", emoji: "✨" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/30 transition-all text-center group"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
