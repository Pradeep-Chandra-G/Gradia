"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  BarChart3,
  Calendar,
  Target,
  Users,
} from "lucide-react";

interface ResultsPageProps {
  attempt: {
    id: string;
    score: number;
    startedAt: string;
    endedAt: string;
    test: {
      title: string;
      duration: number;
      type: string;
    };
    responses: Array<{
      question: {
        text: string;
        type: string;
        marks: number;
      };
      answer: string;
      isCorrect: boolean | null;
      marksAwarded: number;
    }>;
  };
  classAverage?: number;
  rank?: number;
  totalStudents?: number;
}

export default function ResultsPage({
  attempt,
  classAverage,
  rank,
  totalStudents,
}: ResultsPageProps) {
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false);

  // Calculate statistics
  const totalMarks = attempt.responses.reduce(
    (sum, r) => sum + r.question.marks,
    0,
  );
  const percentage = (attempt.score / totalMarks) * 100;
  const correctAnswers = attempt.responses.filter((r) => r.isCorrect).length;
  const incorrectAnswers = attempt.responses.filter(
    (r) => r.isCorrect === false,
  ).length;
  const unattempted = attempt.responses.filter(
    (r) => r.isCorrect === null,
  ).length;

  // Time taken
  const timeTaken = Math.floor(
    (new Date(attempt.endedAt).getTime() -
      new Date(attempt.startedAt).getTime()) /
      1000 /
      60,
  );

  // Performance status
  const getPerformanceStatus = () => {
    if (percentage >= 90)
      return {
        label: "Excellent",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
      };
    if (percentage >= 75)
      return {
        label: "Good",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
      };
    if (percentage >= 60)
      return {
        label: "Pass",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
      };
    return {
      label: "Needs Improvement",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    };
  };

  const performance = getPerformanceStatus();

  // Download certificate
  const handleDownloadCertificate = () => {
    // TODO: Implement certificate generation
    alert("Certificate download functionality coming soon!");
  };

  // Download detailed report
  const handleDownloadReport = () => {
    // TODO: Implement PDF report generation
    alert("Report download functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="bg-foreground border-b border-white/10 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
              <p className="text-gray-400">{attempt.test.title}</p>
            </div>

            <div className="flex gap-4">
              {percentage >= 60 && (
                <button
                  onClick={handleDownloadCertificate}
                  className="px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 flex items-center gap-2"
                >
                  <Award size={20} />
                  Download Certificate
                </button>
              )}
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 flex items-center gap-2"
              >
                <Download size={20} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Score Card */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Main Score */}
          <div className="col-span-2 bg-gradient-to-br from-primary-button/20 to-primary-button/5 rounded-xl border border-primary-button/30 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300">
                Your Score
              </h2>
              <span
                className={`px-4 py-1 ${performance.bgColor} border ${performance.borderColor} ${performance.color} rounded-full text-sm font-semibold`}
              >
                {performance.label}
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-7xl font-bold text-white">
                {percentage.toFixed(1)}%
              </span>
              <span className="text-3xl text-gray-400">
                {attempt.score}/{totalMarks}
              </span>
            </div>

            {classAverage && (
              <div className="flex items-center gap-2 text-sm">
                {percentage >= classAverage ? (
                  <>
                    <TrendingUp className="text-green-500" size={20} />
                    <span className="text-green-500">
                      {(percentage - classAverage).toFixed(1)}% above class
                      average
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-amber-500" size={20} />
                    <span className="text-amber-500">
                      {(classAverage - percentage).toFixed(1)}% below class
                      average
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <CheckCircle2 className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Correct Answers</p>
                <p className="text-3xl font-bold text-green-500">
                  {correctAnswers}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {((correctAnswers / attempt.responses.length) * 100).toFixed(1)}%
              accuracy
            </p>
          </div>

          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <Clock className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Time Taken</p>
                <p className="text-3xl font-bold text-amber-500">
                  {timeTaken}m
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              of {attempt.test.duration} minutes
            </p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target size={20} className="text-primary-button" />
              Accuracy
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Correct</span>
                  <span className="text-green-500 font-semibold">
                    {correctAnswers}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(correctAnswers / attempt.responses.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Incorrect</span>
                  <span className="text-red-500 font-semibold">
                    {incorrectAnswers}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${(incorrectAnswers / attempt.responses.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {unattempted > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Unattempted</span>
                    <span className="text-gray-500 font-semibold">
                      {unattempted}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600"
                      style={{
                        width: `${(unattempted / attempt.responses.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {rank && totalStudents && (
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users size={20} className="text-primary-button" />
                Class Ranking
              </h3>
              <div className="text-center">
                <p className="text-6xl font-bold text-primary-button mb-2">
                  #{rank}
                </p>
                <p className="text-gray-400">out of {totalStudents} students</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">Class Average</p>
                  <p className="text-2xl font-bold text-gray-300">
                    {classAverage?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-foreground rounded-xl border border-white/10 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary-button" />
              Test Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Test Type:</span>
                <span className="font-semibold capitalize">
                  {attempt.test.type.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Questions:</span>
                <span className="font-semibold">
                  {attempt.responses.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Started At:</span>
                <span className="font-semibold">
                  {new Date(attempt.startedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed At:</span>
                <span className="font-semibold">
                  {new Date(attempt.endedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question-wise Analysis */}
        <div className="bg-foreground rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={24} className="text-primary-button" />
              Question-wise Analysis
            </h3>
            <button
              onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
              className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 text-sm"
            >
              {showDetailedAnswers ? "Hide Answers" : "Show Detailed Answers"}
            </button>
          </div>

          <div className="space-y-4">
            {attempt.responses.map((response, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  response.isCorrect
                    ? "border-green-500/20 bg-green-500/5"
                    : response.isCorrect === false
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-gray-600/20 bg-gray-600/5"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xl font-bold text-gray-400">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="text-lg mb-2">{response.question.text}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          Type: {response.question.type}
                        </span>
                        <span className="text-gray-400">
                          Marks: {response.question.marks}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {response.isCorrect ? (
                      <>
                        <CheckCircle2 className="text-green-500" size={24} />
                        <span className="text-green-500 font-semibold">
                          +{response.marksAwarded}
                        </span>
                      </>
                    ) : response.isCorrect === false ? (
                      <>
                        <XCircle className="text-red-500" size={24} />
                        <span className="text-red-500 font-semibold">0</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">Not Graded</span>
                      </>
                    )}
                  </div>
                </div>

                {showDetailedAnswers && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-2">Your Answer:</p>
                    <p className="text-white bg-white/5 rounded p-3">
                      {response.answer || "No answer provided"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Tips */}
        {percentage < 75 && (
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-500 mb-4">
              💡 Tips for Improvement
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Review the questions you got wrong and understand the correct
                approach
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Practice similar questions to strengthen your weak areas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Consider taking practice tests to improve your timing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Reach out to your instructor for personalized guidance
              </li>
            </ul>
          </div>
        )}

        {percentage >= 90 && (
          <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
            <Award className="text-green-500 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-green-500 mb-2">
              🎉 Excellent Performance!
            </h3>
            <p className="text-gray-300">
              You&apos;ve demonstrated exceptional understanding of the
              material. Keep up the great work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
