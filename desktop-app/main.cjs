const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('node:path');

const APP_ID = 'com.opencityrise.desktop';
let mainWindow = null;

app.setAppUserModelId(APP_ID);
// Keep Chromium hardware acceleration enabled by default. Do not force a software renderer.
app.commandLine.appendSwitch('enable-gpu-rasterization');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0b1521',
    title: 'Open City Rise',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  Menu.setApplicationMenu(null);

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') {
      event.preventDefault();
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    } else if (input.key === 'Escape' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (details.reason !== 'clean-exit') {
      mainWindow.webContents.executeJavaScript(
        "document.body.dataset.desktopRenderError = 'true';"
      ).catch(() => {});
    }
  });

  mainWindow.loadFile(path.join(app.getAppPath(), 'open-city-rise.html')).catch(() => {
    mainWindow?.show();
    mainWindow?.webContents.openDevTools({ mode: 'detach' });
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

ipcMain.handle('open-city-rise:version', () => app.getVersion());

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
