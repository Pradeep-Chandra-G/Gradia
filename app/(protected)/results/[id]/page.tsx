import { getTestAttemptResults } from "@/app/actions/quiz-actions";
import ResultsClient from "@/app/components/results/ResultsClient";

export default async function Page({
  params,
}: {
  params: { attemptId: string };
}) {
  const data = await getTestAttemptResults(params.attemptId);

  if (!data.attempt?.id) {
    throw new Error("Attempt not found");
  }

  // 🔹 FIX 2 happens HERE
  const normalizedData = {
    ...data,
    attempt: {
      id: data.attempt.id, // ✅ guarantee presence
      score: data.attempt.score,
      startedAt: data.attempt.startedAt,
      endedAt: data.attempt.endedAt,
      test: data.attempt.test,
      responses: data.attempt.responses.map((r) => ({
        question: r.question,
        answer: r.answer ?? "",
        isCorrect: r.isCorrect,
        marksAwarded: r.marksAwarded ?? 0,
      })),
    },
  };

  return <ResultsClient {...normalizedData} />;
}
