const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('openCityDesktop', Object.freeze({
  isDesktop: true,
  platform: 'win32',
  getVersion: () => ipcRenderer.invoke('open-city-rise:version')
}));
