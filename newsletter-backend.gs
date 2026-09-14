const SPREADSHEET_ID = '1PZ29ylpP2RsrEHMcHnmeH2aPHryHmyjqJoIBuSnPy2M';
const SHEET_NAME = 'Subscribers';

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const email = String(p.email || '').trim().toLowerCase();
    const name = String(p.name || '').trim();
    const source = String(p.source || 'Vice City Sinner website').trim();
    const honeypot = String(p.website || '').trim();

    if (honeypot) return htmlResponse('ok');
    if (!isValidEmail(email)) return htmlResponse('invalid');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('Subscribers sheet not found.');

      const lastRow = sheet.getLastRow();
      const rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 7).getValues() : [];
      let existingRow = 0;

      for (let i = 0; i < rows.length; i++) {
        if (String(rows[i][0] || '').trim().toLowerCase() === email) {
          existingRow = i + 2;
          break;
        }
      }

      const now = new Date();

      if (existingRow) {
        const tokenCell = sheet.getRange(existingRow, 7);
        let token = String(tokenCell.getValue() || '').trim();
        if (!token) {
          token = newToken();
          tokenCell.setValue(token);
        }

        sheet.getRange(existingRow, 2).setValue(name);
        sheet.getRange(existingRow, 3).setValue(now);
        sheet.getRange(existingRow, 4).setValue(source);
        sheet.getRange(existingRow, 5).setValue('Active');
        sheet.getRange(existingRow, 6).clearContent();
        return htmlResponse('active');
      }

      sheet.appendRow([email, name, now, source, 'Active', '', newToken()]);
      return htmlResponse('subscribed');
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return htmlResponse('error');
  }
}

function doGet(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    if (String(p.action || '') !== 'unsubscribe') {
      return brandedPage('Vice City Sinner', 'Nothing to see here.');
    }

    const token = String(p.token || '').trim();
    if (!token) return brandedPage('Unsubscribe', 'That unsubscribe link is incomplete.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) return brandedPage('Unsubscribe', 'That link is no longer valid.');

      const tokens = sheet.getRange(2, 7, lastRow - 1, 1).getValues();
      for (let i = 0; i < tokens.length; i++) {
        if (String(tokens[i][0] || '').trim() === token) {
          const row = i + 2;
          sheet.getRange(row, 5).setValue('Unsubscribed');
          sheet.getRange(row, 6).setValue(new Date());
          return brandedPage('You’re unsubscribed.', 'No hard feelings. You can sign up again anytime.');
        }
      }

      return brandedPage('Unsubscribe', 'That link is no longer valid.');
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return brandedPage('Unsubscribe', 'Something went wrong. Try again later.');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function newToken() {
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
}

function htmlResponse(status) {
  return HtmlService.createHtmlOutput('<!doctype html><html><body data-status="' + status + '"></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function brandedPage(title, message) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + safeTitle + '</title></head>' +
    '<body style="margin:0;background:#050505;color:#f4f0e8;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box">' +
    '<main style="max-width:620px;border:1px solid #a935ff;padding:36px;text-align:center;background:#090909">' +
    '<div style="color:#c6ff2e;text-transform:uppercase;letter-spacing:.18em;font-size:12px;margin-bottom:14px">The Vice City Sinner</div>' +
    '<h1 style="color:#d43cff;margin:0 0 14px;font-size:34px">' + safeTitle + '</h1>' +
    '<p style="line-height:1.6;margin:0">' + safeMessage + '</p>' +
    '</main></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
