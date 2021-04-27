import { CompiledGraph } from "@apibot/compiler";
import { ITreeNode, Tree, TreeEventHandler } from "@blueprintjs/core";
import React from "react";
import { useRecoilState } from "recoil";
import { $selectedGraphId } from "../state";

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
      const childNodesWithPath = graphs.map((g) => {
        return { ...g, path: g.path.slice(1) };
      });
      const id = `${path}/${dir}`;
      const label = dir;
      const children = toNodes(
        childNodesWithPath,
        expandedNodes,
        id,
        selectedGraphId
      );
      if (children.length === 1 && children[0].label === label) {
        return children[0];
      }
      const childNodes = toNodes(
        childNodesWithPath,
        expandedNodes,
        id,
        selectedGraphId
      );
      return {
        id: id,
        label,
        icon: "folder-open",
        isExpanded: expandedNodes[id] || childNodes.some((c) => c.isSelected),
        childNodes,
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
    <div className="full-width">
      <Tree
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeExpand={handleNodeClick}
        onNodeCollapse={handleNodeClick}
      />
    </div>
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
