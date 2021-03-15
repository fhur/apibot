import { ScopeFunction, Scope, containsFailedAssertion } from "./node";

export function chain(...fns: ScopeFunction[]): ScopeFunction {
  return async (initialScope) => {
    let scope = initialScope;
    for (const node of fns) {
      scope = await node(scope);
      if (containsFailedAssertion(scope)) {
        break;
      }
    }
    return scope;
  };
}
