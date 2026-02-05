"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Eye, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/app/actions/quiz-actions";

type QuestionType =
  | "MCQ"
  | "MSQ"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "SHORT"
  | "CODING";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: string;
  marks: number;
  options: Option[];
  correctAnswer?: string;
}

interface Section {
  id: string;
  name: string;
  questions: Question[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Quiz metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [testType, setTestType] = useState<"PRACTICE" | "EXAM">("EXAM");
  const [passingScore, setPassingScore] = useState(70);
  const [showResults, setShowResults] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);

  // Sections and questions
  const [sections, setSections] = useState<Section[]>([
    {
      id: "section-1",
      name: "Section A",
      questions: [],
    },
  ]);

  const [currentSectionId, setCurrentSectionId] = useState("section-1");

  // Add new section
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: `Section ${String.fromCharCode(65 + sections.length)}`,
      questions: [],
    };
    setSections([...sections, newSection]);
    setCurrentSectionId(newSection.id);
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    if (sections.length === 1) {
      alert("Cannot delete the last section");
      return;
    }
    setSections(sections.filter((s) => s.id !== sectionId));
    if (currentSectionId === sectionId) {
      setCurrentSectionId(sections[0].id);
    }
  };

  // Add question to current section
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      type,
      difficulty: "MEDIUM",
      marks: 1,
      options:
        type === "MCQ" || type === "MSQ"
          ? [
              { id: "opt-1", text: "", isCorrect: false },
              { id: "opt-2", text: "", isCorrect: false },
            ]
          : [],
      correctAnswer: type === "TRUE_FALSE" ? "true" : undefined,
    };

    setSections(
      sections.map((section) =>
        section.id === currentSectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section,
      ),
    );
  };

  // Update question
  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setSections(
      sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q,
        ),
      })),
    );
  };

  // Delete question
  const deleteQuestion = (questionId: string) => {
    setSections(
      sections.map((section) => ({
        ...section,
        questions: section.questions.filter((q) => q.id !== questionId),
      })),
    );
  };

  // Add option to question
  const addOption = (questionId: string) => {
    setSections(
      sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              options: [
                ...q.options,
                {
                  id: `opt-${Date.now()}`,
                  text: "",
                  isCorrect: false,
                },
              ],
            };
          }
          return q;
        }),
      })),
    );
  };

  // Update option
  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<Option>,
  ) => {
    setSections(
      sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt,
              ),
            };
          }
          return q;
        }),
      })),
    );
  };

  // Delete option
  const deleteOption = (questionId: string, optionId: string) => {
    setSections(
      sections.map((section) => ({
        ...section,
        questions: section.questions.map((q) => {
          if (q.id === questionId && q.options.length > 2) {
            return {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
            };
          }
          return q;
        }),
      })),
    );
  };

  // Save quiz
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    const totalQuestions = sections.reduce(
      (sum, section) => sum + section.questions.length,
      0,
    );

    if (totalQuestions === 0) {
      alert("Please add at least one question");
      return;
    }

    setSaving(true);

    try {
      // Transform data for backend
      const quizData = {
        title,
        description,
        type: testType,
        duration,
        sections,
      };

      // Call server action
      const result = await createQuiz(quizData);

      if (result.success) {
        alert("Quiz created successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to create quiz: " + result.error);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("An error occurred while saving the quiz");
    } finally {
      setSaving(false);
    }
  };

  // Get current section
  const currentSection = sections.find((s) => s.id === currentSectionId);
  const totalQuestions = sections.reduce(
    (sum, section) => sum + section.questions.length,
    0,
  );
  const totalMarks = sections.reduce(
    (sum, section) =>
      sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create New Quiz</h1>
              <p className="text-gray-400 text-sm">
                Design and configure your assessment
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-button rounded-lg hover:bg-primary-button/90 flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save Quiz"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Sidebar - Quiz Settings */}
          <div className="space-y-6">
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Quiz Settings</h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter quiz description"
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none resize-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  />
                </div>

                {/* Test Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Test Type
                  </label>
                  <select
                    value={testType}
                    onChange={(e) =>
                      setTestType(e.target.value as "PRACTICE" | "EXAM")
                    }
                    className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  >
                    <option value="PRACTICE">Practice Test</option>
                    <option value="EXAM">Formal Exam</option>
                  </select>
                </div>

                {/* Passing Score */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showResults}
                      onChange={(e) => setShowResults(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      Show results after submission
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={randomizeQuestions}
                      onChange={(e) => setRandomizeQuestions(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Randomize question order</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="bg-foreground rounded-xl border border-white/10 p-6">
              <h3 className="font-bold mb-4">Quiz Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Questions:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Marks:</span>
                  <span className="font-semibold">{totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sections:</span>
                  <span className="font-semibold">{sections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Time:</span>
                  <span className="font-semibold">{duration} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Questions */}
          <div className="col-span-2 space-y-6">
            {/* Section Tabs */}
            <div className="bg-foreground rounded-xl border border-white/10">
              <div className="flex items-center gap-2 p-4 border-b border-white/10 overflow-x-auto">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentSectionId(section.id)}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        currentSectionId === section.id
                          ? "bg-primary-button text-white"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {section.name} ({section.questions.length})
                    </button>
                    {sections.length > 1 && (
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addSection}
                  className="px-4 py-2 border border-dashed border-white/20 rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  + Add Section
                </button>
              </div>

              {/* Add Question Buttons */}
              <div className="p-4 border-b border-white/10">
                <p className="text-sm text-gray-400 mb-3">Add Question Type:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addQuestion("MCQ")}
                    className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 text-sm"
                  >
                    + Single Choice
                  </button>
                  <button
                    onClick={() => addQuestion("MSQ")}
                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/20 text-sm"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => addQuestion("TRUE_FALSE")}
                    className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 text-sm"
                  >
                    + True/False
                  </button>
                  <button
                    onClick={() => addQuestion("SHORT")}
                    className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/20 text-sm"
                  >
                    + Short Answer
                  </button>
                  <button
                    onClick={() => addQuestion("CODING")}
                    className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/20 text-sm"
                  >
                    + Coding
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {currentSection && currentSection.questions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No questions yet</p>
                    <p className="text-sm mt-2">
                      Click a button above to add questions
                    </p>
                  </div>
                ) : (
                  currentSection?.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(updates) =>
                        updateQuestion(question.id, updates)
                      }
                      onDelete={() => deleteQuestion(question.id)}
                      onAddOption={() => addOption(question.id)}
                      onUpdateOption={(optionId, updates) =>
                        updateOption(question.id, optionId, updates)
                      }
                      onDeleteOption={(optionId) =>
                        deleteOption(question.id, optionId)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Question Card Component
interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onAddOption: () => void;
  onUpdateOption: (optionId: string, updates: Partial<Option>) => void;
  onDeleteOption: (optionId: string) => void;
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}: QuestionCardProps) {
  const getTypeColor = (type: QuestionType) => {
    const colors = {
      MCQ: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      MSQ: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      TRUE_FALSE: "bg-green-500/10 text-green-400 border-green-500/20",
      SHORT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      CODING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      FILL_BLANK: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    };
    return colors[type];
  };

  const getTypeLabel = (type: QuestionType) => {
    const labels = {
      MCQ: "Single Choice",
      MSQ: "Multiple Choice",
      TRUE_FALSE: "True/False",
      SHORT: "Short Answer",
      CODING: "Coding",
      FILL_BLANK: "Fill in Blank",
    };
    return labels[type];
  };

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-400">{index + 1}.</span>
          <span
            className={`px-3 py-1 rounded-full text-xs border ${getTypeColor(question.type)}`}
          >
            {getTypeLabel(question.type)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={question.difficulty}
            onChange={(e) => onUpdate({ difficulty: e.target.value })}
            className="px-3 py-1 bg-background border border-white/20 rounded text-sm"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <input
            type="number"
            value={question.marks}
            onChange={(e) => onUpdate({ marks: Number(e.target.value) })}
            min="0.5"
            step="0.5"
            className="w-16 px-2 py-1 bg-background border border-white/20 rounded text-sm text-center"
          />
          <span className="text-sm text-gray-400">marks</span>

          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/20 rounded"
          >
            <Trash2 size={18} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <textarea
        value={question.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter your question here..."
        rows={2}
        className="w-full px-4 py-2 bg-background border border-white/20 rounded-lg focus:border-primary-button focus:outline-none mb-4 resize-none"
      />

      {/* Options for MCQ/MSQ */}
      {(question.type === "MCQ" || question.type === "MSQ") && (
        <div className="space-y-2">
          {question.options.map((option, optIndex) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type={question.type === "MCQ" ? "radio" : "checkbox"}
                checked={option.isCorrect}
                onChange={(e) => {
                  if (question.type === "MCQ") {
                    // For MCQ, uncheck all others
                    question.options.forEach((opt) => {
                      onUpdateOption(opt.id, {
                        isCorrect: opt.id === option.id,
                      });
                    });
                  } else {
                    onUpdateOption(option.id, { isCorrect: e.target.checked });
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-gray-400 w-6">
                {String.fromCharCode(65 + optIndex)}.
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  onUpdateOption(option.id, { text: e.target.value })
                }
                placeholder="Enter option text"
                className="flex-1 px-3 py-2 bg-background border border-white/20 rounded focus:border-primary-button focus:outline-none text-sm"
              />
              {question.options.length > 2 && (
                <button
                  onClick={() => onDeleteOption(option.id)}
                  className="p-1 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={onAddOption}
            className="text-sm text-primary-button hover:underline"
          >
            + Add Option
          </button>
        </div>
      )}

      {/* True/False */}
      {question.type === "TRUE_FALSE" && (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={question.correctAnswer === "true"}
              onChange={() => onUpdate({ correctAnswer: "true" })}
              className="w-4 h-4"
            />
            <span>True</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={question.correctAnswer === "false"}
              onChange={() => onUpdate({ correctAnswer: "false" })}
              className="w-4 h-4"
            />
            <span>False</span>
          </label>
        </div>
      )}

      {/* Short Answer */}
      {question.type === "SHORT" && (
        <div>
          <input
            type="text"
            value={question.correctAnswer || ""}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Expected answer (for reference)"
            className="w-full px-3 py-2 bg-background border border-white/20 rounded focus:border-primary-button focus:outline-none text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be manually graded
          </p>
        </div>
      )}

      {/* Coding Question */}
      {question.type === "CODING" && (
        <div className="space-y-2">
          <select
            className="w-full px-3 py-2 bg-background border border-white/20 rounded text-sm"
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
          >
            <option value="">Select Programming Language</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
          <textarea
            placeholder="Enter boilerplate code (optional)"
            rows={4}
            className="w-full px-3 py-2 bg-background border border-white/20 rounded focus:border-primary-button focus:outline-none text-sm font-mono resize-none"
          />
        </div>
      )}
    </div>
  );
}
