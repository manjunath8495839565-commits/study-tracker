import React from "react";
import { Calculator, Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { computeTimelineProjection, groupTasksByMonth } from "../utils/timelineMath";

export const TimelineCalculator = ({
  studyPlan,
  dailyGoalPace,
  onChangePace
}) => {
  const projection = computeTimelineProjection(studyPlan, dailyGoalPace);
  const monthlyGroups = groupTasksByMonth(studyPlan);

  const formattedFinishDate = projection.projectedFinishDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedTargetDeadline = projection.targetMonthLabel || "Exam Date";

  return (
    <div className="py-6 border-t border-brown-200 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brown-800" />
            <h2 className="text-lg font-extrabold text-brown-950">
              Completion Timeline & Velocity Calculator
            </h2>
          </div>
          <span className="bg-brown-100 text-brown-900 border border-brown-300 text-xs px-3 py-1 rounded-full font-extrabold shadow-2xs">
            Revision Start Goal: {formattedTargetDeadline}
          </span>
        </div>

        {/* Projection Dashboard Cards */}
        <div className="bg-white border border-brown-200 rounded-2xl p-5 sm:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Input Box */}
          <div className="lg:col-span-4 bg-brown-50/80 border border-brown-200 p-5 rounded-xl space-y-3">
            <label className="block text-xs font-extrabold text-brown-900 uppercase tracking-wider">
              Realistic Daily Capacity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="20"
                value={dailyGoalPace}
                onChange={(e) => onChangePace(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-white border border-brown-400 rounded-xl py-2 px-3 text-xl font-extrabold text-brown-950 text-center focus:outline-none focus:ring-2 focus:ring-brown-600 shadow-sm"
              />
              <div>
                <span className="text-sm font-bold text-brown-950 block">tasks / day</span>
                <span className="text-xs text-brown-600 font-medium">Adjust to recalculate projection</span>
              </div>
            </div>
            <div className="text-xs text-brown-700 border-t border-brown-200 pt-2.5 flex items-center justify-between font-medium">
              <span>Remaining Incomplete Tasks:</span>
              <strong className="text-brown-950 font-bold">{projection.remainingTasks} tasks</strong>
            </div>
          </div>

          {/* Right Column: Projection Indicators */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Box 1: Projected Completion Date */}
            <div className="bg-brown-50/60 border border-brown-200 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-brown-700 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-brown-800" />
                <span>Projected Finish</span>
              </div>
              <div className="text-lg font-extrabold text-brown-950">
                {formattedFinishDate}
              </div>
              <p className="text-[11px] text-brown-600 font-medium">
                Takes ~{projection.daysNeeded} days at {dailyGoalPace} tasks/day
              </p>
            </div>

            {/* Box 2: Ahead / Behind Status */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              projection.isAhead
                ? "bg-emerald-50 border-emerald-300"
                : "bg-rose-50 border-rose-200"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {projection.isAhead ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span className={projection.isAhead ? "text-emerald-900" : "text-rose-900"}>
                  Schedule Status
                </span>
              </div>
              <div className={`text-lg font-extrabold ${
                projection.isAhead ? "text-emerald-800" : "text-rose-800"
              }`}>
                {projection.isAhead ? `Ahead by ${projection.daysAheadOrBehind} days` : `Behind by ${projection.daysAheadOrBehind} days`}
              </div>
              <p className="text-[11px] text-stone-600 font-medium">
                {projection.isAhead
                  ? "On track! Reserved revision window is protected."
                  : `Needs acceleration to finish before revision phase.`}
              </p>
            </div>

            {/* Box 3: Required Pace */}
            <div className="bg-brown-50/60 border border-brown-200 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-brown-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                <span>Required Pace</span>
              </div>
              <div className="text-lg font-extrabold text-brown-950">
                {projection.requiredPace} <span className="text-xs font-normal text-brown-600">tasks/day</span>
              </div>
              <p className="text-[11px] text-brown-600 font-medium">
                Days left until revision phase: <strong className="text-brown-950">{projection.daysRemainingUntilTarget} days</strong>
              </p>
            </div>

          </div>

        </div>

        {/* MONTHLY BREAKDOWN GRID */}
        <div className="bg-white border border-brown-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brown-200 pb-3">
            <h3 className="text-base font-extrabold text-brown-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brown-800" />
              <span>Monthly Schedule Breakdown & Velocity Progress</span>
            </h3>
            <span className="text-xs text-brown-700 font-bold">
              {monthlyGroups.length} Scheduled Months
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyGroups.map((month) => (
              <div
                key={month.monthKey}
                className="bg-brown-50/60 border border-brown-200 rounded-xl p-4 space-y-3 hover:border-brown-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between text-sm font-extrabold text-brown-950">
                  <span>{month.label}</span>
                  <span className="text-xs bg-white border border-brown-300 px-2 py-0.5 rounded-md text-brown-800">
                    {month.completedTasks}/{month.totalTasks} Done ({month.percent}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-brown-200/60 rounded-full overflow-hidden border border-brown-300/60">
                  <div
                    className="h-full bg-gradient-to-r from-brown-700 via-amber-600 to-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${month.percent}%` }}
                  />
                </div>

                <div className="text-[11px] text-brown-700 font-medium flex justify-between">
                  <span>Tasks: {month.totalTasks}</span>
                  <span>{month.percent === 100 ? "Completed ✓" : "In Progress"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
