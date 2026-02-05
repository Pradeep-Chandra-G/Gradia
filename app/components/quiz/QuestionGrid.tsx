import React from "react";

type QuestionGridProps = {
  count: number;
};

function QuestionGrid({ count }: QuestionGridProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-x-8 gap-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className="h-10 w-10 bg-white/5 rounded-md flex items-center justify-center hover:cursor-pointer"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionGrid;
