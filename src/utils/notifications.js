export const isNotificationSupported = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("Notification permission request error:", err);
    return "denied";
  }
};

export const sendTaskNotification = (incompleteTasks) => {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;

  const count = incompleteTasks.length;
  if (count === 0) return;

  const title = `🎯 GATE 2028: ${count} Incomplete Focus Task${count > 1 ? "s" : ""} Today!`;
  const taskDetails = incompleteTasks
    .slice(0, 3)
    .map((t) => `• ${t.subjectName ? `[${t.subjectName}] ` : ""}${t.topicName || t.text}`)
    .join("\n");

  const body = `Evening 5:00 PM Reminder:\n${taskDetails}${
    count > 3 ? `\n...and ${count - 3} more` : ""
  }\n\nTap to complete your GATE 2028 targets!`;

  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: "./pwa-192.png",
        badge: "./pwa-192.png",
        vibrate: [200, 100, 200, 100, 200],
        tag: "gate-5pm-daily-reminder",
        renotify: true,
        data: { url: "./" }
      });
    });
  } else {
    try {
      new Notification(title, {
        body,
        icon: "./pwa-192.png"
      });
    } catch (e) {
      console.warn("Desktop notification fallback error:", e);
    }
  }
};

export const generateSmsDraftUrl = (incompleteTasks) => {
  const count = incompleteTasks.length;
  if (count === 0) {
    const message = encodeURIComponent("🎉 GATE 2028: All priority focus tasks completed for today!");
    return `sms:?body=${message}`;
  }

  const taskList = incompleteTasks
    .map((t, idx) => `${idx + 1}. ${t.subjectName ? `[${t.subjectName}] ` : ""}${t.topicName || t.text}`)
    .join("\n");

  const message = encodeURIComponent(
    `🎯 GATE 2028 5:00 PM Task Reminder:\nYou have ${count} incomplete task(s) today:\n\n${taskList}\n\nKeep pushing for GATE 2028!`
  );

  return `sms:?body=${message}`;
};

export const checkAndTrigger5pmReminder = (todaysTasks) => {
  const incomplete = todaysTasks.filter((t) => !t.completed);
  if (incomplete.length === 0) return;

  const now = new Date();
  const currentHour = now.getHours();
  const dateKey = now.toISOString().split("T")[0];
  const lastNotifiedDate = localStorage.getItem("gate_last_5pm_notified");

  if (currentHour >= 17 && lastNotifiedDate !== dateKey) {
    sendTaskNotification(incomplete);
    localStorage.setItem("gate_last_5pm_notified", dateKey);
  }
};
