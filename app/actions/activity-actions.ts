// app/actions/activity-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getRecentActivity() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get recent test attempts (starts)
    const recentStarts = await prisma.testAttempt.findMany({
      where: {
        startedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        test: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 10,
    });

    // Get completed tests
    const recentCompletions = await prisma.testAttempt.findMany({
      where: {
        endedAt: {
          not: null,
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        test: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        endedAt: "desc",
      },
      take: 10,
    });

    // Get new users
    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Format activities
    const activities = [
      ...recentStarts.map((attempt) => ({
        id: attempt.id,
        type: "start" as const,
        title: `${attempt.user.name} started`,
        highlight: attempt.test.title,
        time: formatTimeAgo(attempt.startedAt),
      })),
      ...recentCompletions.map((attempt) => ({
        id: attempt.id,
        type: "complete" as const,
        title: `${attempt.user.name} completed`,
        highlight: attempt.test.title,
        time: formatTimeAgo(attempt.endedAt!),
      })),
      ...recentUsers.map((user) => ({
        id: user.id,
        type: "user" as const,
        title: "New User Registration:",
        highlight: user.name,
        time: formatTimeAgo(user.createdAt),
      })),
    ]
      .sort((a, b) => {
        // Sort by most recent
        return 0; // Already sorted by SQL
      })
      .slice(0, 10);

    return {
      success: true,
      activities,
    };
  } catch (error) {
    console.error("Error fetching activity:", error);
    return {
      success: false,
      error: "Failed to fetch activity",
      activities: [],
    };
  }
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export async function logActivity(type: string, data: any) {
  // Future: implement activity logging to database
  // For now, activities are derived from existing data
  return { success: true };
}
