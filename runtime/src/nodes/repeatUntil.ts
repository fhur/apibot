import {
  containsFailedAssertion,
  findFailedAssertion,
  clearAssertionFailure,
  Scope,
  ScopeFunction,
} from "./node";

function logRepeatUntil(scope: Scope) {
  const failedAssertion = findFailedAssertion(scope);
  const message =
    typeof failedAssertion?.expected === "string" &&
    failedAssertion?.actual === "string"
      ? `${failedAssertion.message} expected: ${failedAssertion.expected}, actual: ${failedAssertion.actual}`
      : failedAssertion;
  console.warn("repeatUntil", scope.repeatCount || 0, message);
}

export function repeatUntil({
  repeat,
  until,
  waitMillis,
}: {
  repeat: ScopeFunction;
  until: ScopeFunction;
  waitMillis: number;
}): ScopeFunction {
  return async (initialScope) => {
    let scope = initialScope;

    while (true) {
      scope = await repeat(clearAssertionFailure(scope));
      scope = until(scope);

      if (!containsFailedAssertion(scope)) {
        return scope;
      }

      await new Promise((resolve) => setTimeout(resolve, waitMillis));

      scope = {
        ...scope,
        repeatCount: (scope.repeatCount || 0) + 1,
      };

      logRepeatUntil(scope);
    }
  };
}
