const {
  contextBridge,
  ipcRenderer 
} = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (_, ...args) => func(...args))
});
