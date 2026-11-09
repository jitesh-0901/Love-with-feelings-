# 📊 Google Sheets Setup Guide — "For Ovya" Responses

This guide explains how to connect a private Google Sheet to receive Ovya's optional answers and forgiveness choice using **Google Apps Script** (completely free and secure, requiring zero backend servers or secret API keys).

---

### Step 1: Create a New Google Sheet
1. Open [Google Sheets](https://sheets.new).
2. Name the sheet: **`For Ovya — Private Responses`**.
3. In row 1, set up the following column headers:
   - **Column A**: `Timestamp`
   - **Column B**: `Forgiveness Decision`
   - **Column C**: `Felt Something?`
   - **Column D**: `Understood Feelings?`
   - **Column E**: `Want to Talk?`
   - **Column F**: `Needs Most Right Now`
   - **Column G**: `Personal Message / Note`
   - **Column H**: `Consent Given`

---

### Step 2: Open Google Apps Script
1. In your Google Sheet menu, click **Extensions** → **Apps Script**.
2. Erase any code in `Code.gs` and paste the following script:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = new Date();
    var forgiveness = data.forgivenessAnswer || "Not answered";
    var q1 = data.feltSomething || "—";
    var q2 = data.understoodFeelings || "—";
    var q3 = data.wantToTalk || "—";
    var q4 = data.needsMost || "—";
    var note = data.personalNote || "—";
    var consent = data.consentToSave ? "Yes" : "No";

    sheet.appendRow([
      timestamp,
      forgiveness,
      q1,
      q2,
      q3,
      q4,
      note,
      consent
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### Step 3: Deploy as Web App
1. In the Apps Script editor, click the blue **Deploy** button (top right) → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description**: `Ovya Apology Responses`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial: This allows the frontend website to send responses without exposing any private login credentials)*.
4. Click **Deploy**.
5. Copy the generated **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 4: Add the URL to the Website
You can connect the URL in either of two ways:
1. **Via Website UI**: Click the ⚙️ Settings gear icon in the top header of the website, paste your Web App URL, and tap **Save Endpoint**.
2. **Via `.env` file**: Create a `.env` file in the project folder with:
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

*Note: If no URL is provided, the website will safely store responses locally in the browser so that nothing is ever lost.*
