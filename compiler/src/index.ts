import * as fs from "fs";
import path from "path";
import { compileTest, requireTsFile } from "./compiler";
import { ExecNode, isExecNode, Scope, App } from "@apibot/runtime";
import { executeNode } from "@apibot/runtime/build/nodes/node";

export type ProjectConfig = {
  swaggerUrls: string[];
  envs: Record<string, object>;
  defaultEnv?: string;

  // Added by apibot
  logsDir: string;
  pathToTsConfig: string;
};

export type CompiledGraph = {
  id: string;
  root: ExecNode;
  require: { path: string; exportId: string };
};

function readConfigFile(configFilePath: string): ProjectConfig {
  const parsed = JSON.parse(fs.readFileSync(configFilePath).toString());
  const projectDir = path.dirname(path.resolve(configFilePath));

  const logsDir = path.join(projectDir, "logs");

  const pathToTsConfig = path.join(projectDir, "tsconfig.json");

  return {
    ...parsed,

    logsDir,
    pathToTsConfig,
  };
}

export function compileProject(
  configFilePath: string
): { graphs: CompiledGraph[]; projectConfig: ProjectConfig } {
  const projectConfig = readConfigFile(configFilePath);

  const prog = compileTest(projectConfig.pathToTsConfig);
  const compiledGraphs: CompiledGraph[] = prog
    .getSourceFiles()
    .filter(
      (sf) =>
        sf.getFilePath().includes("/src/endpoints/") ||
        sf.getFilePath().includes("/src/scenarios/")
    )
    .flatMap((sourceFile) => {
      const validFunctions = new Set(
        sourceFile
          .getFunctions()
          .filter((f) => (f.getName() ?? "").length > 0)
          .filter((f) => f.getParameters().length === 0)
          .map((fn) => fn.getName())
      );

      const requirePath = requireTsFile(sourceFile.getFilePath());

      return Object.entries(require(requirePath)).flatMap(
        ([exportName, func]) => {
          if (!validFunctions.has(exportName)) {
            return [];
          }
          try {
            // @ts-ignore
            const node = func();

            if (isExecNode(node)) {
              const compiledGraph: CompiledGraph = {
                id: `${requirePath}#${exportName}`,
                require: { path: requirePath, exportId: exportName },
                root: node,
              };
              return [compiledGraph];
            }
            return [];
          } catch (e) {
            // ignore
            return [];
          }
        }
      );
    });
  return {
    graphs: compiledGraphs,
    projectConfig,
  };
}

type LogEntry = {
  graphId: string;
  nodeId: string;
  scope: Scope;
};

export async function executeGraph(
  graphId: string,
  apibotConfigUrl: string,
  envId: string,
  onAppend: (logEntry: LogEntry) => void
): Promise<Scope> {
  const { graphs, projectConfig } = compileProject(apibotConfigUrl);
  const graph = graphs.find((g) => g.id === graphId)!;
  if (!graph) {
    throw new Error(`Unable to find graph with id ${graphId}`);
  }

  const initialScope = projectConfig.envs[envId] || {};

  const app: App = {
    executionHistory: {
      append(scope: any, metadata: any): any {
        onAppend({
          scope,
          graphId,
          nodeId: metadata.node.id,
        });
      },
    },
  };

  const node: any = require(graph.require.path)[graph.require.exportId]();

  return executeNode(node, initialScope, app);
}
console.log("running compiler");

const compiledProject = compileProject(
  "/Users/fernandohur/iptiq/iptiq-policy-admin-tester/apibot.config.json"
);
fs.writeFileSync(
  "/tmp/compiled.json",
  JSON.stringify(compiledProject, null, 2)
);
