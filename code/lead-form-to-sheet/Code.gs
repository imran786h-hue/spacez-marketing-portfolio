/**
 * Google Ads lead form emails to Google Sheet.
 *
 * Bound to a Google Sheet. Run setup() once to create a 15-minute trigger.
 * Each run searches Gmail for new lead form notification emails, adds one
 * row per lead, skips leads already in the sheet (same date + same phone
 * digits) and labels the thread so it is not read again.
 *
 * Reference version: field labels depend on your own lead form questions.
 * Google Ads only allows its pre-approved question wording, so change the
 * answer options, not the question text, or update LABELS below.
 */

const SHEET_NAME = 'Leads';
const DONE_LABEL = 'Lead-Imported';
const QUERY = 'from:ads-account-noreply@google.com subject:"Lead form response received" -label:' + DONE_LABEL;

// Header in the sheet -> list of labels to look for in the email, first match wins.
const LABELS = {
  'Name': ['Full name', 'Name'],
  'Phone': ['Phone number', 'Phone'],
  'Email': ['Email'],
  'Company': ['Company name', 'Company'],
  'Guests': ['What is the estimated number of guests?', 'How many people is this for?'],
  'Purpose': ['What is the purpose of this booking?', 'What do you need?'],
};
const HEADERS = ['Lead date', 'Name', 'Phone', 'Email', 'Company', 'Guests', 'Purpose', 'Status', 'Notes'];

function setup() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'importLeads')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('importLeads').timeBased().everyMinutes(15).create();
  getSheet_();
}

function importLeads() {
  const sheet = getSheet_();
  const label = GmailApp.getUserLabelByName(DONE_LABEL) || GmailApp.createLabel(DONE_LABEL);
  const seen = existingKeys_(sheet);
  const threads = GmailApp.search(QUERY, 0, 50);

  threads.forEach(thread => {
    thread.getMessages().forEach(msg => {
      const body = msg.getPlainBody();
      const lead = {};
      Object.keys(LABELS).forEach(h => { lead[h] = findValue_(body, LABELS[h]); });

      const date = Utilities.formatDate(msg.getDate(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      const key = date + '|' + digits_(lead['Phone']);
      if (seen.has(key)) return;
      seen.add(key);

      sheet.appendRow([date, lead['Name'], lead['Phone'], lead['Email'], lead['Company'],
                       lead['Guests'], lead['Purpose'], 'New', '']);
    });
    thread.addLabel(label);
  });
}

// Finds "Label: value" on one line, or the label on its own line with the value on the next.
function findValue_(body, labels) {
  const lines = body.split(/\r?\n/).map(l => l.trim());
  for (const label of labels) {
    const lower = label.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.startsWith(lower + ':')) return lines[i].slice(label.length + 1).trim();
      if (line === lower) {
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j]) return lines[j];
        }
      }
    }
  }
  return '';
}

function existingKeys_(sheet) {
  const keys = new Set();
  const last = sheet.getLastRow();
  if (last < 2) return keys;
  sheet.getRange(2, 1, last - 1, 3).getDisplayValues().forEach(r => {
    keys.add(r[0] + '|' + digits_(r[2]));
  });
  return keys;
}

function digits_(s) {
  return String(s || '').replace(/\D/g, '').slice(-10);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
