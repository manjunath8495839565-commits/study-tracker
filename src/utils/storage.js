import { buildInitialSyllabusState } from "../data/syllabusData";

const STORAGE_KEY = "GATE_2028_STUDY_TRACKER_V1";

export const getStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    
    const initial = buildInitialSyllabusState();
    if (!parsed.syllabus || parsed.syllabus.length < initial.length) {
      return getDefaultState();
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse local storage state, resetting to initial:", err);
    return getDefaultState();
  }
};

export const getDefaultState = () => {
  return {
    version: "1.0",
    lastSaved: new Date().toISOString(),
    dailyGoalPace: 3,
    googleSheetUrl: "",
    autoSyncEnabled: false,
    streakData: {
      currentStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      history: [new Date().toISOString().split("T")[0]]
    },
    attemptsLog: [],
    customTasks: [],
    syllabus: buildInitialSyllabusState()
  };
};

export const saveStateToLocalStorage = (state) => {
  try {
    const payload = {
      ...state,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
    return false;
  }
};

export const resetStoredState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return getDefaultState();
  } catch (err) {
    console.error("Error clearing local storage:", err);
    return getDefaultState();
  }
};
