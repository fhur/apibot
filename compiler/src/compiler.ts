import { Project } from "ts-morph";

export function compileTest(tsConfigFilePath: string) {
  const project = new Project({
    tsConfigFilePath,
  });

  project.emitSync();

  return project;
}

export function requireTsFile(file: string) {
  return file.replace("/src/", "/build/").replace(".ts", "");
}
