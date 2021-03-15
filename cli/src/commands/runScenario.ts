import { ProjectConfig } from "./addEndpoint";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export async function runScenario({
  path,
  env,
  args,
  config,
}: {
  path: string;
  logLevel: LogLevel;
  args: object;
  env: string;
  config: ProjectConfig;
}) {
  if (!config.envs[env]) {
    throw new Error(`Environment ${env} not found`);
  }

  const imports = require(path);

  const func = Object.values(imports).find((fn) => typeof fn === "function");

  if (!func || typeof func !== "function") {
    throw new Error(
      `No function found in ${path}. Make sure that you are exporting a function properly.`
    );
  }

  const envScope = (config.envs || {})[env] || {};
  const initialScope = { ...envScope, ...args };

  const finalScope = await func(args)(initialScope);
  console.log(JSON.stringify(finalScope, null, 2));
}
