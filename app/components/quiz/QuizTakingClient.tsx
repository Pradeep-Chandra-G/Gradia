"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Flag,
  Clock,
  AlertCircle,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import {
  submitQuestionResponse,
  endTestAttempt,
} from "@/app/actions/quiz-actions";

interface Question {
  id: string;
  text: string;
  type: string;
  marks: number;
  options?: Array<{
    id: string;
    text: string;
  }>;
}

interface QuizTakingProps {
  quizData: {
    id: string;
    title: string;
    description: string;
    duration: number;
    questions: Question[];
  };
  attemptId: string;
}

export default function QuizTakingClient({
  quizData,
  attemptId,
}: QuizTakingProps) {
  const router = useRouter();

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(quizData.duration * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "error"
  >("saved");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleAutoSubmit();
          return 0;
        }

        // Warning at 5 minutes
        if (prev === 300) {
          alert("⚠️ 5 minutes remaining!");
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab switch detection (anti-cheating)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setShowWarning(true);

        // Auto-submit after 3 tab switches
        if (tabSwitches >= 2) {
          alert(
            "⚠️ Multiple tab switches detected. Quiz will be auto-submitted.",
          );
          handleAutoSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitches]);

  // Prevent copy-paste
  useEffect(() => {
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("Copy-paste is disabled during the quiz");
    };

    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);

    return () => {
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
    };
  }, []);

  // Auto-save answers
  useEffect(() => {
    const autoSave = async () => {
      if (Object.keys(answers).length === 0) return;

      setAutoSaveStatus("saving");

      try {
        // Save all answers to backend
        for (const [questionId, answer] of Object.entries(answers)) {
          await submitQuestionResponse(
            attemptId,
            questionId,
            JSON.stringify(answer),
          );
        }
        setAutoSaveStatus("saved");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setAutoSaveStatus("error");
      }
    };

    const debounceTimer = setTimeout(autoSave, 3000);

    return () => clearTimeout(debounceTimer);
  }, [answers, attemptId]);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  // Get timer color
  const getTimerColor = () => {
    if (timeLeft <= 300) return "text-red-500"; // Last 5 minutes
    if (timeLeft <= 600) return "text-amber-500"; // Last 10 minutes
    return "text-green-500";
  };

  // Navigation handlers
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisited((prev) => new Set([...prev, index]));
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  // Answer handlers
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestionIndex)) {
        newFlagged.delete(currentQuestionIndex);
      } else {
        newFlagged.add(currentQuestionIndex);
      }
      return newFlagged;
    });
  };

  // Submit handlers
  const handleAutoSubmit = async () => {
    await handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (
      !isAuto &&
      !confirm(
        "Are you sure you want to submit the quiz? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Final save of all answers
      for (const [questionId, answer] of Object.entries(answers)) {
        await submitQuestionResponse(
          attemptId,
          questionId,
          JSON.stringify(answer),
        );
      }

      // End the test attempt
      const result = await endTestAttempt(attemptId);

      if (result.success) {
        // Navigate to results page with correct route
        router.push(`/results/${attemptId}`); // Changed from /results/${attemptId} if it was different
      } else {
        alert("Failed to submit quiz: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting the quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Question status
  const getQuestionStatus = (index: number) => {
    if (answers[quizData.questions[index].id]) {
      return "answered";
    } else if (visited.has(index)) {
      return "visited";
    } else {
      return "not-visited";
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      answered: "bg-green-500",
      visited: "bg-white/20",
      "not-visited": "bg-gray-700",
      current: "bg-primary-button",
      flagged: "bg-amber-500",
    };
    return colors[status as keyof typeof colors] || colors["not-visited"];
  };

  // Stats
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const notVisitedCount = totalQuestions - visited.size;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Header */}
      <header className="bg-foreground border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary-button/10 p-2 rounded-lg">
              <CheckCircle2 className="text-primary-button" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{quizData.title}</h1>
              <p className="text-sm text-gray-400">{quizData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock className={getTimerColor()} size={20} />
              <span
                className={`text-xl font-mono font-bold ${getTimerColor()}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === "saving" && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                  <span className="text-gray-400">Saving...</span>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-green-500">Saved</span>
                </>
              )}
              {autoSaveStatus === "error" && (
                <>
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-red-500">Save failed</span>
                </>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500/10 border border-red-600/20 text-red-500 rounded-lg hover:bg-red-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <LogOut size={20} />
              Submit Exam
            </button>
          </div>
        </div>

        {/* Warning banner */}
        {showWarning && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <div>
              <p className="text-red-500 font-semibold">
                Warning: Tab Switch Detected
              </p>
              <p className="text-sm text-gray-400">
                You have switched tabs {tabSwitches} time(s). After 3 switches,
                your quiz will be auto-submitted.
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="ml-auto text-red-500 hover:text-red-400"
            >
              Dismiss
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Question Palette */}
        <div className="w-80 bg-foreground border-r border-white/10 p-6">
          <h2 className="text-lg font-bold mb-4">Question Palette</h2>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-500 font-bold text-2xl">
                {answeredCount}
              </p>
              <p className="text-gray-400">Answered</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-amber-500 font-bold text-2xl">
                {flaggedCount}
              </p>
              <p className="text-gray-400">Flagged</p>
            </div>
            <div className="bg-gray-700/50 border border-gray-600/20 rounded-lg p-3">
              <p className="text-gray-300 font-bold text-2xl">
                {notVisitedCount}
              </p>
              <p className="text-gray-400">Not Visited</p>
            </div>
            <div className="bg-primary-button/10 border border-primary-button/20 rounded-lg p-3">
              <p className="text-primary-button font-bold text-2xl">
                {totalQuestions}
              </p>
              <p className="text-gray-400">Total</p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-400">Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
              <span className="text-gray-400">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              <span className="text-gray-400">Not Visited</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2">
            {quizData.questions.map((_, index) => {
              const status = getQuestionStatus(index);
              const isCurrent = index === currentQuestionIndex;
              const isFlagged = flagged.has(index);

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`h-10 rounded-lg font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-primary-button ring-2 ring-primary-button/50"
                      : isFlagged
                        ? "bg-amber-500"
                        : getStatusColor(status)
                  } hover:scale-105`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content - Question Area */}
        <div className="flex-1 flex flex-col">
          {/* Question Display */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-400">
                    Q{currentQuestionIndex + 1}.
                  </span>
                  <span className="px-3 py-1 bg-primary-button/10 border border-primary-button/20 text-primary-button rounded-full text-sm">
                    {currentQuestion.marks}{" "}
                    {currentQuestion.marks === 1 ? "mark" : "marks"}
                  </span>
                </div>

                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    flagged.has(currentQuestionIndex)
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Flag
                    size={18}
                    className={
                      flagged.has(currentQuestionIndex) ? "fill-amber-400" : ""
                    }
                  />
                  {flagged.has(currentQuestionIndex)
                    ? "Flagged"
                    : "Flag for Review"}
                </button>
              </div>

              {/* Question Text */}
              <div className="bg-foreground rounded-xl border border-white/10 p-8 mb-6">
                <p className="text-xl leading-relaxed mb-6">
                  {currentQuestion.text}
                </p>

                {/* Answer Area */}
                <div className="space-y-3">
                  {currentQuestion.type === "MCQ" && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option, index) => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            answers[currentQuestion.id] === option.id
                              ? "border-primary-button bg-primary-button/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option.id}
                            checked={answers[currentQuestion.id] === option.id}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="w-5 h-5"
                          />
                          <span className="text-gray-400 font-semibold">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="flex-1">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "MSQ" && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option, index) => {
                        const selectedOptions =
                          answers[currentQuestion.id] || [];
                        const isChecked = selectedOptions.includes(option.id);

                        return (
                          <label
                            key={option.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isChecked
                                ? "border-primary-button bg-primary-button/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newSelected = e.target.checked
                                  ? [...selectedOptions, option.id]
                                  : selectedOptions.filter(
                                      (id: string) => id !== option.id,
                                    );
                                handleAnswerChange(newSelected);
                              }}
                              className="w-5 h-5"
                            />
                            <span className="text-gray-400 font-semibold">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="flex-1">{option.text}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.type === "TRUE_FALSE" && (
                    <div className="flex gap-4">
                      <label
                        className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[currentQuestion.id] === "true"
                            ? "border-primary-button bg-primary-button/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value="true"
                          checked={answers[currentQuestion.id] === "true"}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          className="w-5 h-5"
                        />
                        <span className="text-xl font-semibold">True</span>
                      </label>

                      <label
                        className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[currentQuestion.id] === "false"
                            ? "border-primary-button bg-primary-button/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value="false"
                          checked={answers[currentQuestion.id] === "false"}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          className="w-5 h-5"
                        />
                        <span className="text-xl font-semibold">False</span>
                      </label>
                    </div>
                  )}

                  {currentQuestion.type === "SHORT" && (
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none resize-none"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-white/10 bg-foreground p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
                <div className="w-48 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-button transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="px-6 py-3 bg-primary-button rounded-lg hover:bg-primary-button/90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-foreground rounded-xl border border-white/10 p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Submit Quiz?</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to submit? You have:
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Answered:</span>
                <span className="font-semibold text-green-500">
                  {answeredCount} / {totalQuestions}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Flagged for review:</span>
                <span className="font-semibold text-amber-500">
                  {flaggedCount}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Not answered:</span>
                <span className="font-semibold text-red-500">
                  {totalQuestions - answeredCount}
                </span>
              </li>
            </ul>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
