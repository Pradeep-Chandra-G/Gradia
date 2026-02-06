import { getTestAttemptResults } from "@/app/actions/quiz-actions";
import ResultsClient from "@/app/components/results/ResultsClient";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getTestAttemptResults(params.id); // Changed from params.attemptId

  if (!data.success || !data.attempt?.id) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Results Not Found</h1>
          <p className="text-gray-400">
            The attempt you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const normalizedData = {
    ...data,
    attempt: {
      id: data.attempt.id,
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
