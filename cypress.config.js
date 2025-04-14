const { defineConfig } = require("cypress");
const sendTelegramMessage = require("./notify");
const updateTestResultsToSheet = require("./google-sheet");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        const failedTests = [];
        const forSheetTests = [];

        results.runs.forEach(run => {
          run.tests.forEach(test => {
            if (test.state === 'failed') {
              failedTests.push(`• ${run.spec.name} - ${test.title.join(' > ')}`);
            }

            forSheetTests.push({
              title: test.title.join(' > '),
              state: test.state
            });
          });
        });

        if (failedTests.length > 0) {
          const summary = `❌ *Cypress Test Summary: ${failedTests.length} test(s) failed*\n\n` + failedTests.join('\n');

          await sendTelegramMessage(summary.replace(/"/g, '\\"'))
        }

        // ✨ อัปเดต Google Sheet ไม่ว่าจะผ่านหรือล้ม
        await updateTestResultsToSheet(forSheetTests);
      });
    },
  },
});
