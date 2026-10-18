const { contextBridge, ipcRenderer } = require('electron');

const SETTINGS_KEY = 'settings';

contextBridge.exposeInMainWorld('taskbarHero', {
  saveGame: (data) => ipcRenderer.invoke('save-game', data),
  loadGame: () => ipcRenderer.invoke('load-game'),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', Boolean(ignore)),
  openInventory: () => ipcRenderer.send('open-inventory'),
  openSettings: () => ipcRenderer.send('open-settings'),
  onProvideInventorySync: (callback) => ipcRenderer.on('provide-inventory-sync', callback),
  sendInventorySync: (data) => ipcRenderer.send('inventory-sync-data', data),
  onEquipItem: (callback) => ipcRenderer.on('equip-item', (_evt, payload) => callback(payload)),
  onRecruitHero: (callback) => ipcRenderer.on('recruit-hero', (_evt, classId) => callback(classId))
});
