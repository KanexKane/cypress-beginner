const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const SHEET_ID = "YOUR_SHEET_ID"; // <<< เอาจาก URL Google Sheet และใช้เฉพาะ ID เท่านั้น เช่น https://docs.google.com/spreadsheets/d/<YOUR_SHEET_ID>/edit?gid=0#gid=0 ก็เอามาแค่ <YOUR_SHEET_ID>

async function authorize() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return await auth.getClient();
}

async function updateTestResultsToSheet(results = []) {
    const authClient = await authorize();
    const sheets = google.sheets({ version: "v4", auth: authClient });
    const timestamp = new Date().toLocaleString();

    try {

        const getSheet = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: "Test!A1:L100", // <<< Test คือชื่อ Sheet ถ้าชีตไม่มีชื่อ จะชื่อ Sheet1
        });

        const rows = getSheet.data.values;

        const updates = [];

        for (let i = 0; i < results.length; i++) {
            const { title, state } = results[i];
            const testIdMatch = title.match(/TC-\d+/);

            if (!testIdMatch) continue;

            const testId = testIdMatch[0];
            const rowIndex = rows.findIndex(row => row[0] === testId);

            if (rowIndex !== -1) {
                // Google Sheets API uses 1-based index and includes header, so add 2
                const sheetRow = rowIndex + 1;
                const status = state === 'failed' ? 'FAILED' : 'PASSED';

                updates.push({
                    range: `Test!J${sheetRow}`, // Status column <<< Test คือชื่อ Sheet ถ้าชีตไม่มีชื่อ จะชื่อ Sheet1
                    values: [[status]],
                });

                updates.push({
                    range: `Test!K${sheetRow}`, // Date column <<< Test คือชื่อ Sheet ถ้าชีตไม่มีชื่อ จะชื่อ Sheet1
                    values: [[timestamp]],
                });
            }
        }

        const batchUpdate = {
            spreadsheetId: SHEET_ID,
            resource: { data: updates, valueInputOption: 'RAW' },
        };

        await sheets.spreadsheets.values.batchUpdate(batchUpdate);

    } catch (error) {
        console.error("❌ Error updating sheet by TC:", error.message);
    }
}


module.exports = updateTestResultsToSheet;
