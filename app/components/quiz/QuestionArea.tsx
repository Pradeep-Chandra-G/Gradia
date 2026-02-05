import React from "react";
import { QuizData } from "@/lib/types";
import QuestionCard from "./QuestionCard";
import { ArrowLeft, ArrowRight, Bookmark } from "lucide-react";

// quiz_id: string;
//   quiz_title: string;
//   count: number; // total number of questions
//   time_limit: number; // in seconds or minutes (your call)
//   questions: Question[];

type QuestionAreaProps = {
  quizData: QuizData[];
};

function QuestionArea({ quizData }: QuestionAreaProps) {
  return (
    <div className="flex flex-col h-full gap-8">
      <QuestionCard questionData={quizData[0].questions[1]} />

      <div className="flex flex-col p-4 rounded-2xl bg-quiz-background border border-white/10 font-sans">
        <div className="flex flex-row justify-between items-center px-4">
          <div className="flex flex-row items-center gap-2">
            <button className="flex flex-row gap-2 border border-white/20 hover:cursor-pointer rounded-md px-4 py-2 items-center">
              <ArrowLeft size={20} /> Previous
            </button>
            <button className="flex flex-row gap-2 border bg-amber-400/5 text-amber-400 border-amber-600/20 hover:cursor-pointer rounded-md px-4 py-2 items-center">
              <Bookmark size={20} className="fill-amber-400" /> Mark for review
            </button>
          </div>

          <button className="flex flex-row gap-2 text-white bg-primary-button font-semibold hover:cursor-pointer rounded-md px-6 py-2 items-center">
            Save & Next <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionArea;
