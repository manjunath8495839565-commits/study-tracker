export const getLocalYYYYMMDD = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const computeOverallStats = (studyPlan) => {
  if (!studyPlan || !studyPlan.tasks) {
    return {
      totalTopics: 132,
      topicsDone: 0,
      totalTasks: 528,
      completedTasks: 0,
      remainingTasks: 528,
      totalQuestionsPracticed: 0,
      totalStudyHours: 0,
      totalRevisions: 0,
      weakTopicsCount: 0,
      overallPercentage: "0.0"
    };
  }

  const tasks = studyPlan.tasks;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  let totalQuestionsPracticed = 0;
  let totalStudyHours = 0;
  let totalRevisions = 0;

  const topicMap = {};
  const weakTopicsSet = new Set();

  tasks.forEach(t => {
    if (!topicMap[t.topicId]) {
      topicMap[t.topicId] = [];
    }
    topicMap[t.topicId].push(t);

    totalQuestionsPracticed += (t.questionsLogged || 0);
    totalStudyHours += (t.hoursSpent || 0);

    if (t.completed && (t.type === "pyq" || t.status === "needs-revision")) {
      totalRevisions++;
    }

    if (t.status === "needs-revision") {
      weakTopicsSet.add(t.topicId);
    }
  });

  const topicIds = Object.keys(topicMap);
  const totalTopics = topicIds.length || 132;
  
  let topicsDone = 0;
  topicIds.forEach(topicId => {
    const topicTasks = topicMap[topicId];
    if (topicTasks.length > 0 && topicTasks.every(tk => tk.completed)) {
      topicsDone++;
    }
  });

  const overallPercentage = ((topicsDone / totalTopics) * 100).toFixed(1);

  return {
    totalTopics,
    topicsDone,
    totalTasks,
    completedTasks,
    remainingTasks: totalTasks - completedTasks,
    totalQuestionsPracticed,
    totalStudyHours: Math.round(totalStudyHours * 10) / 10,
    totalRevisions,
    weakTopicsCount: weakTopicsSet.size,
    overallPercentage
  };
};

export const getTodaysTasksList = (studyPlan, customTasks = []) => {
  if (!studyPlan || !studyPlan.tasks) return [];

  const todayStr = getLocalYYYYMMDD(new Date());

  let todayTasks = studyPlan.tasks.filter(t => t.dateString === todayStr);

  if (todayTasks.length === 0) {
    todayTasks = studyPlan.tasks
      .filter(t => !t.completed)
      .slice(0, 8);
  }

  const formattedCustom = (customTasks || []).map(ct => ({ ...ct, isCustom: true }));
  return [...formattedCustom, ...todayTasks];
};

export const getOngoingSubject = (studyPlan) => {
  if (!studyPlan || !studyPlan.tasks) return null;

  const todayStr = getLocalYYYYMMDD(new Date());
  
  const currentTask = studyPlan.tasks.find(t => t.dateString === todayStr) || 
                    studyPlan.tasks.find(t => !t.completed) ||
                    studyPlan.tasks[0];

  if (!currentTask) return null;

  const subjectDeadline = (studyPlan.deadlines || []).find(d => d.subjectId === currentTask.subjectId);
  const deadlineDate = subjectDeadline ? subjectDeadline.deadlineDate : currentTask.date;

  const formattedMonth = deadlineDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return {
    subjectId: currentTask.subjectId,
    subjectName: currentTask.subjectName,
    stream: currentTask.stream,
    targetMonth: formattedMonth,
    deadlineDate
  };
};

export const groupTasksByMonth = (studyPlan) => {
  if (!studyPlan || !studyPlan.tasks) return [];

  const monthMap = {};

  studyPlan.tasks.forEach(t => {
    const d = new Date(t.date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        monthKey,
        label,
        year,
        month,
        tasks: [],
        totalTasks: 0,
        completedTasks: 0
      };
    }

    monthMap[monthKey].tasks.push(t);
    monthMap[monthKey].totalTasks++;
    if (t.completed) {
      monthMap[monthKey].completedTasks++;
    }
  });

  const sortedMonths = Object.values(monthMap).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  return sortedMonths.map(m => ({
    ...m,
    percent: m.totalTasks > 0 ? Math.round((m.completedTasks / m.totalTasks) * 100) : 0
  }));
};

export const computeTimelineProjection = (studyPlan, dailyGoalPace = 3) => {
  if (!studyPlan || !studyPlan.tasks) {
    return {
      remainingTasks: 0,
      daysNeeded: 0,
      projectedFinishDate: new Date(),
      daysRemainingUntilTarget: 0,
      daysDifference: 0,
      isAhead: true,
      daysAheadOrBehind: 0,
      requiredPace: "0.0",
      daysUntilExam: 0
    };
  }

  const tasks = studyPlan.tasks;
  const remainingTasks = tasks.filter(t => !t.completed).length;
  const effectivePace = Math.max(0.5, Number(dailyGoalPace) || 3);
  
  const daysNeeded = Math.ceil(remainingTasks / effectivePace);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const projectedFinishDate = new Date(today.getTime() + daysNeeded * 24 * 60 * 60 * 1000);

  const examDate = new Date(studyPlan.examDate);
  const reservedDays = studyPlan.reservedRevisionDays || 30;
  
  const revisionStartDate = new Date(examDate.getTime() - reservedDays * 24 * 60 * 60 * 1000);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemainingUntilRevision = Math.max(1, Math.ceil((revisionStartDate.getTime() - today.getTime()) / msPerDay));
  const daysUntilExam = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / msPerDay));

  const daysDifference = daysRemainingUntilRevision - daysNeeded;
  const isAhead = daysDifference >= 0;
  const requiredPace = (remainingTasks / daysRemainingUntilRevision).toFixed(1);

  return {
    remainingTasks,
    daysNeeded,
    projectedFinishDate,
    revisionStartDate,
    daysRemainingUntilTarget: daysRemainingUntilRevision,
    daysDifference,
    isAhead,
    daysAheadOrBehind: Math.abs(daysDifference),
    requiredPace,
    daysUntilExam,
    targetMonthLabel: revisionStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  };
};

export const getWeakTasksList = (studyPlan) => {
  if (!studyPlan || !studyPlan.tasks) return [];
  return studyPlan.tasks.filter(t => t.status === "needs-revision");
};
