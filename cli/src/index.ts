#!/usr/bin/env node
import { Command } from "commander";
import { addEndpoint, ProjectConfig } from "./commands/addEndpoint";
import { initializeProject } from "./commands/initializeProject";
import { runScenario } from "./commands/runScenario";
import fs from "fs";
const version = "0.0.1";
const name = "apibot";

function readConfigFile(): ProjectConfig {
  const parsed = JSON.parse(fs.readFileSync("./apibot.config.json").toString());
  return parsed;
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
    "The environment to use",
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
      path,
      args: JSON.parse(options.args),
      env: options.env,
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
