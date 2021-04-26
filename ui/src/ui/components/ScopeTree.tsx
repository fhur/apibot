import {
  Code,
  Colors,
  ITreeNode,
  Tree,
  TreeEventHandler,
} from "@blueprintjs/core";
import { IconName, IconNames } from "@blueprintjs/icons";
import React from "react";

const icons: Record<string, IconName> = {
  "apibot.lastRequest": IconNames.NOTIFICATIONS,
};

function getIcon(id: string, obj: any): IconName | undefined {
  // if (Array.isArray(obj)) {
  //   return IconNames.LIST;
  // }
  return undefined;
}

function toString(any: any) {
  if (typeof any === "string") {
    return (
      <Code style={{ color: Colors.ORANGE1, whiteSpace: "nowrap" }}>
        "{any}"
      </Code>
    );
  }
  if (typeof any === "number") {
    return (
      <Code style={{ color: Colors.BLACK, fontWeight: "bold" }}>{any}</Code>
    );
  }
  if (any === null) {
    return (
      <span style={{ color: Colors.RED1, fontWeight: "bold" }}>{"null"}</span>
    );
  }
  if (Array.isArray(any)) {
    return `array (${any.length} keys)`;
  }
  if (typeof any === "object") {
    return `object (${Object.keys(any).length} keys)`;
  }

  return undefined;
}

function entries(obj: any): Array<[string, any]> {
  if (obj === null || obj === undefined) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.map((x, i) => [i + "", x]);
  }
  if (typeof obj === "object") {
    return Object.entries(obj);
  }
  return [];
}

function scopeToNodes(
  scope: object,
  expandedNodes: Record<string, boolean>
): ITreeNode[] {
  const queue: Array<{ path: string; key: string; obj: any }> = entries(
    scope
  ).map(([key, obj]) => {
    return { path: "", key, obj };
  });
  const result: ITreeNode[] = [];
  for (const { path, key, obj } of queue) {
    const id = path + key;

    const children = scopeToNodes(obj, expandedNodes);

    result.push({
      id: id,
      label: (
        <span style={{ cursor: children.length === 0 ? undefined : "pointer" }}>
          {key}
        </span>
      ),
      icon: getIcon(id, obj),
      secondaryLabel: toString(obj),
      childNodes: children.length === 0 ? undefined : children,
      nodeData: obj,
      isExpanded: expandedNodes[id],
    });
  }
  return result;
}

export function ScopeTree({ scope }: { scope: object }) {
  const [expandedNodes, setExpandedNodes] = React.useState<
    Record<string, boolean>
  >({});

  const handleNodeClick = React.useCallback<TreeEventHandler>(
    (node) => {
      setExpandedNodes((expandedNodes) => {
        return { ...expandedNodes, [node.id]: !(node.isExpanded ?? false) };
      });
    },
    [setExpandedNodes]
  );

  const nodes = scopeToNodes(scope, expandedNodes);
  return (
    <Tree
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeExpand={handleNodeClick}
      onNodeCollapse={handleNodeClick}
    />
  );
}
