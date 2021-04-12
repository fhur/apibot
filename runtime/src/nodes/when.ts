import { AnyNode, executeNode, Scope, ScopeFunction } from "./node";

function evalInScope(condition: string, $: Scope) {
  return eval(condition);
}

export function when(args: Record<string, AnyNode>): AnyNode {
  const scopeFunc: ScopeFunction = (scope, app) => {
    const [, fn] = Object.entries(args).find(
      ([condition, fn]) =>
        condition === "else" || evalInScope(condition, scope) === true
    )!;
    return executeNode(fn, scope, app);
  };
  return {
    type: "apibot.when",
    title: "When",
    fn: scopeFunc,
    config: [{ name: "args", value: args }],
  };
}