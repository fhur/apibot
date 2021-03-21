import fs from "fs";
import path from "path";
import { compileTest } from "../compiler";
import { ProjectConfig } from "./addEndpoint";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function createInitialScope(
  envs: string[],
  config: ProjectConfig,
  args: Record<string, any>
) {
  let initialScope = {};
  for (const envName of envs) {
    const env = config.envs[envName];
    if (!env) {
      throw new Error(
        `Environment ${envName} not found. Known environments are ${Object.keys(
          config.envs
        ).join(", ")}`
      );
    }
    initialScope = Object.assign(initialScope, env);
  }
  return Object.assign(initialScope, args);
}

function createApp(config: ProjectConfig) {
  const logFile = path.join(config.logsDir, "latest.jsonl");
  const randomLogFile = path.join(
    config.logsDir,
    `${new Date().toISOString()}.jsonl`
  );
  fs.renameSync(logFile, randomLogFile);
  const stream = fs.createWriteStream(logFile);
  return {
    executionHistory: {
      append(scope: any, metadata: any) {
        stream.write(
          JSON.stringify({
            createdAt: Date.now(),
            metadata,
            scope,
          })
        );
        stream.write("\n");
      },
    },
  };
}

export async function runScenario({
  pathToFile,
  envs,
  args,
  config,
}: {
  pathToFile: string;
  logLevel: LogLevel;
  args: Record<string, any>;
  envs: string[];
  config: ProjectConfig;
}) {
  for (const env of envs) {
    if (!config.envs[env]) {
      throw new Error(`Environment ${env} not found`);
    }
  }

  compileTest("./tsconfig.json");
  const pathToJsFile = pathToFile.replace("src/", "build/").replace(".ts", "");

  const imports = require(path.resolve(pathToJsFile));

  const func = Object.values(imports).find((fn) => typeof fn === "function");

  if (!func || typeof func !== "function") {
    throw new Error(
      `No function found in ${pathToFile}. Make sure that you are exporting a function properly.`
    );
  }

  const initialScope = createInitialScope(envs, config, args);
  const app = createApp(config);
  const scopeFn = func(args);

  const finalScope = await scopeFn(initialScope, app);
  console.log(JSON.stringify(finalScope, null, 2));
}
