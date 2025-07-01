const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  session,
} = require("electron");
const path = require("path");
const fetch = require("cross-fetch");
const { ElectronBlocker } = require("@ghostery/adblocker-electron");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let tabs = [];
let currentTab = 0;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  setupAutoUpdates(mainWindow);

  await setupAdblock();

  mainWindow.loadFile("index.html");

  createTab("https://duckduckgo.com");
}

async function setupAdblock() {
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  blocker.enableBlockingInSession(session.defaultSession);
}

async function createTab(url) {
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  tabs.push(view);
  const index = tabs.length - 1;
  switchTab(index);
  view.webContents.loadURL(url);

  injectDarkAndSponsorBlock(view);

  return index;
}

async function switchTab(index) {
  if (index < 0 || index >= tabs.length) return;

  if (mainWindow.getBrowserView()) {
    mainWindow.removeBrowserView(mainWindow.getBrowserView());
  }

  const view = tabs[index];
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 0, y: 100, width: 1400, height: 800 });
  view.setAutoResize({ width: true, height: true });
  currentTab = index;
}

ipcMain.handle("new-tab", () => {
  return createTab("https://duckduckgo.com");
});

ipcMain.on("switch-tab", (_, index) => {
  switchTab(index);
});

ipcMain.on("navigate", (_, url) => {
  const view = tabs[currentTab];
  const isURL = url.startsWith("http://") || url.startsWith("https://");
  const target = isURL
    ? url
    : `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
  view.webContents.loadURL(target);
});

async function injectDarkAndSponsorBlock(view) {
  view.webContents.on("did-finish-load", async () => {
    view.webContents.insertCSS(`
      html, body {
        background-color: #121212 !important;
        color: #e0e0e0 !important;
      }
      * {
        background-color: transparent !important;
        color: inherit !important;
        border-color: #555 !important;
      }
      a {
        color: #8ab4f8 !important;
      }
      input, textarea, select {
        background-color: #1e1e1e !important;
        color: #ffffff !important;
        border: 1px solid #444 !important;
      }
    `);

    const url = view.webContents.getURL();
    if (url.includes("youtube.com/watch")) {
      try {
        await view.webContents.executeJavaScript(`
          (async () => {
            const vid = new URL(location.href).searchParams.get('v');
            if (!vid) return;
            const resp = await fetch('https://sponsor.ajay.app/api/skipSegments?videoID=' + vid);
            if (!resp.ok) return;
            const segs = await resp.json();
            const video = document.querySelector('video');
            if (!video) return;
            video.addEventListener('timeupdate', () => {
              segs.forEach(segment => {
                const [start, end] = segment.segment;
                if (video.currentTime > start && video.currentTime < end) {
                  video.currentTime = end;
                }
              });
            });
          })();
        `);
      } catch (e) {
        console.error("SponsorBlock injection failed:", e);
      }
    }
  });
}

app.whenReady().then(createWindow);

app.commandLine.appendSwitch("disable-gpu");

function setupAutoUpdates(mainWindow) {
  autoUpdater.on("checking-for-update", () => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      buttons: [],
      title: "Checking for Updates",
      message: "Xylo Browser is checking for updates...",
    });
  });

  ipcMain.handle("check-for-updates", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on("update-available", (info) => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      buttons: [],
      title: "Update Available",
      message: `An update to version ${info.version} is available.\nDownloading now...`,
    });
  });

  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      buttons: [],
      title: "No Updates Found",
      message: "You're already running the latest version.",
    });
  });

  autoUpdater.on("error", (err) => {
    dialog.showErrorBox(
      "Update Error",
      err == null ? "unknown" : (err.stack || err).toString()
    );
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = progress.percent.toFixed(1);
    mainWindow.setTitle(`Downloading update... ${percent}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox(mainWindow, {
        type: "question",
        buttons: ["Restart Now", "Later"],
        defaultId: 0,
        cancelId: 1,
        title: "Update Ready",
        message:
          "Update downloaded. Do you want to restart now to apply the update?",
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.checkForUpdatesAndNotify();
}

ipcMain.on("restart-to-update", () => {
  autoUpdater.quitAndInstall();
});
