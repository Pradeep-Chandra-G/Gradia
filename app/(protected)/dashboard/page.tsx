import Card from "@/app/components/Card";
import GlobalSettings from "@/app/components/GlobalSettings";
import { LiveActivity } from "@/app/components/LiveActivity";
import Sidebar from "@/app/components/Sidebar";
import { AssessmentTable } from "@/app/components/Table";
import { ensureUserInDatabase } from "@/lib/sync-user";
import {
  getDashboardStats,
  getRecentAssessments,
} from "@/app/actions/dashboard-actions";
import { getRecentActivity } from "@/app/actions/activity-actions";
import {
  ChartNoAxesCombined,
  CircleCheckBig,
  Cog,
  FileUp,
  FolderOpen,
  NotepadTextDashed,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import { error } from "node:console";

async function DashboardPage() {
  // Ensure user is synced to database
  await ensureUserInDatabase();

  // Fetch real data
  const statsResult = await getDashboardStats();
  const assessmentsResult = await getRecentAssessments();
  const activityResult = await getRecentActivity();

  const stats = statsResult.success
    ? statsResult.stats
    : {
        activeAssignments: 0,
        totalCandidates: 0,
        avgCompletionRate: 0,
      };
  if (!stats) {
    redirect("/error");
  }

  const assessments = assessmentsResult.success
    ? assessmentsResult.assessments
    : [];

  if (!assessments) {
    redirect("/error");
  }
  const activities = activityResult.success ? activityResult.activities : [];

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-row justify-between p-8 items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, here&apos;s what&apos;s happening with your
              assessments today.
            </p>
          </div>

          <div className="flex flex-row items-center gap-8">
            {/* BADGE */}
            <div className="rounded-full bg-green-400/5 text-xs px-4 py-1 flex flex-row items-center gap-2 border border-green-400/20">
              <div className="bg-green-500 animate-pulse h-2 w-2 rounded-full "></div>
              <p className="text-green-600 ">Systems operational</p>
            </div>

            {/* CREATE NEW QUIZ BUTTON */}
            <Link
              href="/quiz/create"
              className="bg-primary-button text-white px-4 py-2 rounded-lg text-sm shadow-md shadow-primary-button/30 hover:bg-primary-button/90 active:scale-95 transition-transform flex flex-row items-center gap-2"
            >
              <Plus size={20} />
              Create New Quiz
            </Link>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="px-8">
          <div className="grid grid-cols-3 gap-4">
            <Card
              trend={10}
              value={stats.activeAssignments}
              description="Active assignments"
              type="percentage"
              icon={
                <NotepadTextDashed size={28} className="text-primary-button" />
              }
              iconBgColor="bg-primary-button/5"
            />
            <Card
              trend={-2}
              value={stats.totalCandidates}
              description="Total Candidates"
              type="percentage"
              icon={<Users size={28} className="text-fuchsia-500" />}
              iconBgColor="bg-fuchsia-500/5"
            />
            <Card
              trend={8}
              value={Math.round(stats.avgCompletionRate)}
              description="Avg. Completion Rate"
              type="time"
              icon={<CircleCheckBig size={28} className="text-amber-500" />}
              iconBgColor="bg-amber-500/5"
            />
          </div>
        </div>

        {/* RECENT ASSESSMENTS & LIVE ACTIVITY */}
        <div className="p-8 flex flex-row gap-8">
          {/* RECENT ASSESSMENTS */}
          <div className=" w-3/4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold">Recent Assessments</h2>
              <Link
                href="/quiz"
                className="text-md text-primary-button font-semibold hover:cursor-pointer hover:underline"
              >
                View All
              </Link>
            </div>

            {assessments.length > 0 ? (
              <AssessmentTable data={assessments} />
            ) : (
              <div className="mt-4 rounded-xl border border-white/10 bg-foreground p-8 text-center">
                <p className="text-gray-400">No assessments yet</p>
                <Link
                  href="/quiz/create"
                  className="mt-4 inline-block text-primary-button hover:underline"
                >
                  Create your first quiz
                </Link>
              </div>
            )}
          </div>

          {/* LIVE ACTIVITY */}
          <div className="w-1/4">
            <h2 className="text-xl font-bold">Live Activity</h2>
            <div className="mt-4">
              {activities.length > 0 ? (
                <LiveActivity activities={activities} />
              ) : (
                <div className="rounded-xl border border-white/10 bg-foreground p-6 text-center">
                  <p className="text-gray-400 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="w-full">
            {/* GLOBAL SETTINGS */}
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  icon: FileUp,
                  title: "Bulk Import Users",
                },
                {
                  icon: ChartNoAxesCombined,
                  title: "Generate Report",
                },
                {
                  icon: FolderOpen,
                  title: "Browse Templates",
                },
                {
                  icon: Cog,
                  title: "Global Settings",
                },
              ].map((item) => (
                <GlobalSettings
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
