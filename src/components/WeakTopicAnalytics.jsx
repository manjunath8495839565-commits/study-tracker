import React from "react";
import { AlertOctagon, Flame, Target, Award, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getWeakTopicsList } from "../utils/timelineMath";

export const WeakTopicAnalytics = ({
  syllabus,
  streakData
}) => {
  const weakTopics = getWeakTopicsList(syllabus);

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
    <div className="py-8 border-t border-brown-200 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Title & Streak Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-brown-950 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <span>Weak-Topic Focus & Subject Accuracy Analytics</span>
            </h2>
            <p className="text-xs text-brown-700 font-medium mt-0.5">
              Auto-flags topics scoring below 60% accuracy and monitors daily practice consistency
            </p>
          </div>

          {/* Daily Streak Card */}
          <div className="flex items-center gap-3 bg-brown-50 border border-brown-300 px-4 py-2.5 rounded-2xl shadow-xs self-start md:self-auto">
            <div className="p-2 bg-amber-100 rounded-xl border border-amber-300">
              <Flame className="w-6 h-6 text-amber-700 animate-bounce" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-brown-700 uppercase tracking-wider">
                Current Study Streak
              </div>
              <div className="text-lg font-black text-brown-950 flex items-center gap-1">
                {streakData?.currentStreak || 1} <span className="text-xs font-semibold text-brown-700">Days Active 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Weak Topics & Subject Accuracy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Weak Topics Auto-Flagged Panel */}
          <div className="lg:col-span-5 bg-white border border-brown-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brown-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-extrabold text-brown-950">
                  Auto-Flagged Weak Topics
                </h3>
              </div>
              <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {weakTopics.length} Flagged
              </span>
            </div>

            {weakTopics.length === 0 ? (
              <div className="p-6 text-center bg-brown-50/60 rounded-xl text-brown-700 text-sm space-y-1 border border-brown-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-brown-950">No Weak Topics Flagged!</p>
                <p className="text-xs text-brown-600 font-medium">Log accuracy scores &lt; 60% on any topic to automatically spawn weak-topic drill alerts here.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {weakTopics.map((wt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-rose-800">
                        {wt.subjectName}
                      </div>
                      <div className="text-sm font-extrabold text-brown-950 mt-0.5">
                        {wt.topicName}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-rose-900 bg-rose-100 px-2 py-1 rounded border border-rose-300">
                        {wt.accuracy}% Acc
                      </span>
                      <span className="block text-[10px] text-brown-600 mt-1 font-bold uppercase">Needs Drill</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Subject Accuracy Breakdown Grid */}
          <div className="lg:col-span-7 bg-white border border-brown-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brown-200 pb-3">
              <h3 className="text-base font-extrabold text-brown-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-brown-800" />
                <span>Subject Accuracy Overview</span>
              </h3>
              <span className="text-xs text-brown-700 font-bold">Target: &gt; 80%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {subjectAccuracyList.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-3 bg-brown-50/60 border border-brown-200 rounded-xl flex items-center justify-between shadow-2xs"
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-bold text-brown-600 uppercase">
                      {sub.stream} • #{idx + 1}
                    </span>
                    <div className="text-xs font-extrabold text-brown-950 truncate">
                      {sub.name.split("—")[0].trim()}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${
                      sub.avgAccuracy >= 80
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : sub.avgAccuracy >= 60
                        ? "bg-amber-100 text-amber-950 border-amber-300"
                        : sub.avgAccuracy > 0
                        ? "bg-rose-100 text-rose-900 border-rose-300"
                        : "bg-brown-100 text-brown-700 border-brown-300"
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
