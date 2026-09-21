import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckSquare, Square, Calendar, BookOpen, Clock, HelpCircle, AlertTriangle, FileText, CheckCircle, Timer, Target, Zap } from "lucide-react";
import { calculateTopicSchedule } from "../utils/timelineMath";

export const SubjectList = ({
  syllabus,
  activeFilter,
  onToggleTask,
  onUpdateTopicMetric,
  onToggleMasterTask
}) => {
  // Track open/collapsed state per subject
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    // Expand the first subject by default
    return { [syllabus[0]?.id]: true };
  });

  const toggleExpand = (subId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Filter subjects according to subject filter row
  const filteredSyllabus = syllabus.filter(subject => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "CS_ONLY") return subject.stream === "CS";
    if (activeFilter === "DA_ONLY") return subject.stream === "DA";
    return subject.id === activeFilter;
  });

  return (
    <div className="py-6 space-y-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brown-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brown-800" />
            <span>Syllabus Breakdown & Subject Modules</span>
          </h2>
          <span className="text-xs text-brown-700 font-medium">
            Showing {filteredSyllabus.length} of {syllabus.length} subjects
          </span>
        </div>

        {filteredSyllabus.length === 0 ? (
          <div className="p-8 text-center bg-white border border-brown-200 rounded-2xl text-brown-700 shadow-sm">
            No subjects matched the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSyllabus.map((subject, index) => {
              const isExpanded = !!expandedSubjects[subject.id];
              const isCS = subject.stream === "CS";

              // Calculate subject level statistics
              let subTotalTasks = 0;
              let subCompletedTasks = 0;

              subject.topics.forEach(topic => {
                const tasks = topic.tasks || [];
                subTotalTasks += tasks.length;
                subCompletedTasks += tasks.filter(t => t.completed).length;
              });

              (subject.masterTasks || []).forEach(mt => {
                subTotalTasks++;
                if (mt.completed) subCompletedTasks++;
              });

              const subPercent = subTotalTasks > 0 ? Math.round((subCompletedTasks / subTotalTasks) * 100) : 0;
              const isSubjectFinished = subPercent === 100;

              return (
                <div
                  key={subject.id}
                  className={`bg-white border rounded-2xl transition-all shadow-sm overflow-hidden ${
                    isSubjectFinished
                      ? "border-emerald-400 bg-emerald-50/20"
                      : isExpanded
                      ? "border-brown-400 ring-2 ring-brown-200/80 shadow-md"
                      : "border-brown-200/90 hover:border-brown-300"
                  }`}
                >
                  {/* Subject Card Header Bar */}
                  <div
                    onClick={() => toggleExpand(subject.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-brown-50/60 transition-colors"
                  >
                    {/* Left Info: Name & Target Month */}
                    <div className="flex items-start sm:items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold shrink-0 ${
                        isCS ? "bg-brown-100 text-brown-900 border border-brown-300" : "bg-espresso-100 text-espresso-950 border border-espresso-300"
                      }`}>
                        {subject.stream}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-extrabold text-brown-950">
                            {subject.name}
                          </h3>
                          {isSubjectFinished && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Fully Completed
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-brown-700 font-medium mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brown-800" />
                            Target: <strong className="text-brown-950">{subject.targetMonth}</strong>
                          </span>
                          <span>•</span>
                          <span>{subject.topics.length} topics</span>
                          <span>•</span>
                          <span>{subCompletedTasks}/{subTotalTasks} tasks done</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Info: Progress Bar & Toggle Icon */}
                    <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-brown-200 pt-3 sm:pt-0">
                      
                      {/* Mini Progress Bar */}
                      <div className="w-36 sm:w-48 space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-brown-700">Progress</span>
                          <span className={subPercent === 100 ? "text-emerald-700" : "text-brown-900"}>
                            {subPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-brown-100 rounded-full overflow-hidden border border-brown-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              subPercent === 100
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                                : "bg-gradient-to-r from-brown-700 to-brown-900"
                            }`}
                            style={{ width: `${subPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Dropdown Toggle Icon */}
                      <button className="p-1.5 rounded-lg text-brown-700 hover:text-brown-950 hover:bg-brown-100 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-brown-800" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Subject Card Body (Expanded Topics List) */}
                  {isExpanded && (
                    <div className="border-t border-brown-200/80 bg-brown-50/30 p-4 sm:p-6 space-y-4">
                      
                      {/* Topics Table Header */}
                      <div className="hidden lg:grid grid-cols-12 gap-3 text-xs font-bold text-brown-700 uppercase tracking-wider px-3 pb-2 border-b border-brown-200">
                        <div className="col-span-4">Topic & Status</div>
                        <div className="col-span-5">Auto-Generated Task Checkboxes</div>
                        <div className="col-span-3 text-right">Metrics & Accuracy</div>
                      </div>

                      {/* Topic Rows */}
                      <div className="space-y-3">
                        {subject.topics.map((topic, topicIdx) => {
                          const topicTasks = topic.tasks || [];
                          const completedCount = topicTasks.filter(t => t.completed).length;
                          const isFullyDone = topicTasks.length > 0 && completedCount === topicTasks.length;
                          const isStarted = completedCount > 0;

                          // Determine Status Dot Color
                          let statusDotClass = "bg-slate-400"; // Not Started
                          let statusText = "Not Started";
                          if (topic.accuracy > 0 && topic.accuracy < 60) {
                            statusDotClass = "bg-rose-500 animate-pulse"; // Need Revision
                            statusText = "Need Revision";
                          } else if (isFullyDone) {
                            statusDotClass = "bg-emerald-600"; // Done
                            statusText = "Done";
                          } else if (isStarted) {
                            statusDotClass = "bg-amber-500"; // In Progress
                            statusText = "In Progress";
                          }

                          const schedule = calculateTopicSchedule(topic, subject.targetMonth, topicIdx, subject.topics.length);

                          return (
                            <div
                              key={topic.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                isFullyDone
                                  ? "bg-emerald-50/30 border-emerald-200"
                                  : topic.accuracy > 0 && topic.accuracy < 60
                                  ? "bg-rose-50/60 border-rose-200"
                                  : "bg-white border-brown-200/90 shadow-sm hover:border-brown-300"
                              }`}
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                
                                {/* Topic Title & Minimum Time / Target Schedule */}
                                <div className="lg:col-span-4 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDotClass}`} title={statusText} />
                                    <span className="text-sm font-bold text-brown-950">
                                      {topicIdx + 1}. {topic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-brown-700 pl-4 flex-wrap">
                                    <span className="capitalize text-brown-900 bg-brown-100 px-2 py-0.5 rounded text-[11px] font-bold border border-brown-200 shadow-2xs">
                                      {topic.size} topic
                                    </span>
                                    <span>•</span>
                                    <span className={isFullyDone ? "text-emerald-700 font-bold" : "font-medium"}>
                                      {completedCount}/{topicTasks.length} tasks completed
                                    </span>
                                  </div>

                                  {/* Search-Based Minimum Required Time & Best Exam Completion Schedule */}
                                  <div className="mt-1.5 pl-4 space-y-1 border-l-2 border-brown-300/80">
                                    {/* Minimum Required Time Row */}
                                    <div className="flex items-center gap-1.5 text-xs flex-wrap">
                                      <span className="bg-amber-100/90 text-amber-950 border border-amber-300/90 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-2xs" title={`Search Benchmark: Min ${schedule.minHours} hours required for ${topic.size} topic`}>
                                        <Timer className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                        <span>Min Required: {schedule.minHours}h</span>
                                      </span>

                                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border flex items-center gap-1 ${
                                        schedule.isMinHoursMet
                                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                          : "bg-brown-100/70 text-brown-800 border-brown-300"
                                      }`}>
                                        <span>{schedule.hoursSpent}h logged ({schedule.percentMinHoursDone}%)</span>
                                        {schedule.isMinHoursMet && <CheckCircle className="w-3 h-3 text-emerald-700 shrink-0" />}
                                      </span>
                                    </div>

                                    {/* Best Target Finish Date Before Exam */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-brown-800 flex-wrap">
                                      <span className="bg-espresso-100/90 text-brown-950 border border-brown-300/90 px-2 py-0.5 rounded font-extrabold flex items-center gap-1 shadow-2xs">
                                        <Target className="w-3.5 h-3.5 text-brown-800 shrink-0" />
                                        <span>Best Target: {schedule.formattedTargetDate}</span>
                                      </span>
                                      <span className="text-brown-600 font-medium">
                                        ({schedule.daysUntilExam}d to GATE)
                                      </span>
                                      <span className="bg-white text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center gap-0.5">
                                        <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                                        <span>{schedule.recommendedDailyPace}</span>
                                      </span>
                                    </div>
                                  </div>

                                </div>

                                {/* Task Checkboxes */}
                                <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
                                  {topicTasks.map(task => (
                                    <button
                                      key={task.id}
                                      onClick={() => onToggleTask(subject.id, topic.id, task.id)}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                        task.completed
                                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                                          : "bg-white text-brown-900 border-brown-300/80 hover:bg-brown-100 hover:border-brown-400"
                                      }`}
                                    >
                                      {task.completed ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-white shrink-0" />
                                      ) : (
                                        <Square className="w-3.5 h-3.5 text-brown-500 shrink-0" />
                                      )}
                                      <span>{task.label}</span>
                                    </button>
                                  ))}
                                </div>

                                {/* Metrics: Qs, Hours, Min Target Hours, Accuracy Input */}
                                <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-2 border-t lg:border-t-0 border-brown-200 pt-2 lg:pt-0 flex-wrap">
                                  
                                  {/* Qs, Logged Hours & Min Req Target Input */}
                                  <div className="flex items-center gap-1.5 text-xs flex-wrap">
                                    <div className="flex items-center gap-1 bg-brown-50 px-2 py-1 rounded border border-brown-300" title="Questions Solved">
                                      <HelpCircle className="w-3 h-3 text-brown-700 shrink-0" />
                                      <input
                                        type="number"
                                        min="0"
                                        value={topic.tasks?.[0]?.questionsLogged || 0}
                                        onChange={(e) => onUpdateTopicMetric(subject.id, topic.id, "questionsLogged", Number(e.target.value))}
                                        className="w-10 bg-transparent text-brown-950 text-center focus:outline-none font-bold"
                                      />
                                      <span className="text-[10px] text-brown-600 font-semibold">Qs</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-brown-50 px-2 py-1 rounded border border-brown-300" title="Hours Spent Logged">
                                      <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={topic.tasks?.[0]?.hoursSpent || 0}
                                        onChange={(e) => onUpdateTopicMetric(subject.id, topic.id, "hoursSpent", Number(e.target.value))}
                                        className="w-9 bg-transparent text-brown-950 text-center focus:outline-none font-bold"
                                      />
                                      <span className="text-[10px] text-brown-600 font-semibold">h</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-amber-50/90 px-1.5 py-1 rounded border border-amber-300/80" title="Adjust Minimum Target Hours Required">
                                      <Timer className="w-3 h-3 text-amber-800 shrink-0" />
                                      <input
                                        type="number"
                                        min="1"
                                        value={topic.minHours || schedule.minHours}
                                        onChange={(e) => onUpdateTopicMetric(subject.id, topic.id, "minHours", Number(e.target.value))}
                                        className="w-8 bg-transparent text-amber-950 text-center focus:outline-none font-bold text-xs"
                                      />
                                      <span className="text-[10px] text-amber-800 font-extrabold">req</span>
                                    </div>
                                  </div>

                                  {/* Accuracy Score */}
                                  <div className="flex items-center gap-1.5 bg-brown-50 px-2 py-1 rounded border border-brown-300">
                                    <span className="text-[11px] text-brown-700 font-semibold">Acc:</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="0%"
                                      value={topic.accuracy || ""}
                                      onChange={(e) => onUpdateTopicMetric(subject.id, topic.id, "accuracy", Number(e.target.value))}
                                      className={`w-9 bg-transparent text-center focus:outline-none font-extrabold text-xs ${
                                        topic.accuracy >= 80
                                          ? "text-emerald-700"
                                          : topic.accuracy >= 60
                                          ? "text-amber-700"
                                          : topic.accuracy > 0
                                          ? "text-rose-600"
                                          : "text-brown-500"
                                      }`}
                                    />
                                    <span className="text-xs text-brown-700 font-semibold">%</span>
                                  </div>

                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Subject Level Master Tasks (Revision, Formula Sheet, Mock Test) */}
                      <div className="pt-3 border-t border-brown-200">
                        <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-brown-900 uppercase tracking-wider">
                          <FileText className="w-3.5 h-3.5 text-brown-700" />
                          <span>Subject Milestone Tasks (Unlocked for Completion)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {(subject.masterTasks || []).map(masterTask => (
                            <button
                              key={masterTask.id}
                              onClick={() => onToggleMasterTask(subject.id, masterTask.id)}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                masterTask.completed
                                  ? "bg-brown-800 text-white border-brown-800 shadow-sm"
                                  : "bg-white text-brown-950 border-brown-300 hover:bg-brown-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {masterTask.completed ? (
                                  <CheckSquare className="w-4 h-4 text-amber-300 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-brown-400 shrink-0" />
                                )}
                                <span>{masterTask.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

