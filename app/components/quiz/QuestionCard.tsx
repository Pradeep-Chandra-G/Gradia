import React from "react";
import { Question } from "@/lib/types";
import { Flag } from "lucide-react";

type QuestionCardProps = {
  questionData: Question;
};

function QuestionCard({ questionData }: QuestionCardProps) {
  return (
    <div className="flex-1 bg-quiz-background overflow-y-auto rounded-2xl font-sans border border-white/10">
      <div className="p-8 flex flex-col gap-8">
        {/* QUESTION NUMBER */}
        <div className="flex flex-row items-center justify-between">
          <div className="px-2 py-1 bg-primary-button/13 text-primary-button tracking-wide font-semibold rounded-md">
            Question {1}
          </div>

          <button className="flex flex-row items-center text-gray-400 font-semibold gap-2 hover:cursor-pointer">
            <Flag className="fill-gray-400" />
            Report Issue
          </button>
        </div>

        {/* QUESTION TEXT */}
        <label className="text-2xl leading-relaxed break-all max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-white/20 overflow-x-hidden">
          {questionData.question}
        </label>

        {/* OPTIONS */}
        {questionData.question_type === "multiple_choice" && (
          <div className="flex flex-col gap-3">
            {questionData.options?.map((option, index) => (
              <div
                key={index}
                className="bg-amber-600 text-black px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400"
              >
                <h1>{option}</h1>
              </div>
            ))}
          </div>
        )}

        {questionData.question_type === "single_choice" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-gray-400">Choose a single option</h1>
            {questionData.options?.map((option, index) => (
              <div
                key={index}
                className="p-4 rounded-lg cursor-pointer hover:bg-gray-400/5 border-2 border-gray-600 flex flex-row items-center gap-4"
              >
                <p className="flex flex-col items-center justify-center size-4 rounded-full bg-primary-button">
                  <span className="size-2 rounded-full bg-quiz-background"></span>
                </p>
                <h1>{option}</h1>
              </div>
            ))}
          </div>
        )}

        {questionData.question_type === "true_false" && (
          <div className="flex flex-col gap-3">
            <h1 className="text-gray-400">True or False</h1>

            <div className="p-4 rounded-lg cursor-pointer hover:bg-gray-400/5 border-2 border-gray-600 flex flex-row items-center gap-4">
              <p className="flex flex-col items-center justify-center size-4 rounded-full bg-primary-button">
                <span className="size-2 rounded-full bg-quiz-background"></span>
              </p>
              <h1>True</h1>
            </div>

            <div className="p-4 rounded-lg cursor-pointer hover:bg-gray-400/5 border-2 border-gray-600 flex flex-row items-center gap-4">
              <p className="flex flex-col items-center justify-center size-4 rounded-full bg-primary-button">
                <span className="size-2 rounded-full bg-quiz-background"></span>
              </p>
              <h1>False</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionCard;
