import { Project } from "ts-morph";
import * as ts from "typescript";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  console.warn("Compiling", fileNames);
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  console.warn("Emit skipped?", emitResult.emitSkipped);
  console.warn("Emitted filed", emitResult.emittedFiles);
}

// export function compileTest(filePath: string) {
//   const configPath = ts.findConfigFile(
//     "./tsconfig.json",
//     ts.sys.fileExists,
//     "tsconfig.json"
//   );
//   console.warn("tsconfig found", configPath);

//   if (!configPath) {
//     throw new Error("tsconfig.json not found");
//   }

//   const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
//   if (error) {
//     console.warn("Error reading config file", error);
//   }
//   console.warn("tsconfig", config);
//   compile([filePath], config);
// }

export function compileTest(tsConfigFilePath: string) {
  const project = new Project({
    tsConfigFilePath,
  });

  project.emitSync();
}
