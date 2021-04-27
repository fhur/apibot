import { ExecNode } from "@apibot/runtime";
import { Colors } from "@blueprintjs/core";

export function title(node: ExecNode): string {
  if (node.type === "apibot.http-node") {
    const { method, url } = node.args;
    return method + " " + url.replace("{rootUrl}/", "");
  }
  if (node.type === "apibot.assert-status") {
    const { from, to } = node.args;
    return `${from} to ${to}`;
  }
  if (node.type === "apibot.extract-body") {
    const { extract, as } = node.args;
    return `${extract} as ${as}`;
  }
  if (node.type === "apibot.extract-header") {
    const { headerName, as } = node.args;
    return `Extract ${headerName} as ${as}`;
  }
  return node.title || node.type;
}

export function createArgs<T extends ExecNode>(node: T["config"]): T["args"] {
  return Object.entries(node).reduce<Record<string, any>>((red, [key, val]) => {
    red[key] = val.value;
    return red;
  }, {});
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
  if (node.type === "apibot.chain") {
    return Colors.BLUE1;
  }
  return Colors.BLACK;
}

export function getChildren(node: ExecNode): ExecNode[] {
  if (node.type === "apibot.chain") {
    return node.children || [];
  }
  return [node];
}

export function getNodeType(node: ExecNode) {
  if (node.type === "apibot.chain") {
    return "Chain";
  } else if (node.type === "apibot.http-node") {
    return node.title;
  } else if (node.type === "apibot.assert-status") {
    return "Assert Status";
  } else if (node.type === "apibot.extract-body") {
    return "Extract Body";
  } else if (node.type === "apibot.extract-header") {
    return "Extract Header";
  }
  return node.type;
}
