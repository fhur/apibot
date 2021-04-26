import { ApibotNode, callerId } from "./node";

export type NodeConfig = ApibotNode<
  "apibot.config",
  { configuration: Record<string, string> }
>;

export function config(
  configuration: NodeConfig["args"]["configuration"]
): NodeConfig {
  const fn: NodeConfig["fn"] = (scope, conf) => {
    return Promise.resolve(conf.configuration);
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.config",
    title,
    fn,
    args: { configuration },
    config: { configuration: { type: "string-map", value: configuration } },
  };
}
