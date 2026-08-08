let electron = require("electron");
//#region electron/preload.ts
electron.contextBridge.exposeInMainWorld("api", {
	send: (channel, data) => {
		if (["toMain"].includes(channel)) electron.ipcRenderer.send(channel, data);
	},
	receive: (channel, func) => {
		if (["fromMain"].includes(channel)) electron.ipcRenderer.on(channel, (event, ...args) => func(...args));
	}
});
//#endregion
