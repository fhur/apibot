import { Project, SourceFile } from "ts-morph";
import * as ts from "typescript";

function analyzeProject(sourceFile: SourceFile) {
  const exportedDeclarations = sourceFile.getExportedDeclarations();
  if (exportedDeclarations.size === 0) {
    return true;
  }
  console.log(sourceFile.getFilePath());
  console.log(exportedDeclarations.keys());
}

export function compileTest(tsConfigFilePath: string) {
  const project = new Project({
    tsConfigFilePath,
  });

  //   for (const sf of project.getSourceFiles()) {
  //     analyzeProject(sf);
  //   }

  project.emitSync();

  return project;
}

export function requireTsFile(file: string) {
  return require(file.replace("/src/", "/build/").replace(".ts", ""));
}
