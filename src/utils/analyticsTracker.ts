// Silent Real-Time Event & Device Analytics Tracker
// Records every button click, page visit, device details, and question answers directly to Google Sheets!

import { getDeviceDetails } from './deviceDetector';

export const TARGET_SHEET_ID = '1Ufy115dOz_r0W40sSfUTeD7WrXks4GO7_3OYsceyxW8';
export const TARGET_SHEET_URL = `https://docs.google.com/spreadsheets/d/${TARGET_SHEET_ID}/edit`;

const STORAGE_KEY_SCRIPT_URL = 'ovi_sheets_script_url';
const STORAGE_KEY_EVENTS = 'ovi_analytics_events';
const SESSION_KEY = 'ovi_visit_session_id';

export const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxSgK4WKa4RkxaNH1Li8xeG_3684KTBnCFqAG1l3U211GFFo6AUOPc4dAwijPZvRnTe/exec';

export interface AnalyticsRecord {
  id: string;
  sessionId?: string;
  timestamp: string;
  action: string;
  details: string;
  device: string;
  osAndBrowser: string;
  screen: string;
  userAgent: string;
  synced?: boolean;
  extra?: Record<string, unknown>;
}

// In-memory session tracking for clean 1-row summary
export interface SessionSummaryState {
  sessionId: string;
  letterRead?: string;
  forgiveness?: string;
  personalNote?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
  q9?: string;
  q10?: string;
  q11?: string;
  q12?: string;
  q13?: string;
  downloadedPdf?: boolean;
  status?: string;
}

const currentSession: SessionSummaryState = {
  sessionId: '',
};

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return 'sess-server';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  currentSession.sessionId = id;
  return id;
};

export const updateSessionSummary = (patch: Partial<SessionSummaryState>): void => {
  Object.assign(currentSession, patch);
};

export const getStoredScriptUrl = (): string => {
  if (typeof window === 'undefined') return DEFAULT_SCRIPT_URL;
  return (
    localStorage.getItem(STORAGE_KEY_SCRIPT_URL) ||
    (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) ||
    DEFAULT_SCRIPT_URL
  );
};

export const setStoredScriptUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim();
  localStorage.setItem(STORAGE_KEY_SCRIPT_URL, cleanUrl);
  if (cleanUrl) {
    syncUnsentEvents();
  }
};

export const getStoredEvents = (): AnalyticsRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearStoredEvents = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_EVENTS);
};

// Generates Super Clean 2-Tab Google Apps Script code:
// Tab 1: ❤️ Ovi ma Summary (1 Clean Row Per Visit with all 11 questions organized)
// Tab 2: 📱 Activity Timeline (Detailed Clicks with auto-adjusted readable column widths)
export const getRecommendedAppsScriptCode = (): string => {
  return `// Paste this in Extensions > Apps Script of your Google Sheet:
// https://docs.google.com/spreadsheets/d/${TARGET_SHEET_ID}/edit

var SHEET_ID = '${TARGET_SHEET_ID}';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(contents);

    var sessionId = data.sessionId || "default-session";
    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    var device = data.device || "Mobile";

    // ==========================================
    // TAB 1: ❤️ Ovi ma Summary (1 Single Clean Row Per Visit)
    // ==========================================
    var summarySheet = ss.getSheetByName("❤️ Ovi ma Summary");
    if (!summarySheet) {
      var allSheets = ss.getSheets();
      if (allSheets.length > 0 && (allSheets[0].getLastRow() <= 1 || allSheets[0].getName() === "Sheet1" || allSheets[0].getName() === "soory")) {
        summarySheet = allSheets[0];
        summarySheet.setName("❤️ Ovi ma Summary");
        summarySheet.clear();
      } else {
        summarySheet = ss.insertSheet("❤️ Ovi ma Summary", 0);
      }
    }

    if (summarySheet.getLastRow() === 0) {
      summarySheet.appendRow([
        "Visit Time (IST)",
        "Device Name",
        "Letter Readed Perfectly? 📖",
        "Forgiveness Decision ❤️",
        "Her Personal Note 💌",
        "Q1: Love & Care?",
        "Q2: Manipiya?",
        "Q3: Vaazha Aasaiya?",
        "Q4: College Pesuviya?",
        "Q5: Nalla Life Kuda Irupiya?",
        "Q6: Enaku Nee Irupiya?",
        "Q7: Yaarum Venaam Maa?",
        "Q8: Onna Padikkalaama?",
        "Q9: Vittu Poidamaatiya?",
        "Q10: Happy Life-ku Nee Venum?",
        "Q11: Onna Irundha Seri Aagidum?",
        "Q12: Ini Pomatala Maa?",
        "Q13: Option Illa Thana?",
        "Downloaded PDF?",
        "Current Status",
        "Session ID"
      ]);

      var headerRange = summarySheet.getRange(1, 1, 1, 21);
      headerRange.setFontWeight("bold")
        .setBackground("#ffe4ea")
        .setFontColor("#880e4f")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontSize(11);
      summarySheet.setRowHeight(1, 40);

      summarySheet.setColumnWidth(1, 185);
      summarySheet.setColumnWidth(2, 160);
      summarySheet.setColumnWidth(3, 210);
      summarySheet.setColumnWidth(4, 210);
      summarySheet.setColumnWidth(5, 300);
      summarySheet.setColumnWidth(6, 170);
      summarySheet.setColumnWidth(7, 150);
      summarySheet.setColumnWidth(8, 170);
      summarySheet.setColumnWidth(9, 170);
      summarySheet.setColumnWidth(10, 190);
      summarySheet.setColumnWidth(11, 170);
      summarySheet.setColumnWidth(12, 190);
      summarySheet.setColumnWidth(13, 190);
      summarySheet.setColumnWidth(14, 190);
      summarySheet.setColumnWidth(15, 200);
      summarySheet.setColumnWidth(16, 220);
      summarySheet.setColumnWidth(17, 190);
      summarySheet.setColumnWidth(18, 180);
      summarySheet.setColumnWidth(19, 140);
      summarySheet.setColumnWidth(20, 190);
      summarySheet.hideColumns(21);
    }

    // Check if row already exists for this visit session (Column 21: Session ID)
    var summaryValues = summarySheet.getDataRange().getValues();
    var targetRow = -1;
    for (var r = 1; r < summaryValues.length; r++) {
      if (summaryValues[r][20] === sessionId) {
        targetRow = r + 1;
        break;
      }
    }

    if (targetRow === -1) {
      // New visit: Append single neat row
      summarySheet.appendRow([
        timestamp,
        device,
        data.letterRead || "-",
        data.forgiveness || "-",
        data.personalNote || "-",
        data.q1 || "-",
        data.q2 || "-",
        data.q3 || "-",
        data.q4 || "-",
        data.q5 || "-",
        data.q6 || "-",
        data.q7 || "-",
        data.q8 || "-",
        data.q9 || "-",
        data.q10 || "-",
        data.q11 || "-",
        data.q12 || "-",
        data.q13 || "-",
        data.downloadedPdf ? "Yes 📥" : "-",
        data.status || "Opened Website",
        sessionId
      ]);
      targetRow = summarySheet.getLastRow();
      summarySheet.getRange(targetRow, 1, 1, 20).setWrap(true).setVerticalAlignment("middle");
      summarySheet.setRowHeight(targetRow, 34);
    } else {
      // Existing visit: Update columns in place!
      if (data.letterRead) summarySheet.getRange(targetRow, 3).setValue(data.letterRead).setFontWeight("bold");
      if (data.forgiveness) summarySheet.getRange(targetRow, 4).setValue(data.forgiveness).setFontWeight("bold");
      if (data.personalNote) summarySheet.getRange(targetRow, 5).setValue(data.personalNote).setFontStyle("italic");
      if (data.q1) summarySheet.getRange(targetRow, 6).setValue(data.q1);
      if (data.q2) summarySheet.getRange(targetRow, 7).setValue(data.q2);
      if (data.q3) summarySheet.getRange(targetRow, 8).setValue(data.q3);
      if (data.q4) summarySheet.getRange(targetRow, 9).setValue(data.q4);
      if (data.q5) summarySheet.getRange(targetRow, 10).setValue(data.q5);
      if (data.q6) summarySheet.getRange(targetRow, 11).setValue(data.q6);
      if (data.q7) summarySheet.getRange(targetRow, 12).setValue(data.q7);
      if (data.q8) summarySheet.getRange(targetRow, 13).setValue(data.q8);
      if (data.q9) summarySheet.getRange(targetRow, 14).setValue(data.q9);
      if (data.q10) summarySheet.getRange(targetRow, 15).setValue(data.q10);
      if (data.q11) summarySheet.getRange(targetRow, 16).setValue(data.q11);
      if (data.q12) summarySheet.getRange(targetRow, 17).setValue(data.q12);
      if (data.q13) summarySheet.getRange(targetRow, 18).setValue(data.q13);
      if (data.downloadedPdf) summarySheet.getRange(targetRow, 19).setValue("Yes 📥");
      if (data.status) summarySheet.getRange(targetRow, 20).setValue(data.status);
    }

    // ==========================================
    // TAB 2: 📱 Activity Timeline (Detailed Chronological Clicks)
    // ==========================================
    var logSheet = ss.getSheetByName("📱 Activity Timeline");
    if (!logSheet) {
      logSheet = ss.insertSheet("📱 Activity Timeline", 1);
    }

    if (logSheet.getLastRow() === 0) {
      logSheet.appendRow([
        "Timestamp (IST)",
        "Action",
        "Details",
        "Device",
        "OS & Browser"
      ]);
      logSheet.getRange(1, 1, 1, 5)
        .setFontWeight("bold")
        .setBackground("#f1f5f9")
        .setFontColor("#1e293b")
        .setHorizontalAlignment("center");
      logSheet.setRowHeight(1, 30);
      logSheet.setColumnWidth(1, 190);
      logSheet.setColumnWidth(2, 220);
      logSheet.setColumnWidth(3, 320);
      logSheet.setColumnWidth(4, 160);
      logSheet.setColumnWidth(5, 200);
    }

    logSheet.appendRow([
      timestamp,
      data.action || "Action",
      data.details || "-",
      device,
      data.osAndBrowser || "-"
    ]);
    logSheet.getRange(logSheet.getLastRow(), 1, 1, 5).setWrap(true).setVerticalAlignment("middle");

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "ready", 
    message: "Ovi ma tracking service is online!" 
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
};

// Syncs unsent events to Google Sheets
export const syncUnsentEvents = async (): Promise<void> => {
  const scriptUrl = getStoredScriptUrl();
  if (!scriptUrl) return;

  const events = getStoredEvents();
  const unsent = events.filter((ev) => !ev.synced);
  if (unsent.length === 0) return;

  for (const ev of unsent.reverse()) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(ev),
      });
      ev.synced = true;
    } catch {
      break;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch {
    // Ignore
  }
};

// Send a test ping to verify Google Sheets integration
export const sendTestPing = async (): Promise<boolean> => {
  const scriptUrl = getStoredScriptUrl();
  if (!scriptUrl) return false;

  const dev = getDeviceDetails();
  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const testRecord = {
    sessionId: getOrCreateSessionId(),
    timestamp: `${timestamp} IST`,
    action: '⚡ Test Verification Ping',
    details: 'Google Sheets sync is connected and working perfectly!',
    device: dev.deviceName,
    osAndBrowser: `${dev.os} • ${dev.browser}`,
    screen: `${dev.screenResolution} (View: ${dev.viewportSize})`,
    userAgent: dev.userAgent,
    letterRead: 'Yes, 100% Read ♡ (Test)',
    forgiveness: 'YES, I FORGIVE YOU (Test)',
    personalNote: 'Test note: I love you Ovi ma ♡',
    q1: 'Yes',
    q2: 'Yes',
    q3: 'Yes',
    q4: 'Yes',
    q5: 'Mudiyum',
    q6: 'Irupen',
    q7: 'Ok',
    q8: 'Ok va',
    q9: 'Irupa',
    q10: 'Na iruka',
    q11: 'Irupa',
    q12: 'Pomata',
    q13: 'Option Illa',
    status: 'Verified Connection ⚡',
  };

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(testRecord),
    });
    return true;
  } catch {
    return false;
  }
};

// Silent real-time event logger with clean summary payload
export const logAnalyticsEvent = async (
  action: string,
  details: string = '-',
  extra?: Record<string, unknown>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const dev = getDeviceDetails();
  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const scriptUrl = getStoredScriptUrl();
  const sessionId = getOrCreateSessionId();

  const record: AnalyticsRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId,
    timestamp: `${timestamp} IST`,
    action,
    details,
    device: dev.deviceName,
    osAndBrowser: `${dev.os} • ${dev.browser}`,
    screen: `${dev.screenResolution} (View: ${dev.viewportSize})`,
    userAgent: dev.userAgent,
    synced: !!scriptUrl,
    extra,
  };

  // Full payload including structured answers for 1-Row Summary table
  const payload = {
    sessionId,
    timestamp: record.timestamp,
    action: record.action,
    details: record.details,
    device: record.device,
    osAndBrowser: record.osAndBrowser,
    screen: record.screen,
    userAgent: record.userAgent,
    letterRead: currentSession.letterRead || (action.includes('Letter') ? 'Opened Envelope 💌' : undefined),
    forgiveness: currentSession.forgiveness,
    personalNote: currentSession.personalNote,
    q1: currentSession.q1,
    q2: currentSession.q2,
    q3: currentSession.q3,
    q4: currentSession.q4,
    q5: currentSession.q5,
    q6: currentSession.q6,
    q7: currentSession.q7,
    q8: currentSession.q8,
    q9: currentSession.q9,
    q10: currentSession.q10,
    q11: currentSession.q11,
    q12: currentSession.q12,
    q13: currentSession.q13,
    downloadedPdf: currentSession.downloadedPdf,
    status: currentSession.status || action,
  };

  // Save locally
  try {
    const existing = getStoredEvents();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(existing.slice(0, 200)));
  } catch {
    // Ignore
  }

  // Transmit to Google Apps Script Web App
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      record.synced = false;
    }
  }
};
