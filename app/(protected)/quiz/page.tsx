import React from "react";
import { ensureUserInDatabase } from "@/lib/sync-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Clock, Users, Calendar } from "lucide-react";

async function QuizPage() {
  await ensureUserInDatabase();
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  // Fetch user's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Fetch quizzes based on role
  let quizzes;
  if (user?.role === "INSTRUCTOR" || user?.role === "ADMIN") {
    // Show quizzes created by instructor
    quizzes = await prisma.test.findMany({
      where: { creatorId: userId },
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Show quizzes assigned to student's batches
    quizzes = await prisma.test.findMany({
      where: {
        batch: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        batch: true,
        attempts: {
          where: { userId: userId },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
            <p className="text-gray-400">
              {user?.role === "STUDENT"
                ? "Available quizzes and assessments"
                : "Manage your quizzes and tests"}
            </p>
          </div>

          {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
            <Link
              href="/quiz/create"
              className="px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 flex items-center gap-2"
            >
              Create New Quiz
            </Link>
          )}
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-foreground rounded-xl border border-white/10 p-12 text-center">
            <p className="text-gray-400 mb-4">No quizzes available yet</p>
            {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
              <Link
                href="/quiz/create"
                className="inline-block px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90"
              >
                Create Your First Quiz
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const userAttempt =
                "attempts" in quiz
                  ? (quiz as any).attempts.find((a: any) => a.userId === userId)
                  : null;
              const hasAttempted = !!userAttempt;

              return (
                <div
                  key={quiz.id}
                  className="bg-foreground rounded-xl border border-white/10 p-6 hover:border-primary-button/50 transition-all"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {quiz.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={16} />
                        <span>{quiz.duration} minutes</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users size={16} />
                      <span>{quiz._count.attempts} attempts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} />
                      <span>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        quiz.type === "EXAM"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {quiz.type}
                    </span>

                    {user?.role === "STUDENT" ? (
                      hasAttempted ? (
                        <Link
                          href={`/results/${userAttempt.id}`}
                          className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 text-sm"
                        >
                          View Results
                        </Link>
                      ) : (
                        <Link
                          href={`/quiz/take/${quiz.id}`}
                          className="px-4 py-2 bg-primary-button rounded-lg hover:bg-primary-button/90 text-sm"
                        >
                          Start Quiz
                        </Link>
                      )
                    ) : (
                      <Link
                        href={`/quiz/edit/${quiz.id}`}
                        className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 text-sm"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
