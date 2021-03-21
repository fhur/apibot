import { ScopeFunction, containsFailedAssertion, executeNode } from "./node";

export function chain(...fns: ScopeFunction[]): ScopeFunction {
  return async (initialScope, app) => {
    let scope = initialScope;
    for (const node of fns) {
      scope = await executeNode(node, scope, app);
      if (containsFailedAssertion(scope)) {
        break;
      }
    }
    return scope;
  };
}
