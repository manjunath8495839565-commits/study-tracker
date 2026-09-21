// Google Sheets Integration & Web App Sync Module

export const GOOGLE_APPS_SCRIPT_CODE = `
// ====================================================================
// GATE 2028 STUDY TRACKER — GOOGLE APPS SCRIPT BACKEND DATABASE CODE
// Paste this code into Google Sheets -> Extensions -> Apps Script
// Save & Deploy as Web App -> Access: "Anyone"
// ====================================================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure all required sheets exist
    var sheets = ['Syllabus', 'Tasks', 'Attempts', 'Revisions', 'MockTests'];
    sheets.forEach(function(sName) {
      if (!ss.getSheetByName(sName)) {
        ss.insertSheet(sName);
      }
    });

    if (e.postData && e.postData.contents) {
      var payload = JSON.parse(e.postData.contents);
      if (payload.action === 'SAVE_ALL') {
        saveAllData(ss, payload.data);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'All data saved to Google Sheets' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Default GET return
    var data = readAllData(ss);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: data }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function saveAllData(ss, data) {
  // 1. Update Tasks sheet
  var taskSheet = ss.getSheetByName('Tasks');
  taskSheet.clear();
  taskSheet.appendRow(['TaskID', 'SubjectID', 'SubjectName', 'TopicName', 'Type', 'Label', 'Status', 'Questions', 'Hours', 'CompletedAt']);

  if (data.syllabus) {
    data.syllabus.forEach(function(subject) {
      subject.topics.forEach(function(topic) {
        topic.tasks.forEach(function(task) {
          taskSheet.appendRow([
            task.id,
            subject.id,
            subject.name,
            topic.name,
            task.type,
            task.label,
            task.completed ? 'Done' : 'Pending',
            task.questionsLogged || 0,
            task.hoursSpent || 0,
            task.completedAt || ''
          ]);
        });
      });
    });
  }

  // 2. Update Syllabus sheet
  var sylSheet = ss.getSheetByName('Syllabus');
  sylSheet.clear();
  sylSheet.appendRow(['SubjectID', 'SubjectName', 'Stream', 'TargetMonth', 'TopicName', 'Accuracy']);

  if (data.syllabus) {
    data.syllabus.forEach(function(subject) {
      subject.topics.forEach(function(topic) {
        sylSheet.appendRow([
          subject.id,
          subject.name,
          subject.stream,
          subject.targetMonth,
          topic.name,
          topic.accuracy || 0
        ]);
      });
    });
  }
}

function readAllData(ss) {
  return { lastSynced: new Date().toISOString() };
}
`;

export const syncToGoogleSheets = async (webAppUrl, fullState) => {
  if (!webAppUrl || !webAppUrl.startsWith("http")) {
    throw new Error("Invalid Google Apps Script Web App URL");
  }

  try {
    const response = await fetch(webAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "SAVE_ALL",
        data: fullState
      })
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Google Sheets sync failed:", err);
    throw err;
  }
};
