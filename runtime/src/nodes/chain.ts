import {
  AnyNode,
  ApibotNode,
  callerId,
  containsFailedAssertion,
  createNode,
  executeNode,
  findFailedAssertion,
} from "./node";
import { ExecNode } from "./types";

export type NodeChain = ApibotNode<"apibot.chain", {}> & {
  children: ExecNode[];
};

export function chain(...fns: AnyNode[]): NodeChain {
  const { id, title } = callerId();
  const nodes = fns.map((node, index) => createNode(id, index, node));

  const fn: NodeChain["fn"] = async (initialScope, _, app) => {
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
    children: nodes,
    args: {},
    config: {},
  };
}
