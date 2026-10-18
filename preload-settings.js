const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskbarHeroSettings', {
  load: () => ipcRenderer.invoke('load-settings'),
  save: (settings) => ipcRenderer.invoke('save-settings', settings)
});
