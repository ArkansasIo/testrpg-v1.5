const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const SAVE_PATH = path.join(app.getPath('userData'), 'save.json');
const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');
const WINDOW_WIDTH = 360;
const WINDOW_HEIGHT = 48;
let mainWindow = null;
let inventoryWindow = null;
let settingsWindow = null;
let tray = null;

function loadJson(filePath, fallback) {
  try {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : fallback;
  } catch (error) {
    console.warn(`Could not read ${path.basename(filePath)}:`, error.message);
    return fallback;
  }
}

function writeJsonAtomically(filePath, value) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(value, null, 2), { mode: 0o600 });
  fs.renameSync(tempPath, filePath);
  return true;
}

function createWindow() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: WINDOW_WIDTH, height: WINDOW_HEIGHT,
    x: Math.max(0, screenW - WINDOW_WIDTH - 8), y: Math.max(0, screenH - WINDOW_HEIGHT),
    frame: false, transparent: true, resizable: false, alwaysOnTop: true,
    skipTaskbar: true, hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.on('closed', () => { mainWindow = null; });
  mainWindow = win;
  return win;
}

function createInventoryWindow() {
  if (inventoryWindow && !inventoryWindow.isDestroyed()) { inventoryWindow.focus(); return inventoryWindow; }
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;
  const width = 380, height = 480;
  inventoryWindow = new BrowserWindow({
    width, height, x: Math.max(0, screenW - width - 20), y: Math.max(0, screenH - height - 70),
    frame: true, resizable: false, alwaysOnTop: true, title: 'Taskbar Hero — Inventory',
    webPreferences: { preload: path.join(__dirname, 'preload-inventory.js'), contextIsolation: true, nodeIntegration: false }
  });
  inventoryWindow.setMenuBarVisibility(false);
  inventoryWindow.loadFile(path.join(__dirname, 'src', 'inventory.html'));
  inventoryWindow.on('closed', () => { inventoryWindow = null; });
  return inventoryWindow;
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) { settingsWindow.focus(); return settingsWindow; }
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;
  settingsWindow = new BrowserWindow({
    width: 390, height: 420, x: Math.max(0, screenW - 410), y: Math.max(0, screenH - 490),
    resizable: false, alwaysOnTop: true, title: 'Taskbar Hero — Settings',
    webPreferences: { preload: path.join(__dirname, 'preload-settings.js'), contextIsolation: true, nodeIntegration: false }
  });
  settingsWindow.setMenuBarVisibility(false);
  settingsWindow.loadFile(path.join(__dirname, 'src', 'settings.html'));
  settingsWindow.on('closed', () => { settingsWindow = null; });
  return settingsWindow;
}

function toggleHero() {
  if (!mainWindow || mainWindow.isDestroyed()) { createWindow(); return; }
  if (mainWindow.isVisible()) mainWindow.hide(); else mainWindow.show();
}

function createTray() {
  try {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray-icon-16.png'));
    tray = new Tray(icon);
    tray.setToolTip('Taskbar Hero');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open Inventory', click: createInventoryWindow },
      { label: 'Settings', click: createSettingsWindow },
      { label: 'Show/Hide Hero Strip', click: toggleHero },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ]));
    tray.on('click', toggleHero);
  } catch (err) {
    console.warn('Tray icon unavailable:', err.message);
  }
}

ipcMain.on('set-ignore-mouse', (_evt, ignore) => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setIgnoreMouseEvents(Boolean(ignore), { forward: true });
});
ipcMain.on('open-inventory', createInventoryWindow);
ipcMain.on('open-settings', createSettingsWindow);
ipcMain.on('request-inventory-sync', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('provide-inventory-sync');
});
ipcMain.on('inventory-sync-data', (_evt, data) => {
  if (inventoryWindow && !inventoryWindow.isDestroyed()) inventoryWindow.webContents.send('inventory-sync-data', data);
});
ipcMain.on('equip-item', (_evt, payload) => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('equip-item', payload);
});
ipcMain.on('recruit-hero', (_evt, classId) => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('recruit-hero', classId);
});

ipcMain.handle('save-game', (_evt, data) => {
  if (!data || typeof data !== 'object' || !Array.isArray(data.party) || !Array.isArray(data.inventory)) {
    throw new TypeError('Invalid game save payload');
  }
  return writeJsonAtomically(SAVE_PATH, data);
});
ipcMain.handle('load-game', () => loadJson(SAVE_PATH, null));
ipcMain.handle('load-settings', () => loadJson(SETTINGS_PATH, {
  mute: false, volume: 0.4, alwaysOnTop: true, clickThrough: true, autosaveSeconds: 30
}));
ipcMain.handle('save-settings', (_evt, settings) => {
  if (!settings || typeof settings !== 'object') throw new TypeError('Invalid settings payload');
  const safe = {
    mute: Boolean(settings.mute),
    volume: Math.min(1, Math.max(0, Number(settings.volume) || 0)),
    alwaysOnTop: settings.alwaysOnTop !== false,
    clickThrough: settings.clickThrough !== false,
    autosaveSeconds: Math.min(300, Math.max(10, Number(settings.autosaveSeconds) || 30))
  };
  const saved = writeJsonAtomically(SETTINGS_PATH, safe);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setAlwaysOnTop(safe.alwaysOnTop, 'screen-saver');
    mainWindow.setIgnoreMouseEvents(safe.clickThrough, { forward: true });
  }
  return saved;
});

app.whenReady().then(() => {
  createWindow();
  createTray();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('before-quit', () => {
  if (tray) { tray.destroy(); tray = null; }
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
