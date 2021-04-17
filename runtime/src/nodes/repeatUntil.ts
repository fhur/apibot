import {
  containsFailedAssertion,
  findFailedAssertion,
  clearAssertionFailure,
  Scope,
  ScopeFunction,
  executeNode,
  AnyNode,
  callerId,
  createNode,
} from "./node";

function logRepeatUntil(scope: Scope, label: string) {
  const failedAssertion = findFailedAssertion(scope);
  const message =
    typeof failedAssertion?.expected === "string" &&
    failedAssertion?.actual === "string"
      ? `${failedAssertion.message} expected: ${failedAssertion.expected}, actual: ${failedAssertion.actual}`
      : failedAssertion;
  console.warn(label, scope.repeatCount || 0, message);
}

export function repeatUntil({
  repeat,
  until,
  waitMillis,
  message = "repeatUntil",
  maxIterations = 20,
}: {
  repeat: AnyNode;
  until: AnyNode;
  waitMillis: number;
  maxIterations: number;
  message: string;
}): AnyNode {
  const { id, title } = callerId();

  const fn: ScopeFunction = async (initialScope, app) => {
    let scope = initialScope;

    for (let i = 0; i < maxIterations; i++) {
      scope = await executeNode(
        createNode(id, "repeat", repeat),
        clearAssertionFailure(scope),
        app
      );
      scope = await executeNode(createNode(id, "until", repeat), scope, app);

      if (!containsFailedAssertion(scope)) {
        return scope;
      }

      await new Promise((resolve) => setTimeout(resolve, waitMillis));

      scope = {
        ...scope,
        repeatCount: (scope.repeatCount || 0) + 1,
      };

      logRepeatUntil(scope, message);
    }
  };
  return {
    id,
    title,
    type: "apibot.repeat-until",
    fn,
    config: [
      { name: "repeat", value: repeat },
      { name: "until", value: until },
      { name: "waitMillis", value: waitMillis },
    ],
  };
}
