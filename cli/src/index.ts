#!/usr/bin/env node
import { Command } from "commander";
import { addEndpoint, ProjectConfig } from "./commands/addEndpoint";
import { initializeProject } from "./commands/initializeProject";
import { runScenario } from "./commands/runScenario";
import fs from "fs";
import path from "path";

const version = "0.0.1";
const name = "apibot";

function readConfigFile(): ProjectConfig {
  const configFilePath = "./apibot.config.json";
  const parsed = JSON.parse(fs.readFileSync(configFilePath).toString());
  const projectDir = path.dirname(path.resolve(configFilePath));

  const logsDir = path.join(projectDir, "logs");

  return { ...parsed, logsDir };
}

const config = readConfigFile();

const addCommand = new Command()
  .name("add")
  .arguments("<path>")
  .description("Adds a new endpoint")
  .action((path) => {
    addEndpoint({ path, config: readConfigFile() });
  });

const initCommand = new Command()
  .name("init")
  .arguments("<path>")
  .description("Initializes a new apibot project")
  .option(
    "--swagger-url <url-or-path>",
    "A URL or relative path to a Swagger Spec URL."
  )
  .option(
    "--postman-url <url-or-path>",
    "A URL or relative path to a postman collection JSON"
  )
  .action((path, options) => {
    const { swaggerUrl, postmanUrl } = options;
    initializeProject({ swaggerUrl, path });
  });

const runCommand = new Command()
  .name("run")
  .arguments("<path>")
  .option(
    "--env <env>",
    "A comma separated list of environments.",
    readConfigFile().defaultEnv || ""
  )
  .option(
    "--args <args>",
    "Additional arguments to pass to the scenario, as JSON",
    "{}"
  )
  .option(
    "--log-level",
    "The log level to use, one of DEBUG, INFO, WARN, ERROR",
    "INFO"
  )
  .action((path, options) => {
    runScenario({
      pathToFile: path,
      args: JSON.parse(options.args),
      envs: (options.env as string).split(",").map((s) => s.trim()),
      logLevel: options.logLevel,
      config,
    });
  });

const program = new Command()
  .version(version)
  .name(name)
  .addCommand(addCommand)
  .addCommand(initCommand)
  .addCommand(runCommand);

program.parse(process.argv);
