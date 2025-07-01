const fs = require("fs");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const logFile = path.join(
  logsDir,
  `update-log-${new Date().toISOString().slice(0, 10)}.txt`
);

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
}

function setupAutoUpdates(mainWindow) {
  autoUpdater.on("checking-for-update", () => {
    log("Checking for updates...");
  });

  autoUpdater.on("update-available", (info) => {
    log(`Update available: v${info.version}. Downloading...`);
  });

  autoUpdater.on("update-not-available", () => {
    log("No updates found.");
  });

  autoUpdater.on("error", (err) => {
    log(`Update error: ${err.message || err}`);
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = progress.percent.toFixed(1);
    log(`Downloading update: ${percent}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    log("Update downloaded. Restart to apply.");
  });

  autoUpdater.checkForUpdatesAndNotify();
}

module.exports = { setupAutoUpdates };
