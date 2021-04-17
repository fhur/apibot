import { CompiledGraph, ProjectConfig } from "@apibot/compiler";
import { Scope } from "@apibot/compiler/node_modules/@apibot/runtime";
const { ipcRenderer } = window.require("electron");

function handleResponse<T>(
  res: { ok: true; response: T } | { ok: false; error: string }
): T {
  if (!res.ok) {
    throw new Error(res.error);
  }
  return res.response;
}

async function executeGraph({
  graphId,
  configFilePath,
  envId,
}: {
  graphId: string;
  configFilePath: string;
  envId: string;
}): Promise<Scope> {
  console.log("[ipc-request:executeGraph]", graphId, configFilePath, envId);

  const response = await ipcRenderer.invoke(
    "executeGraph",
    graphId,
    configFilePath,
    envId
  );
  console.log("[ipc-response:executeGraph]", response);
  return handleResponse(response);
}

async function compileProject(
  configFilePath: string
): Promise<{
  graphs: CompiledGraph[];
  projectConfig: ProjectConfig;
}> {
  //console.log("[ipc-request:compileProject]", configFilePath);
  const response = await ipcRenderer.invoke(
    "fetch-compiled-graph",
    configFilePath
  );
  //console.log("[ipc-response:compileProject]", graphs, projectConfig);

  return handleResponse(response);
}

ipcRenderer.on("onLogEntry", (_, logEntry) => {
  console.log("[onLogEntry]", logEntry);
});

export const ipc = {
  executeGraph,
  compileProject,
};
