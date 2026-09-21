import React from "react";
import { AlertOctagon, Flame, Target, Award, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getWeakTopicsList } from "../utils/timelineMath";

export const WeakTopicAnalytics = ({
  syllabus,
  streakData
}) => {
  const weakTopics = getWeakTopicsList(syllabus);

  // Subject level accuracy calculations
  const subjectAccuracyList = syllabus.map(subject => {
    let sumAccuracy = 0;
    let topicCount = 0;

    subject.topics.forEach(t => {
      if (t.accuracy > 0) {
        sumAccuracy += t.accuracy;
        topicCount++;
      }
    });

    const avgAccuracy = topicCount > 0 ? Math.round(sumAccuracy / topicCount) : 0;
    return {
      id: subject.id,
      name: subject.name,
      stream: subject.stream,
      avgAccuracy,
      hasData: topicCount > 0
    };
  });

  return (
    <div className="py-8 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Title & Streak Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-400" />
              <span>Weak-Topic Focus & Subject Accuracy Analytics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Auto-flags topics scoring below 60% accuracy and monitors daily practice consistency
            </p>
          </div>

          {/* Daily Streak Card */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-950/80 to-orange-950/80 border border-amber-600/50 px-4 py-2.5 rounded-2xl shadow-lg self-start md:self-auto">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Flame className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Current Study Streak
              </div>
              <div className="text-lg font-extrabold text-white flex items-center gap-1">
                {streakData?.currentStreak || 1} <span className="text-xs font-normal text-amber-200">Days Active 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Weak Topics & Subject Accuracy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Weak Topics Auto-Flagged Panel */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Auto-Flagged Weak Topics
                </h3>
              </div>
              <span className="bg-rose-950 text-rose-300 border border-rose-700/50 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {weakTopics.length} Flagged
              </span>
            </div>

            {weakTopics.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 rounded-xl text-slate-400 text-sm space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-slate-200">No Weak Topics Flagged!</p>
                <p className="text-xs text-slate-400">Log accuracy scores &lt; 60% on any topic to automatically spawn weak-topic drill alerts here.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {weakTopics.map((wt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-rose-300">
                        {wt.subjectName}
                      </div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5">
                        {wt.topicName}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-800">
                        {wt.accuracy}% Acc
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1 font-medium">Needs Drill</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Subject Accuracy Breakdown Grid */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Subject Accuracy Overview</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Target: &gt; 80%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {subjectAccuracyList.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {sub.stream} • #{idx + 1}
                    </span>
                    <div className="text-xs font-bold text-slate-200 truncate">
                      {sub.name.split("—")[0].trim()}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      sub.avgAccuracy >= 80
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : sub.avgAccuracy >= 60
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : sub.avgAccuracy > 0
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {sub.hasData ? `${sub.avgAccuracy}%` : "No data"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
