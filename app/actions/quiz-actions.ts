"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action to create a new quiz/test
 */
export async function createQuiz(data: any) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
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

    // Only instructors and admins can create quizzes
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return {
        success: false,
        error: "Only instructors and admins can create quizzes",
      };
    }

    // Create test with sections and questions
    const test = await prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        duration: data.duration,
        creatorId: user.id,
        sections: {
          create: data.sections.map((section: any) => ({
            name: section.name,
            questions: {
              create: section.questions.map((q: any) => ({
                text: q.text,
                type: q.type,
                difficulty: q.difficulty,
                marks: q.marks,
                testId: undefined, // Will be auto-set by relation
                options: {
                  create:
                    q.options?.map((opt: any) => ({
                      text: opt.text,
                      isCorrect: opt.isCorrect,
                    })) || [],
                },
              })),
            },
          })),
        },
      },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      testId: test.id,
      message: "Quiz created successfully!",
    };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      error: "Failed to create quiz",
    };
  }
}

/**
 * Server Action to get a quiz by ID
 */
export async function getQuiz(testId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sections: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        batch: true,
      },
    });

    if (!test) {
      return {
        success: false,
        error: "Quiz not found",
      };
    }

    return {
      success: true,
      test,
    };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return {
      success: false,
      error: "Failed to fetch quiz",
    };
  }
}

/**
 * Server Action to update a quiz
 */
export async function updateQuiz(testId: string, data: any) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user is the creator
    const test = await prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test || test.creatorId !== user?.id) {
      return {
        success: false,
        error: "You don't have permission to edit this quiz",
      };
    }

    // Update the test
    await prisma.test.update({
      where: { id: testId },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        duration: data.duration,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Quiz updated successfully!",
    };
  } catch (error) {
    console.error("Error updating quiz:", error);
    return {
      success: false,
      error: "Failed to update quiz",
    };
  }
}

/**
 * Server Action to delete a quiz
 */
export async function deleteQuiz(testId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user is the creator
    const test = await prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test || test.creatorId !== user?.id) {
      return {
        success: false,
        error: "You don't have permission to delete this quiz",
      };
    }

    // Delete the test (cascade will handle related data)
    await prisma.test.delete({
      where: { id: testId },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Quiz deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return {
      success: false,
      error: "Failed to delete quiz",
    };
  }
}

/**
 * Server Action to create a new test attempt
 * This runs on the server and has access to the database
 */
export async function startTestAttempt(
  testId: string,
): Promise<
  { success: true; attemptId: string } | { success: false; error: string }
> {
  // Get the authenticated user
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }

  try {
    // Check if user exists in database, if not create them
    let user = await prisma.user.findUnique({
      where: { email: userId }, // Using Clerk userId as email for now
    });

    if (!user) {
      // Create user in database if they don't exist
      // You'll need to get actual email from Clerk
      user = await prisma.user.create({
        data: {
          email: userId,
          name: "User", // Get from Clerk user object
          password: "", // Not needed with Clerk
          role: "STUDENT",
        },
      });
    }

    // Create a test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        testId: testId,
        startedAt: new Date(),
      },
    });

    // Revalidate the dashboard to show updated data
    revalidatePath("/dashboard");

    return {
      success: true,
      attemptId: attempt.id,
    };
  } catch (error) {
    console.error("Error starting test attempt:", error);
    return {
      success: false,
      error: "Failed to start test attempt",
    };
  }
}

export async function getTestAttemptResults(attemptId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        user: {
          id: userId,
        },
      },
      include: {
        test: {
          select: {
            title: true,
            duration: true,
            type: true,
          },
        },
        responses: {
          include: {
            question: {
              select: {
                text: true,
                type: true,
                marks: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return {
        success: false,
        error: "Attempt not found",
      };
    }

    // Calculate class stats
    const allAttempts = await prisma.testAttempt.findMany({
      where: {
        testId: attempt.testId,
        endedAt: { not: null },
      },
      select: {
        score: true,
        userId: true,
      },
    });

    const scores = allAttempts.map((a) => a.score || 0);
    const classAverage =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const sortedScores = [...scores].sort((a, b) => b - a);
    const rank = sortedScores.findIndex((s) => s === (attempt.score || 0)) + 1;

    return {
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score ?? 0,
        startedAt: attempt.startedAt.toISOString(),
        endedAt: attempt.endedAt!.toISOString(),
        test: {
          title: attempt.test.title,
          type: attempt.test.type,
          duration: attempt.test.duration ?? 0, // ✅ normalize null
        },
        responses: attempt.responses,
      },
      classAverage,
      rank,
      totalStudents: new Set(allAttempts.map((a) => a.userId)).size,
    };
  } catch (error) {
    console.error("Error fetching results:", error);
    return {
      success: false,
      error: "Failed to fetch results",
    };
  }
}

/**
 * Server Action to submit a question response
 */
export async function submitQuestionResponse(
  attemptId: string,
  questionId: string,
  answer: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the attempt belongs to this user
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        user: {
          email: userId,
        },
      },
    });

    if (!attempt) {
      throw new Error("Invalid test attempt");
    }

    // Get the question to check the answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Check if answer is correct (for MCQ/MSQ)
    let isCorrect = false;
    let marksAwarded = 0;

    if (question.type === "MCQ" || question.type === "TRUE_FALSE") {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      isCorrect = correctOption?.id === answer;
      marksAwarded = isCorrect ? question.marks : 0;
    }

    // Save the response
    const response = await prisma.questionResponse.create({
      data: {
        attemptId,
        questionId,
        answer,
        isCorrect,
        marksAwarded,
      },
    });

    return {
      success: true,
      isCorrect,
      marksAwarded,
    };
  } catch (error) {
    console.error("Error submitting response:", error);
    return {
      success: false,
      error: "Failed to submit response",
    };
  }
}

/**
 * Server Action to end test attempt and calculate score
 */
export async function endTestAttempt(attemptId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the attempt belongs to this user
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        user: {
          email: userId,
        },
      },
      include: {
        responses: true,
      },
    });

    if (!attempt) {
      throw new Error("Invalid test attempt");
    }

    // Calculate total score
    const totalScore = attempt.responses.reduce(
      (sum, response) => sum + (response.marksAwarded || 0),
      0,
    );

    // Update the attempt with end time and score
    await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        endedAt: new Date(),
        score: totalScore,
      },
    });

    revalidatePath("/results");

    return {
      success: true,
      score: totalScore,
    };
  } catch (error) {
    console.error("Error ending test attempt:", error);
    return {
      success: false,
      error: "Failed to end test attempt",
    };
  }
}

/**
 * Server Action to get user's test history
 */
export async function getUserTestHistory() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userId },
      include: {
        attempts: {
          include: {
            test: true,
          },
          orderBy: {
            startedAt: "desc",
          },
        },
      },
    });

    return {
      success: true,
      attempts: user?.attempts || [],
    };
  } catch (error) {
    console.error("Error fetching test history:", error);
    return {
      success: false,
      error: "Failed to fetch test history",
    };
  }
}
