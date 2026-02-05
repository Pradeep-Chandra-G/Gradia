import React from "react";
import { QuizData } from "@/lib/types";
import QuizNavbar from "@/app/components/quiz/Navbar";
import QuizSidebar from "@/app/components/quiz/Sidebar";
import QuestionArea from "@/app/components/quiz/QuestionArea";

function QuizPage() {
  const data: QuizData[] = [
    {
      quiz_id: "quiz_001",
      quiz_title: "JavaScript Basics",
      count: 5,
      time_limit: 900,
      questions: [
        {
          question: "Which keyword declares a constant?",
          options: ["var", "let", "const"],
          question_type: "single_choice",
        },
        {
          question: "JavaScript is dynamically typed.",
          question_type: "true_false",
        },
        {
          question: "Which of the following are JavaScript data types?",
          options: ["String", "Boolean", "Number", "Character"],
          question_type: "multiple_choice",
        },
        {
          question: "What does `NaN` stand for in JavaScript?",
          question_type: "short_answer",
        },
        {
          question:
            "Which method converts a JSON string into a JavaScript object?",
          options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.object()",
          ],
          question_type: "single_choice",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <QuizNavbar />
      <div className="flex flex-1 flex-row">
        {/* SIDEBAR */}
        <div className="w-1/4">
          <QuizSidebar />
        </div>

        {/* QUESTION AREA */}
        <div className="flex-1 p-6 flex flex-col">
          {/* QUESTION CARDS */}
          <QuestionArea quizData={data} />
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
