"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { AssessmentStatus } from "@/lib/types";

/**
 * Server Action to get dashboard statistics
 */
export async function getDashboardStats() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    // Get stats based on user role
    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      // Instructor/Admin stats
      const [activeTests, uniqueCandidates, avgCompletionRate] =
        await Promise.all([
          prisma.test.count({
            where: {
              creatorId: user.id,
              type: "EXAM",
            },
          }),

          prisma.testAttempt.groupBy({
            by: ["userId"],
            where: {
              test: {
                creatorId: user.id,
              },
            },
          }),

          prisma.testAttempt.aggregate({
            where: {
              test: {
                creatorId: user.id,
              },
              endedAt: {
                not: null,
              },
            },
            _avg: {
              score: true,
            },
          }),
        ]);

      return {
        success: true,
        stats: {
          activeAssignments: activeTests,
          totalCandidates: uniqueCandidates.length,
          avgCompletionRate: avgCompletionRate._avg.score || 0,
        },
      };
    } else {
      // Student stats
      const [attemptedTests, avgScore, completedTests] = await Promise.all([
        prisma.testAttempt.count({
          where: {
            userId: user.id,
          },
        }),

        prisma.testAttempt.aggregate({
          where: {
            userId: user.id,
            endedAt: {
              not: null,
            },
          },
          _avg: {
            score: true,
          },
        }),

        prisma.testAttempt.count({
          where: {
            userId: user.id,
            endedAt: {
              not: null,
            },
          },
        }),
      ]);

      return {
        success: true,
        stats: {
          activeAssignments: attemptedTests,
          totalCandidates: completedTests,
          avgCompletionRate: avgScore._avg.score || 0,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard statistics",
    };
  }
}

/**
 * Server Action to get recent assessments/tests
 */
export async function getRecentAssessments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    let tests;

    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      // Get tests created by instructor
      tests = await prisma.test.findMany({
        where: {
          creatorId: user.id,
        },
        include: {
          attempts: {
            where: {
              endedAt: null, // Only count ongoing attempts
            },
          },
          _count: {
            select: {
              attempts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    } else {
      // Get tests assigned to student's batches
      tests = await prisma.test.findMany({
        where: {
          batch: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
        include: {
          attempts: {
            where: {
              userId: user.id,
            },
          },
          _count: {
            select: {
              attempts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    }

    // Transform to match your Assessment type
    const assessments = tests.map((test) => ({
      id: test.id,
      name: test.title,
      subtitle: test.description || undefined,
      status: (test.attempts.length > 0
        ? "live"
        : "published") as AssessmentStatus,
      candidates: {
        current: test.attempts.length,
        total: test._count.attempts,
      },
      date: test.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

    return {
      success: true,
      assessments,
    };
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return {
      success: false,
      error: "Failed to fetch assessments",
    };
  }
}

/**
 * Server Action to get user profile info
 */
export async function getUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            batch: true,
          },
        },
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      error: "Failed to fetch user profile",
    };
  }
}
