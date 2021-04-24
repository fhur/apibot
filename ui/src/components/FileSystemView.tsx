import { CompiledGraph } from "@apibot/compiler";
import {
  Code,
  Colors,
  ITreeNode,
  Tree,
  TreeEventHandler,
} from "@blueprintjs/core";
import { IconName, IconNames } from "@blueprintjs/icons";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { $selectedGraphId } from "../state";

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

function groupBy<T>(xs: T[], fn: (x: T) => string): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (const x of xs) {
    const groupId = fn(x);
    if (grouped[groupId] === undefined) {
      grouped[groupId] = [];
    }
    const group = grouped[groupId];
    group.push(x);
  }
  return grouped;
}

function toNodes(
  graphs: { graph: CompiledGraph; path: string[] }[],
  expandedNodes: Record<string, boolean>,
  path: string,
  selectedGraphId?: string
): ITreeNode<any>[] {
  const leafNodes = graphs
    .filter((g) => g.path.length === 0)
    .map(
      (leaf): ITreeNode<CompiledGraph> => {
        return {
          id: leaf.graph.id,
          label: leaf.graph.require.exportId,
          nodeData: leaf.graph,
          icon: "document",
          isSelected: selectedGraphId === leaf.graph.id,
        };
      }
    );

  const folderNodes = Object.entries(
    groupBy(
      graphs.filter((g) => g.path.length > 0),
      (g) => g.path[0]
    )
  ).map(
    ([dir, graphs]): ITreeNode<any> => {
      const childNodes = graphs.map((g) => {
        return { ...g, path: g.path.slice(1) };
      });
      const id = `${path}/${dir}`;
      const label = dir;
      const children = toNodes(childNodes, expandedNodes, id, selectedGraphId);
      if (children.length === 1 && children[0].label === label) {
        return children[0];
      }
      return {
        id: id,
        label,
        icon: "folder-open",
        isExpanded: expandedNodes[id],
        childNodes: toNodes(childNodes, expandedNodes, id, selectedGraphId),
      };
    }
  );

  return leafNodes.concat(folderNodes);
}

export function FileSystemView({ graphs }: { graphs: CompiledGraph[] }) {
  const [expandedNodes, setExpandedNodes] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedGraphId, setSelectedGraphId] = useRecoilState(
    $selectedGraphId
  );

  const handleNodeClick = React.useCallback<TreeEventHandler<CompiledGraph>>(
    (node) => {
      if (node.nodeData) {
        setSelectedGraphId(node.nodeData.id);
      }
      setExpandedNodes((expandedNodes) => {
        return { ...expandedNodes, [node.id]: !(node.isExpanded ?? false) };
      });
    },
    [setExpandedNodes]
  );

  const nodes = React.useMemo(
    () =>
      toNodes(removeCommonPaths(graphs), expandedNodes, "", selectedGraphId),
    [graphs, selectedGraphId, expandedNodes]
  );

  return (
    <Tree
      className="full-width"
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeExpand={handleNodeClick}
      onNodeCollapse={handleNodeClick}
    />
  );
}

function removeCommonPaths(graphs: CompiledGraph[]) {
  if (graphs.length === 0) {
    return [];
  }

  const graphsWithPath = graphs.map((g) => {
    return {
      graph: g,
      path: g.require.path.split("/"),
    };
  });
  const firstGraph = graphsWithPath[0]!;

  let maxCommonIndex = 0;
  for (maxCommonIndex = 0; ; maxCommonIndex++) {
    if (
      !graphsWithPath.every(
        (g) => g.path[maxCommonIndex] === firstGraph.path[maxCommonIndex]
      )
    ) {
      break;
    }
  }

  return graphsWithPath.map((g) => {
    return { graph: g.graph, path: g.path.slice(maxCommonIndex) };
  });
}
