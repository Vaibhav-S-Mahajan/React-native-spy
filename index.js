"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  rnspy: {
    start: (opts) => electron.ipcRenderer.invoke("rnspy:start", opts),
    stop: () => electron.ipcRenderer.invoke("rnspy:stop"),
    getStatus: () => electron.ipcRenderer.invoke("rnspy:status"),
    disconnectClient: (id) => electron.ipcRenderer.invoke("rnspy:disconnect-client", id),
    getLogs: () => electron.ipcRenderer.invoke("rnspy:get-logs"),
    clearLogs: () => electron.ipcRenderer.invoke("rnspy:clear-logs"),
    openInEditor: (opts) => electron.ipcRenderer.invoke("rnspy:open-in-editor", opts),
    symbolicate: (opts) => electron.ipcRenderer.invoke("rnspy:symbolicate", opts),
    sendCommand: (opts) => electron.ipcRenderer.invoke("rnspy:send-command", opts),
    pickProjectFolder: () => electron.ipcRenderer.invoke("rnspy:pick-project-folder"),
    detectProject: (opts) => electron.ipcRenderer.invoke("rnspy:detect-project", opts),
    planSetup: (opts) => electron.ipcRenderer.invoke("rnspy:plan-setup", opts),
    applySetup: (opts) => electron.ipcRenderer.invoke("rnspy:apply-setup", opts),
    removeSetup: (opts) => electron.ipcRenderer.invoke("rnspy:remove-setup", opts),
    resolveRoute: (opts) => electron.ipcRenderer.invoke("rnspy:resolve-route", opts),
    clearRouteCache: (opts) => electron.ipcRenderer.invoke("rnspy:clear-route-cache", opts),
    onEvent: (callback) => {
      const handler = (_event, payload) => callback(payload);
      electron.ipcRenderer.on("rnspy:event", handler);
      return () => electron.ipcRenderer.removeListener("rnspy:event", handler);
    },
    onStatus: (callback) => {
      const handler = (_event, payload) => callback(payload);
      electron.ipcRenderer.on("rnspy:status", handler);
      return () => electron.ipcRenderer.removeListener("rnspy:status", handler);
    },
    onLog: (callback) => {
      const handler = (_event, payload) => callback(payload);
      electron.ipcRenderer.on("rnspy:log", handler);
      return () => electron.ipcRenderer.removeListener("rnspy:log", handler);
    }
  },
  updater: {
    getState: () => electron.ipcRenderer.invoke("updater:get-state"),
    check: (opts) => electron.ipcRenderer.invoke("updater:check", opts),
    download: () => electron.ipcRenderer.invoke("updater:download"),
    install: () => electron.ipcRenderer.invoke("updater:install"),
    openReleases: () => electron.ipcRenderer.invoke("updater:open-releases"),
    onState: (callback) => {
      const handler = (_event, payload) => callback(payload);
      electron.ipcRenderer.on("updater:state", handler);
      return () => electron.ipcRenderer.removeListener("updater:state", handler);
    }
  }
});
