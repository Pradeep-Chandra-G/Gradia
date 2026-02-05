import { GraduationCap, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function QuizNavbar() {
  const quizName = "Mid-Term Assignment";
  const quizSubject = "Science * Biology 101";
  const userName = "Pradeep Chandra Gajendra";
  const userId = 90210;

  return (
    <div className="font-sans">
      <nav className="flex flex-row items-center justify-between w-full p-4 border-b border-gray-500">
        {/* QUIZ TITLE */}
        <div className="flex flex-row gap-4 items-center">
          <div className="px-2 bg-primary-button/5 text-primary-button rounded-md">
            <GraduationCap size={26} />
          </div>
          <div>
            <h1 className="text-md font-semibold">{quizName}</h1>
            <p className="text-gray-500 text-sm">{quizSubject}</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-8">
          {/* STATUS INDICATOR */}
          <div className="flex flex-row items-center gap-2 ">
            <p className="bg-green-400 animate-pulse size-2 rounded-full"></p>
            <p className="text-green-400 text-sm">Online</p>
          </div>

          {/* VERTICAL DIVIDER */}
          <div className="bg-gray-500 h-12 w-px"></div>

          {/* AVATAR */}
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col">
                <h1 className="text-sm">{userName}</h1>
                <p className="text-gray-500 text-xs">ID: {userId}</p>
              </div>

              <Image
                src="/pradeep.webp"
                alt="alt"
                width={24}
                height={24}
                className="rounded-full size-8 border border-gray-500"
              />
            </div>

            <Link
              href="/submit-quiz"
              className="flex flex-row gap-2 px-4 py-2 bg-red-500/6 rounded-md border border-red-600/20 text-red-500"
            >
              Submit Exam <LogOut />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default QuizNavbar;
