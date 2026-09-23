import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Calendar, Plus, Zap, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getTodaysTasksList, getOngoingSubject } from "../utils/timelineMath";

export const TodaysTasksPanel = ({
  studyPlan,
  onToggleTask,
  onAddCustomTask,
  onToggleCustomTask
}) => {
  const [newCustomTaskLabel, setNewCustomTaskLabel] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todaysTasks = getTodaysTasksList(studyPlan, studyPlan?.customTasks || []);
  const ongoing = getOngoingSubject(studyPlan);
  const completedCount = todaysTasks.filter(t => t.completed).length;

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newCustomTaskLabel.trim()) return;
    onAddCustomTask(newCustomTaskLabel.trim());
    setNewCustomTaskLabel("");
  };

  return (
    <div className="py-6 border-t border-brown-200 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 bg-amber-100 rounded-lg border border-amber-300">
              <Zap className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-brown-950 flex items-center gap-2">
                  Today's Priority Focus Tasks
                </h2>
                {ongoing && (
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    🎯 Ongoing: {ongoing.subjectName} (Due: {ongoing.targetMonth})
                  </span>
                )}
              </div>
              <p className="text-xs text-brown-700 font-medium mt-0.5">
                Sequential daily focus derived strictly from studyPlan engine • {completedCount} of {todaysTasks.length} completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-brown-50 text-brown-950 px-3 py-1.5 rounded-xl text-xs font-extrabold border border-brown-300 self-start sm:self-auto shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-brown-400">•</span>
            <span>{now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="bg-white border border-brown-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a custom focus task (e.g., General Aptitude 15-min speed drill)..."
              value={newCustomTaskLabel}
              onChange={(e) => setNewCustomTaskLabel(e.target.value)}
              className="flex-1 bg-brown-50/70 border border-brown-300 rounded-xl px-4 py-2.5 text-sm text-brown-950 placeholder-brown-400 focus:outline-none focus:border-brown-600 focus:ring-1 focus:ring-brown-600 font-medium"
            />
            <button
              type="submit"
              className="bg-brown-900 hover:bg-brown-950 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </form>

          {todaysTasks.length === 0 ? (
            <div className="text-center py-8 text-brown-600 font-medium">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p>All priority tasks for today are completed! Great job keeping up your pace.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todaysTasks.map((task) => {
                const isCustom = task.isCustom;
                const formattedTaskDate = task.date ? new Date(task.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      task.completed
                        ? "bg-amber-50/40 border-amber-200/60 text-brown-600 line-through"
                        : "bg-white border-brown-200 text-brown-950 hover:border-brown-300 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => {
                          if (isCustom) {
                            onToggleCustomTask(task.id);
                          } else {
                            onToggleTask(task.id);
                          }
                        }}
                        className="text-brown-700 hover:text-brown-900 cursor-pointer shrink-0 transition-colors"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-amber-700 fill-amber-100" />
                        ) : (
                          <Square className="w-5 h-5 text-brown-400 hover:text-brown-700" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm truncate">
                            {task.label || task.topicName}
                          </span>

                          {!isCustom && (
                            <span className="bg-brown-100 text-brown-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-brown-200">
                              {task.subjectName}
                            </span>
                          )}

                          {!isCustom && formattedTaskDate && (
                            <span className="bg-white text-brown-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-brown-300">
                              📅 {formattedTaskDate}
                            </span>
                          )}

                          {isCustom && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-200">
                              Custom Focus
                            </span>
                          )}
                        </div>

                        {!isCustom && task.topicName && (
                          <p className="text-xs text-brown-600 font-medium truncate mt-0.5">
                            Topic: {task.topicName} ({task.type.toUpperCase()})
                          </p>
                        )}
                      </div>
                    </div>

                    {task.completedAt && (
                      <span className="text-[11px] text-brown-500 font-medium shrink-0 ml-2">
                        {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
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
