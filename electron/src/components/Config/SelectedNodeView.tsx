import { ExecNode } from "@apibot/runtime";
import { Spinner, Tab, Tabs } from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import { useRecoilValue } from "recoil";
import { $currentExecution, $selectedNode } from "../../state";
import { ScopeTree } from "../ScopeTree";
import { ExtractHeaderView } from "./ExtractHeaderView";
import { HttpNodeView } from "./HttpNodeView";

const nodeViewRegistry: Record<string, typeof HttpNodeView> = {
  "apibot.http-node": HttpNodeView,
  "apibot.extract-header": ExtractHeaderView,
};

function DefaultNode(props: { node: any }) {
  return <p>no selected node</p>;
}

export function SelectedNodeView() {
  const selectedNode = useRecoilValue($selectedNode);
  const currentExecution = useRecoilValue($currentExecution);
  if (!selectedNode) {
    return <div>no selected node</div>;
  }
  const type = selectedNode.type;
  const NodeView = nodeViewRegistry[type as any] ?? DefaultNode;
  return <NodeView node={selectedNode} />;
}

const Scrollable = styled.div`
  height: 100%;
`;
