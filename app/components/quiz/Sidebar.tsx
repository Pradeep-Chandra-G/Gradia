import React from "react";
import QuestionGrid from "./QuestionGrid";

function QuizSidebar() {
  const section = "A";
  const questionCount = 30;
  return (
    <div className="flex flex-col h-full w-full border-r border-gray-500  font-sans">
      {/* QUESTION TITLE */}
      <div className="w-full border-b border-gray-500 p-4">
        <h1 className="text-gray-400 tracking-wide font-semibold text-lg">
          QUESTION PALETTE
        </h1>
        <div className="flex flex-row items-center justify-between">
          <p className="text-md font-semibold tracking-wide">
            Section {section}
          </p>
          <p className="py-0.5 px-2 bg-gray-500/25 text-white/50 text-sm rounded-md">
            {questionCount} Questions
          </p>
        </div>
      </div>

      {/* QUESTION STATUS INDICATORS */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-500">
        <div className="flex flex-row items-center gap-4">
          <p className="size-3 rounded-full bg-green-500"></p>
          <p className="text-gray-400/80">Answered</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="size-3 rounded-full bg-amber-500"></p>
          <p className="text-gray-400/80">Flagged</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="size-3 rounded-full bg-gray-500"></p>
          <p className="text-gray-400/80">Not Visited</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="size-3 rounded-full bg-primary-button flex items-center justify-center">
            <span className="size-2 rounded-full bg-quiz-background"></span>
          </p>
          <p className="text-gray-400/80">Current</p>
        </div>
      </div>

      {/* QUESTIONS GRID */}
      <div className="p-4">
        <QuestionGrid count={30} />
      </div>
    </div>
  );
}

export default QuizSidebar;
