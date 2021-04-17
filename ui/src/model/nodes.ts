import { ExecNode } from "@apibot/runtime";
import { Colors } from "@blueprintjs/core";

export function indexProps(
  config: Array<{ name: string; value: any }> | undefined
) {
  if (config === undefined) {
    return {};
  }
  const record: Record<string, any> = {};
  for (const rec of config) {
    record[rec.name] = rec.value;
  }
  return record;
}

export function title(node: ExecNode): string {
  if (node.type === "apibot.http-node") {
    const { method, url } = node.config;
    return method.value + " " + url.value.replace("{rootUrl}/", "");
  }
  if (node.type === "apibot.assert-status") {
    const { from, to } = node.config;
    return `${from.value} to ${to.value}`;
  }
  if (node.type === "apibot.extract-body") {
    const { extract, as } = node.config;
    return `${extract.value} to ${as.value}`;
  }
  return node.title || node.type;
}

export function compare(left: ExecNode, right: ExecNode): number {
  return (
    left.type.localeCompare(right.type) ||
    title(left).localeCompare(title(right))
  );
}

export function color(node: ExecNode): string {
  if (node.type.match(/apibot.assert-/)) {
    return Colors.ORANGE5;
  }
  if (node.type === "apibot.http-node") {
    return Colors.GREEN5;
  }
  return Colors.BLACK;
}

export function getChildren(node: ExecNode): ExecNode[] {
  if (node.type === "apibot.chain") {
    return node.config.fns.value;
  }
  return [node];
}

export function getNodeType(node: ExecNode) {
  if (node.type === "apibot.chain") {
    return "Chain";
  } else if (node.type === "apibot.http-node") {
    return "Http Request";
  } else if (node.type === "apibot.assert-status") {
    return "Assert Status";
  } else if (node.type === "apibot.extract-body") {
    return "Extract Body";
  }
  return node.type;
}
