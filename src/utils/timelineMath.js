export const TARGET_DATE = new Date("2027-12-31T23:59:59");
export const GATE_EXAM_DATE = new Date("2028-02-05T09:00:00");

export const computeOverallStats = (syllabus) => {
  let totalTopics = 0;
  let topicsDone = 0;
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  let totalQuestionsPracticed = 0;
  let totalStudyHours = 0;
  
  let totalRevisions = 0;
  let weakTopicsCount = 0;

  syllabus.forEach(subject => {
    subject.topics.forEach(topic => {
      totalTopics++;
      
      const topicTasks = topic.tasks || [];
      const topicTasksDone = topicTasks.filter(t => t.completed).length;
      
      totalTasks += topicTasks.length;
      completedTasks += topicTasksDone;

      if (topicTasks.length > 0 && topicTasksDone === topicTasks.length) {
        topicsDone++;
      }

      topicTasks.forEach(t => {
        totalQuestionsPracticed += (t.questionsLogged || 0);
        totalStudyHours += (t.hoursSpent || 0);
        if (t.completed && (t.type === "revision" || t.type === "pyq" || t.type === "speed")) {
          totalRevisions++;
        }
      });

      if (topic.accuracy > 0 && topic.accuracy < 60) {
        weakTopicsCount++;
      }
    });

    const masterTasks = subject.masterTasks || [];
    totalTasks += masterTasks.length;
    masterTasks.forEach(mt => {
      if (mt.completed) {
        completedTasks++;
        if (mt.type === "master_revision" || mt.type === "master_mock") {
          totalRevisions++;
        }
      }
    });
  });

  const overallPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0.0";

  return {
    totalTopics,
    topicsDone,
    totalTasks,
    completedTasks,
    remainingTasks: totalTasks - completedTasks,
    totalQuestionsPracticed,
    totalStudyHours: Math.round(totalStudyHours * 10) / 10,
    totalRevisions,
    weakTopicsCount,
    overallPercentage
  };
};

export const computeTimelineProjection = (syllabus, dailyTaskRate = 3) => {
  const stats = computeOverallStats(syllabus);
  const remainingTasks = stats.remainingTasks;

  const effectivePace = Math.max(0.5, Number(dailyTaskRate) || 3);
  
  const daysNeeded = Math.ceil(remainingTasks / effectivePace);
  
  const today = new Date();
  const projectedFinishDate = new Date();
  projectedFinishDate.setDate(today.getDate() + daysNeeded);

  const timeDiffToTarget = TARGET_DATE.getTime() - today.getTime();
  const daysRemainingUntilTarget = Math.max(1, Math.ceil(timeDiffToTarget / (1000 * 3600 * 24)));

  const daysDifference = daysRemainingUntilTarget - daysNeeded;
  
  const requiredPace = (remainingTasks / daysRemainingUntilTarget).toFixed(1);

  const timeDiffToExam = GATE_EXAM_DATE.getTime() - today.getTime();
  const daysUntilExam = Math.max(0, Math.ceil(timeDiffToExam / (1000 * 3600 * 24)));

  return {
    remainingTasks,
    daysNeeded,
    projectedFinishDate,
    daysRemainingUntilTarget,
    daysDifference,
    isAhead: daysDifference >= 0,
    daysAheadOrBehind: Math.abs(daysDifference),
    requiredPace,
    daysUntilExam
  };
};

export const getWeakTopicsList = (syllabus) => {
  const weakTopics = [];
  syllabus.forEach(subject => {
    subject.topics.forEach(topic => {
      if (topic.accuracy > 0 && topic.accuracy < 60) {
        weakTopics.push({
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: topic.id,
          topicName: topic.name,
          accuracy: topic.accuracy
        });
      }
    });
  });
  return weakTopics;
};

export const getTodaysTasksList = (syllabus, customTasks = []) => {
  const todaysTasks = [];
  
  customTasks.forEach(ct => {
    todaysTasks.push({
      ...ct,
      isCustom: true
    });
  });

  const monthOrder = {
    "Sep 2026": 1, "Oct 2026": 2, "Nov 2026": 3, "Dec 2026": 4,
    "Jan 2027": 5, "Feb 2027": 6, "Mar 2027": 7, "Apr 2027": 8, "May 2027": 9,
    "Jun 2027": 10, "Jul 2027": 11, "Aug 2027": 12, "Sep 2027": 13, "Oct 2027": 14,
    "Nov 2027": 15, "Dec 2027": 16, "Jan 2028": 17
  };

  const activeSubjects = [...syllabus]
    .filter(subject => {
      const topicTasksPending = (subject.topics || []).some(t => (t.tasks || []).some(tk => !tk.completed));
      const masterTasksPending = (subject.masterTasks || []).some(mt => !mt.completed);
      return topicTasksPending || masterTasksPending;
    })
    .sort((a, b) => {
      const orderA = monthOrder[a.targetMonth] || 99;
      const orderB = monthOrder[b.targetMonth] || 99;
      return orderA - orderB;
    });

  let candidateTasks = [];

  activeSubjects.forEach(subject => {
    (subject.topics || []).forEach(topic => {
      (topic.tasks || []).forEach(task => {
        if (!task.completed) {
          candidateTasks.push({
            ...task,
            subjectId: subject.id,
            subjectName: subject.name,
            topicId: topic.id,
            topicName: topic.name,
            accuracy: topic.accuracy,
            targetMonth: subject.targetMonth
          });
        }
      });
    });

    (subject.masterTasks || []).forEach(mt => {
      if (!mt.completed) {
        candidateTasks.push({
          ...mt,
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: "MASTER",
          topicName: "Master Subject Milestone",
          isMaster: true,
          targetMonth: subject.targetMonth
        });
      }
    });
  });

  return [...todaysTasks, ...candidateTasks.slice(0, 8)];
};

export const getTopicBenchmarkHours = (size = "medium") => {
  if (size === "small") return 4;
  if (size === "large") return 20;
  return 10;
};

export const calculateTopicSchedule = (topic, targetMonthStr, topicIndex = 0, totalTopicsInSubject = 1) => {
  const minHours = topic.minHours || getTopicBenchmarkHours(topic.size);
  const hoursSpent = topic.tasks?.[0]?.hoursSpent || 0;
  
  let targetYear = 2026;
  let monthIdx = 8; // Sep (0-indexed)
  
  if (targetMonthStr) {
    const parts = targetMonthStr.split(" ");
    if (parts.length === 2) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mFound = monthNames.indexOf(parts[0]);
      if (mFound !== -1) monthIdx = mFound;
      const yFound = parseInt(parts[1], 10);
      if (!isNaN(yFound)) targetYear = yFound;
    }
  }

  let startDay = 1;
  let maxDaysInMonth = 28;

  // If target month is Sep 2026 (the start of syllabus), start tasks from tomorrow (23 Sep 2026)
  if (targetYear === 2026 && monthIdx === 8) {
    startDay = 23;
    maxDaysInMonth = 30;
  }

  const dayRange = Math.max(0, maxDaysInMonth - startDay);
  const dayOffset = Math.round(startDay + (totalTopicsInSubject > 1 ? (topicIndex / (totalTopicsInSubject - 1)) * dayRange : 0));
  
  const bestTargetDate = new Date(targetYear, monthIdx, Math.min(maxDaysInMonth, Math.max(startDay, dayOffset)));
  const today = new Date();
  
  const daysUntilTarget = Math.ceil((bestTargetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const daysUntilExam = Math.max(0, Math.ceil((GATE_EXAM_DATE.getTime() - today.getTime()) / (1000 * 3600 * 24)));

  const isMinHoursMet = hoursSpent >= minHours;
  const hoursRemaining = Math.max(0, minHours - hoursSpent);
  const percentMinHoursDone = Math.min(100, Math.round((hoursSpent / minHours) * 100));

  const recommendedDailyPace = minHours <= 4 ? "1.0 - 1.5 h/day" : minHours <= 10 ? "1.5 - 2.0 h/day" : "2.0 - 3.0 h/day";

  const formattedTargetDate = bestTargetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return {
    minHours,
    hoursSpent,
    hoursRemaining,
    percentMinHoursDone,
    isMinHoursMet,
    bestTargetDate,
    formattedTargetDate,
    daysUntilTarget,
    daysUntilExam,
    recommendedDailyPace
  };
};
