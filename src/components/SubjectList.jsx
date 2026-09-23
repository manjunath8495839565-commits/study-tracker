import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckSquare, Square, Calendar, BookOpen, Clock, HelpCircle, CheckCircle, RotateCcw, AlertCircle } from "lucide-react";
import { RAW_SYLLABUS } from "../data/syllabusData";

export const SubjectList = ({
  studyPlan,
  activeFilter,
  onToggleTask,
  onToggleTaskRevisionStatus,
  onUpdateTaskMetrics
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    return { [RAW_SYLLABUS[0]?.id]: true };
  });

  const toggleExpand = (subId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const filteredSubjects = RAW_SYLLABUS.filter(subject => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "CS_ONLY") return subject.stream === "CS";
    if (activeFilter === "DA_ONLY") return subject.stream === "DA";
    return subject.id === activeFilter;
  });

  const tasks = studyPlan?.tasks || [];
  const deadlines = studyPlan?.deadlines || [];

  return (
    <div className="py-6 space-y-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brown-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brown-800" />
            <span>Syllabus Breakdown & Subject Modules</span>
          </h2>
          <span className="text-xs text-brown-700 font-medium">
            Showing {filteredSubjects.length} of {RAW_SYLLABUS.length} subjects
          </span>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="p-8 text-center bg-white border border-brown-200 rounded-2xl text-brown-700 shadow-sm">
            No subjects matched the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubjects.map((subject) => {
              const isExpanded = !!expandedSubjects[subject.id];
              const isCS = subject.stream === "CS";

              const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
              const subTotalTasks = subjectTasks.length;
              const subCompletedTasks = subjectTasks.filter(t => t.completed).length;

              const subPercent = subTotalTasks > 0 ? Math.round((subCompletedTasks / subTotalTasks) * 100) : 0;
              const isSubjectFinished = subPercent === 100;

              const deadlineObj = deadlines.find(d => d.subjectId === subject.id);
              const formattedDeadline = deadlineObj?.deadlineDate
                ? new Date(deadlineObj.deadlineDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "TBD";

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
                    {/* Left Info: Name & Target Deadline */}
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
                            Target Deadline: <strong className="text-brown-950">{formattedDeadline}</strong>
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

                  {/* Expanded Content: Topics List */}
                  {isExpanded && (
                    <div className="border-t border-brown-200 bg-brown-50/40 p-4 sm:p-6 space-y-4">
                      {subject.topics.map((topic, topicIdx) => {
                        const topicTasks = subjectTasks.filter(t => t.topicId === topic.id);
                        const isTopicDone = topicTasks.length > 0 && topicTasks.every(t => t.completed);

                        return (
                          <div
                            key={topic.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isTopicDone
                                ? "bg-emerald-50/30 border-emerald-200"
                                : "bg-white border-brown-200 shadow-2xs"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-brown-500">
                                  #{topicIdx + 1}
                                </span>
                                <h4 className="text-sm font-extrabold text-brown-950">
                                  {topic.name}
                                </h4>
                                <span className="bg-brown-100 text-brown-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-brown-200 uppercase">
                                  {topic.size}
                                </span>
                              </div>

                              {isTopicDone && (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Topic Completed
                                </span>
                              )}
                            </div>

                            {/* Sub-tasks Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                              {topicTasks.map((task) => {
                                const formattedTaskDate = new Date(task.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                });
                                const isNeedsRevision = task.status === "needs-revision";

                                return (
                                  <div
                                    key={task.id}
                                    className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                                      task.completed
                                        ? "bg-amber-50/40 border-amber-200 text-brown-600"
                                        : isNeedsRevision
                                        ? "bg-rose-50/60 border-rose-300 text-rose-950"
                                        : "bg-brown-50/60 border-brown-200/90 text-brown-950"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <button
                                        onClick={() => onToggleTask(task.id)}
                                        className="text-brown-700 hover:text-brown-900 cursor-pointer shrink-0 mt-0.5"
                                      >
                                        {task.completed ? (
                                          <CheckSquare className="w-4 h-4 text-amber-700 fill-amber-100" />
                                        ) : (
                                          <Square className="w-4 h-4 text-brown-400 hover:text-brown-700" />
                                        )}
                                      </button>

                                      <div className="min-w-0 flex-1">
                                        <div className={`text-xs font-extrabold ${task.completed ? "line-through text-brown-500" : "text-brown-950"}`}>
                                          {task.type.toUpperCase()}
                                        </div>
                                        <div className="text-[11px] text-brown-600 font-medium truncate mt-0.5">
                                          {task.label.split(" — ")[0]}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] font-bold text-brown-700 border-t border-brown-200/60 pt-1.5">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-brown-600" />
                                        {formattedTaskDate}
                                      </span>

                                      <button
                                        onClick={() => onToggleTaskRevisionStatus(task.id)}
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-black cursor-pointer transition-colors ${
                                          isNeedsRevision
                                            ? "bg-rose-600 text-white"
                                            : "bg-brown-200/70 text-brown-800 hover:bg-brown-300"
                                        }`}
                                        title="Flag for revision"
                                      >
                                        {isNeedsRevision ? "Needs Revision" : "Flag Revision"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
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
