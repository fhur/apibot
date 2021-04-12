#!/usr/bin/env node
import { Command } from "commander";
import { addEndpoint, ProjectConfig } from "./commands/addEndpoint";
import { initializeProject } from "./commands/initializeProject";
import { runScenario } from "./commands/runScenario";
import fs from "fs";
import path from "path";
import { compileTest, requireTsFile } from "./compiler";

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
    }).catch((e) => {
      console.error(e);
    });
  });

const compileCommand = new Command()
  .name("compile")
  .description("Compiles project to JSON file")
  .action((path, options) => {
    const prog = compileTest("./tsconfig.json");
    const out = prog
      .getSourceFiles()
      .filter(
        (sf) =>
          sf.getFilePath().includes("/src/endpoints/") ||
          sf.getFilePath().includes("/src/scenarios/")
      )
      .flatMap((x) => {
        const imports = requireTsFile(x.getFilePath());
        return Object.entries(imports).flatMap(([exportName, func]) => {
          try {
            // @ts-ignore
            const x = func();
            if (x.type && x.title && x.fn) {
              const title = exportName || x.title;
              console.warn("Found", title);
              return [
                {
                  ...x,
                  id: title,
                  title,
                  // path: x.getFilePath().replace(/.+\/src\//, ""),
                },
              ];
            }
            return [];
          } catch (e) {
            // ignore
            return [];
          }
        });
      });
    console.log(JSON.stringify(out, null, 2));
  });

const program = new Command()
  .version(version)
  .name(name)
  .addCommand(addCommand)
  .addCommand(initCommand)
  .addCommand(runCommand)
  .addCommand(compileCommand);

program.parse(process.argv);
