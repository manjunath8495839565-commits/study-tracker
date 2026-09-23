const TIMER_STORAGE_KEY = "GATE_TOPIC_TIMERS_V1";

export const MAX_CONTINUOUS_RUN_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export const getStoredTimerState = () => {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return { activeTopicId: null, timers: {}, autoPausedTopicId: null };
    const parsed = JSON.parse(raw);
    const now = Date.now();
    let autoPausedTopicId = null;

    if (parsed.activeTopicId && parsed.timers?.[parsed.activeTopicId]) {
      const activeTimer = parsed.timers[parsed.activeTopicId];
      if (activeTimer.status === "RUNNING" && activeTimer.startTimestamp) {
        const runDuration = now - activeTimer.startTimestamp;
        if (runDuration >= MAX_CONTINUOUS_RUN_MS) {
          activeTimer.accumulatedMs = (activeTimer.accumulatedMs || 0) + MAX_CONTINUOUS_RUN_MS;
          activeTimer.status = "PAUSED";
          activeTimer.startTimestamp = null;
          autoPausedTopicId = parsed.activeTopicId;
          parsed.activeTopicId = null;
        }
      }
    }

    saveTimerState(parsed);
    return {
      activeTopicId: parsed.activeTopicId || null,
      timers: parsed.timers || {},
      autoPausedTopicId
    };
  } catch (err) {
    console.error("Failed to parse timer state:", err);
    return { activeTopicId: null, timers: {}, autoPausedTopicId: null };
  }
};

export const saveTimerState = (state) => {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save timer state:", err);
  }
};

export const getElapsedMs = (timer, now = Date.now()) => {
  if (!timer) return 0;
  if (timer.status === "RUNNING" && timer.startTimestamp) {
    return (timer.accumulatedMs || 0) + Math.max(0, now - timer.startTimestamp);
  }
  return timer.accumulatedMs || 0;
};

export const formatStopwatchTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
