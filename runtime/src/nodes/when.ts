import { AnyNode, executeNode, Scope, ScopeFunction } from "./node";
import { ExecNode } from "./types";

function evalInScope(condition: string, $: Scope) {
  return eval(condition);
}

export function when(args: Record<string, ExecNode>): ScopeFunction<void> {
  const scopeFunc: ScopeFunction<void> = async (scope, _, app) => {
    const [, fn] = Object.entries(args).find(
      ([condition, fn]) =>
        condition === "else" || evalInScope(condition, scope) === true
    )!;
    return executeNode(fn, scope, app);
  };
  return scopeFunc;
}
