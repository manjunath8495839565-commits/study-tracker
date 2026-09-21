import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Calendar, Plus, Zap, AlertCircle, Clock, CheckCircle2, Bell, MessageSquare, Smartphone, Send, Sparkles } from "lucide-react";
import { getTodaysTasksList } from "../utils/timelineMath";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTaskNotification,
  generateSmsDraftUrl,
  isNotificationSupported
} from "../utils/notifications";

export const TodaysTasksPanel = ({
  syllabus,
  customTasks,
  onToggleTask,
  onToggleMasterTask,
  onAddCustomTask,
  onToggleCustomTask
}) => {
  const [newCustomTaskLabel, setNewCustomTaskLabel] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [notifPermission, setNotifPermission] = useState(() => getNotificationPermission());
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todaysTasks = getTodaysTasksList(syllabus, customTasks);
  const incompleteTasks = todaysTasks.filter(t => !t.completed);
  const completedToday = todaysTasks.filter(t => t.completed).length;

  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotifPermission(permission);
    if (permission === "granted") {
      sendTaskNotification(incompleteTasks.length > 0 ? incompleteTasks : [{ text: "All GATE 2028 tasks completed today!" }]);
    }
  };

  const handleTestNotification = () => {
    sendTaskNotification(incompleteTasks.length > 0 ? incompleteTasks : [{ text: "Example: Operating Systems (Process Synchronization)" }]);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const smsUrl = generateSmsDraftUrl(incompleteTasks);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newCustomTaskLabel.trim()) return;
    onAddCustomTask(newCustomTaskLabel.trim());
    setNewCustomTaskLabel("");
  };

  const ongoingTask = todaysTasks.find(t => !t.isCustom);

  return (
    <div className="py-6 border-t border-brown-200 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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
                {ongoingTask && (
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    🎯 Ongoing: {ongoingTask.subjectName} ({ongoingTask.targetMonth})
                  </span>
                )}
              </div>
              <p className="text-xs text-brown-700 font-medium mt-0.5">
                Sequential daily focus derived strictly from current ongoing subject date • {completedToday} of {todaysTasks.length} completed
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

        {/* Task Box Container */}
        <div className="bg-white border border-brown-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* 5:00 PM SMS & MOBILE NOTIFICATION REMINDER BAR */}
          <div className="bg-gradient-to-r from-brown-900 via-espresso-900 to-brown-950 text-amber-100 rounded-xl p-3.5 sm:p-4 shadow-sm border border-brown-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-300 shrink-0">
                <Bell className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm text-amber-200">5:00 PM Daily Task Reminder & SMS Alert</h4>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-400/30">
                    AUTOMATIC EVENING 5 PM
                  </span>
                </div>
                <p className="text-xs text-amber-100/80 font-medium mt-0.5">
                  Get daily mobile notifications & SMS text updates for today's incomplete priority tasks at 5:00 PM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              {/* SMS Button */}
              <a
                href={smsUrl}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                <span>📲 Send SMS Reminder</span>
              </a>

              {/* Mobile Notification Enable / Status */}
              {notifPermission === "granted" ? (
                <button
                  onClick={handleTestNotification}
                  className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{testSent ? "Notification Sent!" : "5 PM Active (Test Now)"}</span>
                </button>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-brown-950 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Bell className="w-3.5 h-3.5 text-brown-950" />
                  <span>🔔 Enable 5 PM Notification</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Add Custom Focus Task Form */}
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

          {/* List of Today's Tasks */}
          {todaysTasks.length === 0 ? (
            <div className="p-6 text-center bg-brown-50/60 rounded-xl text-brown-700 text-sm border border-brown-200 font-medium">
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
                        ? "bg-emerald-50/30 border-emerald-200 opacity-70"
                        : isOverdue
                        ? "bg-rose-50/80 border-rose-200 shadow-2xs"
                        : "bg-white border-brown-200/90 hover:border-brown-300 shadow-2xs"
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
                        className="cursor-pointer text-brown-500 hover:text-brown-900 transition-colors shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-brown-400" />
                        )}
                      </button>

                      <div className="truncate space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold truncate ${
                            task.completed ? "line-through text-brown-400" : "text-brown-950"
                          }`}>
                            {task.label}
                          </span>
                          {isOverdue && (
                            <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5 text-rose-600" /> Overdue
                            </span>
                          )}
                        </div>

                        {!task.isCustom && (
                          <div className="text-xs text-brown-600 font-medium truncate">
                            <strong className="text-brown-900">{task.subjectName}</strong> • {task.topicName}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={`text-[11px] px-2 py-0.5 rounded font-bold shrink-0 border ${
                      task.type === "reading" ? "bg-brown-100 text-brown-900 border-brown-300" :
                      task.type === "solving" || task.type === "pyq" ? "bg-espresso-100 text-espresso-950 border-espresso-300" :
                      task.type === "revision" ? "bg-amber-100 text-amber-950 border-amber-300" :
                      "bg-brown-50 text-brown-800 border-brown-200"
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
