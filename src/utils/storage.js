const STORAGE_KEY = "GATE_COMMAND_CENTER_STUDY_PLAN_V2";
const LEGACY_STORAGE_KEY = "GATE_2028_STUDY_TRACKER_V1";

/**
 * Hydrates date strings back to JavaScript Date instances.
 */
const hydratePlanDates = (plan) => {
  if (!plan) return null;
  return {
    ...plan,
    examDate: new Date(plan.examDate),
    startDate: new Date(plan.startDate),
    generatedAt: new Date(plan.generatedAt),
    tasks: (plan.tasks || []).map(task => ({
      ...task,
      date: new Date(task.date)
    })),
    deadlines: (plan.deadlines || []).map(dl => ({
      ...dl,
      deadlineDate: new Date(dl.deadlineDate)
    }))
  };
};

export const getStoredStudyPlan = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !parsed.name ||
      !parsed.targetYear ||
      !parsed.tasks ||
      !Array.isArray(parsed.tasks) ||
      parsed.tasks.length === 0
    ) {
      return null;
    }
    return hydratePlanDates(parsed);
  } catch (err) {
    console.error("Failed to parse stored study plan:", err);
    return null;
  }
};

export const saveStudyPlanToStorage = (studyPlan) => {
  try {
    if (!studyPlan) return false;
    const payload = {
      ...studyPlan,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Failed to save study plan to localStorage:", err);
    return false;
  }
};

export const resetStoredStudyPlan = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return null;
  } catch (err) {
    console.error("Error clearing local storage:", err);
    return null;
  }
};
