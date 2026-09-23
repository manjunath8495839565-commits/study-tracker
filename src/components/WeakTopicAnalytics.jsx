import React from "react";
import { AlertOctagon, Flame, Target, Award, CheckCircle2, RotateCcw, CheckSquare, Square } from "lucide-react";
import { getWeakTasksList, computeOverallStats } from "../utils/timelineMath";

export const WeakTopicAnalytics = ({
  studyPlan,
  onToggleTask,
  onToggleTaskRevisionStatus
}) => {
  const weakTasks = getWeakTasksList(studyPlan);
  const stats = computeOverallStats(studyPlan);

  return (
    <div className="py-8 border-t border-brown-200 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brown-950 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <span>Weak Topics & Revision Analytics</span>
            </h2>
            <p className="text-xs text-brown-700 font-medium mt-0.5">
              Tracks all tasks flagged as 'Needs Revision' across your GATE {studyPlan?.targetYear} study plan
            </p>
          </div>

          <div className="flex items-center gap-3 bg-brown-50 border border-brown-300 px-4 py-2.5 rounded-2xl shadow-xs self-start md:self-auto">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-300">
              <Flame className="w-6 h-6 text-amber-700 animate-bounce" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-brown-700 uppercase tracking-wider">
                Current Study Streak
              </div>
              <div className="text-lg font-black text-brown-950 flex items-center gap-1">
                {studyPlan?.streakData?.currentStreak || 1} <span className="text-xs font-semibold text-brown-700">Days Active 🔥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-brown-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brown-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-extrabold text-brown-950">
                  Flagged Revision Tasks
                </h3>
              </div>
              <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {weakTasks.length} Flagged
              </span>
            </div>

            {weakTasks.length === 0 ? (
              <div className="p-8 text-center bg-brown-50/60 rounded-xl text-brown-700 text-sm space-y-2 border border-brown-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-brown-950">No Tasks Currently Flagged for Revision!</p>
                <p className="text-xs text-brown-600 font-medium max-w-sm mx-auto">
                  Click 'Flag Revision' on any task in the Syllabus breakdown tab to queue it here for revision drills.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {weakTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs ${
                      task.completed ? "opacity-60 line-through" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="text-rose-700 hover:text-rose-900 cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Square className="w-5 h-5 text-rose-400 hover:text-rose-700" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-rose-900">
                          {task.subjectName}
                        </div>
                        <div className="text-sm font-extrabold text-brown-950 mt-0.5 truncate">
                          {task.label}
                        </div>
                        <p className="text-[11px] text-brown-600 font-medium">
                          Scheduled: {new Date(task.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTaskRevisionStatus(task.id)}
                      className="px-2 py-1 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-extrabold shrink-0 cursor-pointer shadow-2xs transition-colors"
                      title="Clear revision flag"
                    >
                      Resolved ✓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-white border border-brown-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brown-200 pb-3">
              <h3 className="text-base font-extrabold text-brown-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-brown-800" />
                <span>Overall Study Metrics</span>
              </h3>
              <span className="text-xs text-brown-700 font-bold">Live studyPlan Data</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-brown-50/70 border border-brown-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-brown-700">Topics Completed</span>
                <div className="text-2xl font-black text-brown-950">{stats.topicsDone} / {stats.totalTopics}</div>
              </div>

              <div className="p-4 bg-brown-50/70 border border-brown-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-brown-700">Overall Progress</span>
                <div className="text-2xl font-black text-brown-950">{stats.overallPercentage}%</div>
              </div>

              <div className="p-4 bg-brown-50/70 border border-brown-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-brown-700">Questions Practiced</span>
                <div className="text-2xl font-black text-brown-950">{stats.totalQuestionsPracticed}</div>
              </div>

              <div className="p-4 bg-brown-50/70 border border-brown-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-brown-700">Study Hours</span>
                <div className="text-2xl font-black text-brown-950">{stats.totalStudyHours} hrs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
