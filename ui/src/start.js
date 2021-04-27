const { app, BrowserWindow, ipcMain } = require("electron");
const { compileProject, executeGraph } = require("@apibot/compiler");

const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../public/index.html"),
        protocol: "file:",
        slashes: true,
      })
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function toSerializable(x) {
  return JSON.parse(JSON.stringify(x));
}

async function wrapInIpcResponse(makeRequest) {
  try {
    const response = await makeRequest();
    return {
      ok: true,
      response: toSerializable(response),
    };
  } catch (e) {
    return { ok: false, error: e.toString() };
  }
}

ipcMain.handle("fetch-compiled-graph", (event, apibotConfigUrl) => {
  return wrapInIpcResponse(() => compileProject(apibotConfigUrl));
});

ipcMain.handle("executeGraph", (event, graphId, apibotConfigUrl, envId) => {
  const onAppend = (logEntry) => {
    event.sender.send("onLogEntry", toSerializable(logEntry));
  };

  return wrapInIpcResponse(() =>
    executeGraph(graphId, apibotConfigUrl, envId, onAppend)
  );
});
