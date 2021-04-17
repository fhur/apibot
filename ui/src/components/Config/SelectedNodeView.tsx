import React from "react";
import { useRecoilValue } from "recoil";
import { $selectedNode } from "../../state";
import { ExtractHeaderView } from "./ExtractHeaderView";
import { HttpNodeView } from "./HttpNodeView";

const nodeViewRegistry: Record<string, typeof HttpNodeView> = {
  "apibot.http-node": HttpNodeView,
  "apibot.extract-header": ExtractHeaderView,
};

function DefaultNode() {
  return <p>no selected node</p>;
}

export function SelectedNodeView() {
  const selectedNode = useRecoilValue($selectedNode);
  if (!selectedNode) {
    return <div>no selected node</div>;
  }
  const type = selectedNode.type;
  const NodeView = nodeViewRegistry[type as any] ?? DefaultNode;
  return <NodeView node={selectedNode} />;
}
