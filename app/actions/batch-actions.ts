"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action to create a new batch
 */
export async function createBatch(data: {
  name: string;
  description?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Only instructors and admins can create batches
    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can create batches",
      };
    }

    const batch = await prisma.batch.create({
      data: {
        name: data.name,
      },
    });

    revalidatePath("/batches");

    return {
      success: true,
      batchId: batch.id,
      message: "Batch created successfully",
    };
  } catch (error) {
    console.error("Error creating batch:", error);
    return {
      success: false,
      error: "Failed to create batch",
    };
  }
}

/**
 * Server Action to add students to batch
 */
export async function addStudentsToBatch(batchId: string, emails: string[]) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can add students",
      };
    }

    // Find or create users for emails
    const addedStudents = [];
    const errors = [];

    for (const email of emails) {
      try {
        // Find user by email
        let student = await prisma.user.findUnique({
          where: { email: email.trim() },
        });

        // If user doesn't exist, create them
        if (!student) {
          student = await prisma.user.create({
            data: {
              email: email.trim(),
              name: email.split("@")[0], // Use email prefix as name
              password: "", // Will be set via Clerk
              role: "STUDENT",
            },
          });
        }

        // Add to batch if not already a member
        const existingMember = await prisma.batchMember.findUnique({
          where: {
            userId_batchId: {
              userId: student.id,
              batchId,
            },
          },
        });

        if (!existingMember) {
          await prisma.batchMember.create({
            data: {
              userId: student.id,
              batchId,
            },
          });
          addedStudents.push(email);
        }
      } catch (error) {
        console.error(`Error adding ${email}:`, error);
        errors.push(email);
      }
    }

    revalidatePath("/batches");

    return {
      success: true,
      addedCount: addedStudents.length,
      added: addedStudents,
      errors,
      message: `Added ${addedStudents.length} student(s) successfully`,
    };
  } catch (error) {
    console.error("Error adding students to batch:", error);
    return {
      success: false,
      error: "Failed to add students",
    };
  }
}

/**
 * Server Action to get all batches
 */
export async function getBatches() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const batches = await prisma.batch.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tests: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        _count: {
          select: {
            members: true,
            tests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      batches,
    };
  } catch (error) {
    console.error("Error fetching batches:", error);
    return {
      success: false,
      error: "Failed to fetch batches",
    };
  }
}

/**
 * Server Action to get batch details
 */
export async function getBatchDetails(batchId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        tests: {
          include: {
            creator: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                attempts: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return {
        success: false,
        error: "Batch not found",
      };
    }

    return {
      success: true,
      batch,
    };
  } catch (error) {
    console.error("Error fetching batch details:", error);
    return {
      success: false,
      error: "Failed to fetch batch details",
    };
  }
}

/**
 * Server Action to remove student from batch
 */
export async function removeStudentFromBatch(batchId: string, userId: string) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can remove students",
      };
    }

    await prisma.batchMember.delete({
      where: {
        userId_batchId: {
          userId,
          batchId,
        },
      },
    });

    revalidatePath("/batches");

    return {
      success: true,
      message: "Student removed from batch",
    };
  } catch (error) {
    console.error("Error removing student:", error);
    return {
      success: false,
      error: "Failed to remove student",
    };
  }
}

/**
 * Server Action to delete batch
 */
export async function deleteBatch(batchId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can delete batches",
      };
    }

    // Delete batch (cascade will handle members)
    await prisma.batch.delete({
      where: { id: batchId },
    });

    revalidatePath("/batches");

    return {
      success: true,
      message: "Batch deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting batch:", error);
    return {
      success: false,
      error: "Failed to delete batch",
    };
  }
}

/**
 * Server Action to assign test to batch
 */
export async function assignTestToBatch(testId: string, batchId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can assign tests",
      };
    }

    // Update test to link with batch
    await prisma.test.update({
      where: { id: testId },
      data: {
        batchId,
      },
    });

    revalidatePath("/batches");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Test assigned to batch successfully",
    };
  } catch (error) {
    console.error("Error assigning test:", error);
    return {
      success: false,
      error: "Failed to assign test",
    };
  }
}

/**
 * Server Action to get batch statistics
 */
export async function getBatchStatistics(batchId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        members: true,
        tests: {
          include: {
            attempts: {
              where: {
                endedAt: {
                  not: null,
                },
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return {
        success: false,
        error: "Batch not found",
      };
    }

    // Calculate statistics
    const totalStudents = batch.members.length;
    const totalTests = batch.tests.length;
    const totalAttempts = batch.tests.reduce(
      (sum, test) => sum + test.attempts.length,
      0,
    );

    const avgScore =
      batch.tests.reduce((sum, test) => {
        const testAvg =
          test.attempts.reduce((s, a) => s + (a.score || 0), 0) /
          (test.attempts.length || 1);
        return sum + testAvg;
      }, 0) / (totalTests || 1);

    return {
      success: true,
      statistics: {
        totalStudents,
        totalTests,
        totalAttempts,
        avgScore: Math.round(avgScore * 10) / 10,
        completionRate:
          totalTests > 0
            ? (totalAttempts / (totalStudents * totalTests)) * 100
            : 0,
      },
    };
  } catch (error) {
    console.error("Error calculating statistics:", error);
    return {
      success: false,
      error: "Failed to calculate statistics",
    };
  }
}

/**
 * Server Action to bulk import students from CSV
 */
export async function bulkImportStudents(batchId: string, csvData: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "INSTRUCTOR" && user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can import students",
      };
    }

    // Parse CSV (simple implementation)
    const lines = csvData.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",");
    const emailIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("email"),
    );
    const nameIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("name"),
    );

    if (emailIndex === -1) {
      return {
        success: false,
        error: "CSV must have an email column",
      };
    }

    const students = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(",");
      const email = fields[emailIndex]?.trim();
      const name =
        nameIndex !== -1 ? fields[nameIndex]?.trim() : email?.split("@")[0];

      if (!email) continue;

      try {
        // Find or create user
        let student = await prisma.user.findUnique({
          where: { email },
        });

        if (!student) {
          student = await prisma.user.create({
            data: {
              email,
              name: name || email.split("@")[0],
              password: "",
              role: "STUDENT",
            },
          });
        }

        // Add to batch
        const existingMember = await prisma.batchMember.findUnique({
          where: {
            userId_batchId: {
              userId: student.id,
              batchId,
            },
          },
        });

        if (!existingMember) {
          await prisma.batchMember.create({
            data: {
              userId: student.id,
              batchId,
            },
          });
          students.push(email);
        }
      } catch (error) {
        console.error(`Error importing ${email}:`, error);
        errors.push(email);
      }
    }

    revalidatePath("/batches");

    return {
      success: true,
      imported: students.length,
      students,
      errors,
      message: `Imported ${students.length} student(s) successfully`,
    };
  } catch (error) {
    console.error("Error bulk importing students:", error);
    return {
      success: false,
      error: "Failed to import students",
    };
  }
}
