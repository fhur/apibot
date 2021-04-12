import {
  containsFailedAssertion,
  findFailedAssertion,
  clearAssertionFailure,
  Scope,
  ScopeFunction,
  executeNode,
  AnyNode,
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
  repeat: AnyNode;
  until: AnyNode;
  waitMillis: number;
}): AnyNode {
  const fn: ScopeFunction = async (initialScope, app) => {
    let scope = initialScope;

    while (true) {
      scope = await executeNode(repeat, clearAssertionFailure(scope), app);
      scope = await executeNode(until, scope, app);

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
  return {
    id: "TODO",
    type: "apibot.repeat-until",
    title: "Repeat Until",
    fn,
    config: [
      { name: "repeat", value: repeat },
      { name: "until", value: until },
      { name: "waitMillis", value: waitMillis },
    ],
  };
}
