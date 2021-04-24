import { AnyNode, callerId, ScopeFunction } from "./node";

export function config(
  configuration: Record<string, number | boolean | string | null>
): AnyNode {
  const fn: ScopeFunction = (scope) => {
    return configuration;
  };

  const { id, title } = callerId();
  return {
    id,
    type: "apibot.config",
    title,
    fn,
    args: { configuration },
    config: { configuration: { type: "object", value: configuration } },
  };
}
