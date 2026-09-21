import React from "react";
import { Calculator, Calendar, TrendingUp, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { computeTimelineProjection } from "../utils/timelineMath";

export const TimelineCalculator = ({
  syllabus,
  dailyGoalPace,
  onChangePace
}) => {
  const projection = computeTimelineProjection(syllabus, dailyGoalPace);

  const formattedFinishDate = projection.projectedFinishDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="py-6 border-t border-brown-200 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brown-800" />
            <h2 className="text-lg font-extrabold text-brown-950">
              Completion Timeline & Velocity Calculator
            </h2>
          </div>
          <span className="bg-brown-100 text-brown-900 border border-brown-300 text-xs px-2.5 py-1 rounded-full font-bold">
            Target Completion: Dec 31, 2027
          </span>
        </div>

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
                <span className="text-xs text-brown-600 font-medium">Adjust to calculate projection</span>
              </div>
            </div>
            <div className="text-xs text-brown-700 border-t border-brown-200 pt-2.5 flex items-center justify-between font-medium">
              <span>Remaining Tasks:</span>
              <strong className="text-brown-950 font-bold">{projection.remainingTasks} tasks</strong>
            </div>
          </div>

          {/* Right Column: Projection Dashboard */}
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
                  ? "On track! Jan-Feb 2028 is free for full mocks"
                  : `Needs acceleration to finish by Dec 31, 2027`}
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
                Days left until Dec 31: <strong className="text-brown-950">{projection.daysRemainingUntilTarget} days</strong>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

