import {
  AnyNode,
  ApibotNode,
  callerId,
  containsFailedAssertion,
  createNode,
  executeNode,
  findFailedAssertion,
  ScopeFunction,
} from "./node";

export type NodeChain = ApibotNode<"apibot.chain", void>;

export function chain(...fns: AnyNode[]): NodeChain {
  const { id, title } = callerId();
  const nodes = fns.map((node, index) => createNode(id, index, node));

  const fn: ScopeFunction<void> = async (initialScope, _, app) => {
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
    args: void 0,
    config: {
      fns: {
        type: "fns",
        value: nodes,
      },
    },
  };
}
