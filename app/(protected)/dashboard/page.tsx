import Card from "@/app/components/Card";
import GlobalSettings from "@/app/components/GlobalSettings";
import { LiveActivity } from "@/app/components/LiveActivity";
import Sidebar from "@/app/components/Sidebar";
import { AssessmentTable } from "@/app/components/Table";
import { auth } from "@clerk/nextjs/server";
import {
  Car,
  ChartNoAxesCombined,
  CircleCheckBig,
  Cog,
  EllipsisVertical,
  FileUp,
  FolderOpen,
  NotepadTextDashed,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function DashboardPage() {
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
            <div className="bg-primary-button text-white px-4 py-2 rounded-lg text-sm shadow-md shadow-primary-button/30 hover:bg-primary-button/90 active:scale-95 transition-transform flex flex-row items-center gap-2">
              <Plus size={20} />
              <Link href={"/quiz/create"}>Create New Quiz</Link>
            </div>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="px-8">
          <div className="grid grid-cols-3 gap-4">
            <Card
              trend={10}
              value={24}
              description="Active assignments"
              type="percentage"
              icon={
                <NotepadTextDashed size={28} className="text-primary-button" />
              }
              iconBgColor="bg-primary-button/5"
            />
            <Card
              trend={-2}
              value={12450}
              description="Total Candidates"
              type="percentage"
              icon={<Users size={28} className="text-fuchsia-500" />}
              iconBgColor="bg-fuchsia-500/5"
            />
            <Card
              trend={8}
              value={3}
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
              <button className="text-md text-primary-button font-semibold hover:cursor-pointer">
                View All
              </button>
            </div>

            <AssessmentTable
              data={[
                {
                  id: "1",
                  name: "Mid-Term Math Exam",
                  subtitle: "Algebra & Calculus",
                  status: "live",
                  candidates: { current: 45, total: 50 },
                  date: "Oct 24, 2023",
                },
                {
                  id: "2",
                  name: "Physics Unit 1",
                  status: "published",
                  candidates: { current: 0, total: 120 },
                  date: "Oct 26, 2023",
                },
                {
                  id: "3",
                  name: "History Final 2023",
                  status: "draft",
                  date: "Oct 28, 2023",
                },
              ]}
            />
          </div>

          {/* LIVE ACTIVITY */}
          <div className="w-1/4">
            <h2 className="text-xl font-bold">Live Activity</h2>
            <div className="mt-4">
              <LiveActivity
                activities={[
                  {
                    id: "1",
                    type: "start",
                    title: "Sarah Jenkins started",
                    highlight: "Mid-Term Math Exam",
                    time: "2 mins ago",
                  },
                  {
                    id: "2",
                    type: "complete",
                    title: "Class 10-B finished quiz",
                    time: "15 mins ago",
                  },
                  {
                    id: "3",
                    type: "alert",
                    title: "System Alert:",
                    highlight: "High Traffic",
                    time: "32 mins ago",
                  },
                  {
                    id: "4",
                    type: "user",
                    title: "New User Registration:",
                    highlight: "m.thompson",
                    time: "1 hour ago",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="px-8">
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
