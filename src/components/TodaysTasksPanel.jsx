import React, { useState } from "react";
import { CheckSquare, Square, Calendar, Plus, Zap, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { getTodaysTasksList } from "../utils/timelineMath";

export const TodaysTasksPanel = ({
  syllabus,
  customTasks,
  onToggleTask,
  onToggleMasterTask,
  onAddCustomTask,
  onToggleCustomTask
}) => {
  const [newCustomTaskLabel, setNewCustomTaskLabel] = useState("");

  const todaysTasks = getTodaysTasksList(syllabus, customTasks);
  const completedToday = todaysTasks.filter(t => t.completed).length;

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newCustomTaskLabel.trim()) return;
    onAddCustomTask(newCustomTaskLabel.trim());
    setNewCustomTaskLabel("");
  };

  return (
    <div className="py-6 border-t border-slate-800 bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Today's Priority Focus Tasks
              </h2>
              <p className="text-xs text-slate-400">
                Pinned queue for immediate study • {completedToday} of {todaysTasks.length} completed
              </p>
            </div>
          </div>

          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium border border-slate-700 self-start sm:self-auto">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Task Box Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          
          {/* Quick Add Custom Focus Task Form */}
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a custom focus task (e.g., General Aptitude 15-min speed drill)..."
              value={newCustomTaskLabel}
              onChange={(e) => setNewCustomTaskLabel(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </form>

          {/* List of Today's Tasks */}
          {todaysTasks.length === 0 ? (
            <div className="p-6 text-center bg-slate-950/60 rounded-xl text-slate-400 text-sm">
              🎉 No pending focus tasks left for today! All current module targets completed.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {todaysTasks.map((task, idx) => {
                const isOverdue = !task.completed && !task.isCurrentMonth && !task.isCustom;

                return (
                  <div
                    key={task.id || idx}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? "bg-slate-950/40 border-slate-850 opacity-70"
                        : isOverdue
                        ? "bg-rose-950/20 border-rose-800/50 shadow-sm"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => {
                          if (task.isCustom) {
                            onToggleCustomTask(task.id);
                          } else if (task.isMaster) {
                            onToggleMasterTask(task.subjectId, task.id);
                          } else {
                            onToggleTask(task.subjectId, task.topicId, task.id);
                          }
                        }}
                        className="cursor-pointer text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="truncate space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${
                            task.completed ? "line-through text-slate-500" : "text-slate-100"
                          }`}>
                            {task.label}
                          </span>
                          {isOverdue && (
                            <span className="bg-rose-900/60 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-700/50 shrink-0 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" /> Overdue
                            </span>
                          )}
                        </div>

                        {!task.isCustom && (
                          <div className="text-xs text-slate-400 truncate">
                            <strong className="text-slate-300">{task.subjectName}</strong> • {task.topicName}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium shrink-0 ${
                      task.type === "reading" ? "bg-blue-950 text-blue-300" :
                      task.type === "solving" || task.type === "pyq" ? "bg-indigo-950 text-indigo-300" :
                      task.type === "revision" ? "bg-amber-950 text-amber-300" :
                      "bg-slate-800 text-slate-300"
                    }`}>
                      {task.type ? task.type.toUpperCase() : "TASK"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
