// app/(protected)/quiz/take/[id]/page.tsx
import { getQuiz, startTestAttempt } from "@/app/actions/quiz-actions";
import QuizTakingClient from "@/app/components/quiz/QuizTakingClient";
import { redirect } from "next/navigation";

export default async function QuizTakePage({
  params,
}: {
  params: { id: string };
}) {
  const quizResult = await getQuiz(params.id);

  if (!quizResult.success || !quizResult.test) {
    redirect("/dashboard");
  }

  // Start a new attempt
  const attemptResult = await startTestAttempt(params.id);

  if (!attemptResult) {
    redirect("/");
  }
  if (!attemptResult.success) {
    redirect("/dashboard");
  }

  // Transform data for client
  const quizData = {
    id: quizResult.test.id,
    title: quizResult.test.title,
    description: quizResult.test.description || "",
    duration: quizResult.test.duration || 60,
    questions: quizResult.test.sections.flatMap((section) =>
      section.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        marks: q.marks,
        options: q.options,
      })),
    ),
  };

  return (
    <QuizTakingClient quizData={quizData} attemptId={attemptResult.attemptId} />
  );
}
