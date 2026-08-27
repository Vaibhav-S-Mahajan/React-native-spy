// src/preload/index.js

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  rnspy: {
    start: (opts) => ipcRenderer.invoke('rnspy:start', opts),
    stop: () => ipcRenderer.invoke('rnspy:stop'),
    getStatus: () => ipcRenderer.invoke('rnspy:status'),
    disconnectClient: (id) => ipcRenderer.invoke('rnspy:disconnect-client', id),
    getLogs: () => ipcRenderer.invoke('rnspy:get-logs'),
    clearLogs: () => ipcRenderer.invoke('rnspy:clear-logs'),
    openInEditor: (opts) => ipcRenderer.invoke('rnspy:open-in-editor', opts),
    symbolicate: (opts) => ipcRenderer.invoke('rnspy:symbolicate', opts),
    sendCommand: (opts) => ipcRenderer.invoke('rnspy:send-command', opts),
    pickProjectFolder: () => ipcRenderer.invoke('rnspy:pick-project-folder'),
    detectProject: (opts) => ipcRenderer.invoke('rnspy:detect-project', opts),
    planSetup: (opts) => ipcRenderer.invoke('rnspy:plan-setup', opts),
    applySetup: (opts) => ipcRenderer.invoke('rnspy:apply-setup', opts),
    removeSetup: (opts) => ipcRenderer.invoke('rnspy:remove-setup', opts),
    onEvent: (callback) => {
      const handler = (_event, payload) => callback(payload)
      ipcRenderer.on('rnspy:event', handler)
      return () => ipcRenderer.removeListener('rnspy:event', handler)
    },
    onStatus: (callback) => {
      const handler = (_event, payload) => callback(payload)
      ipcRenderer.on('rnspy:status', handler)
      return () => ipcRenderer.removeListener('rnspy:status', handler)
    },
    onLog: (callback) => {
      const handler = (_event, payload) => callback(payload)
      ipcRenderer.on('rnspy:log', handler)
      return () => ipcRenderer.removeListener('rnspy:log', handler)
    },
  },
  updater: {
    getState: () => ipcRenderer.invoke('updater:get-state'),
    check: (opts) => ipcRenderer.invoke('updater:check', opts),
    download: () => ipcRenderer.invoke('updater:download'),
    install: () => ipcRenderer.invoke('updater:install'),
    openReleases: () => ipcRenderer.invoke('updater:open-releases'),
    onState: (callback) => {
      const handler = (_event, payload) => callback(payload)
      ipcRenderer.on('updater:state', handler)
      return () => ipcRenderer.removeListener('updater:state', handler)
    },
  },
})
