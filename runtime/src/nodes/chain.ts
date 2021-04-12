import {
  ScopeFunction,
  containsFailedAssertion,
  executeNode,
  findFailedAssertion,
  findLastResponse,
  AnyNode,
  callerId,
} from "./node";

export function chain(...fns: AnyNode[]): AnyNode {
  const fn: ScopeFunction = async (initialScope, app) => {
    let scope = initialScope;
    for (const node of fns) {
      scope = await executeNode(node, scope, app);
      if (containsFailedAssertion(scope)) {
        const { message, error } = findFailedAssertion(scope)!;
        console.error(message);
        if (error) {
          console.error(error);
        }

        const lastReponse = findLastResponse(scope);

        if (lastReponse) {
          console.error(JSON.stringify(lastReponse, null, 1));
        }

        break;
      }
    }
    return scope;
  };
  const { id, title } = callerId();
  return {
    id,
    type: "apibot.chain",
    title,
    fn,
    config: [
      {
        name: "fns",
        value: fns.map((x) =>
          typeof x === "function"
            ? {
                type: "apibot.eval",
                title: x.name,
              }
            : x
        ),
      },
    ],
  };
}
