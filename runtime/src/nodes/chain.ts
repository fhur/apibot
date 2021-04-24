import {
  AnyNode,
  callerId,
  containsFailedAssertion,
  createNode,
  executeNode,
  findFailedAssertion,
  ScopeFunction,
} from "./node";

export function chain(...fns: AnyNode[]): AnyNode {
  const { id, title } = callerId();
  const nodes = fns.map((node, index) => createNode(id, index, node));

  const fn: ScopeFunction = async (initialScope, app) => {
    let scope = initialScope;
    for (const node of nodes) {
      scope = await executeNode(node, scope, app);
      if (containsFailedAssertion(scope)) {
        const { message, error } = findFailedAssertion(scope)!;

        if (error) {
          console.error(error);
        } else {
          console.error(message);
        }

        break;
      }
    }
    return scope;
  };

  return {
    id,
    type: "apibot.chain",
    title,
    fn,
    args: { fns: nodes },
    config: {
      fns: {
        type: "fns",
        value: nodes,
      },
    },
  };
}
