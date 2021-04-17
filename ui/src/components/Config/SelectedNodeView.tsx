import { ExecNode } from "@apibot/runtime";
import {
  FormGroup,
  H1,
  H4,
  NonIdealState,
  NumericInput,
} from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import { useRecoilValue } from "recoil";
import { $selectedNode } from "../../state";
import { ExtractHeaderView } from "./ExtractHeaderView";
import { HttpNodeView } from "./HttpNodeView";

const Container = styled.div`
  padding: 8px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function AssertStatusView({ node }: { node: ExecNode }) {
  const { config } = node as typeof node & { type: "apibot.assert-status" };
  return (
    <Container>
      <H4>Assert Status</H4>
      <p>
        Asserts that the previous HTTP request returns a status in the given
        range.
      </p>
      <FormGroup label="From status">
        <NumericInput value={config.from.value}></NumericInput>
      </FormGroup>
      <FormGroup label="To status">
        <NumericInput value={config.to.value}></NumericInput>
      </FormGroup>
    </Container>
  );
}

const nodeViewRegistry: Record<string, typeof HttpNodeView> = {
  "apibot.http-node": HttpNodeView,
  "apibot.extract-header": ExtractHeaderView,
  "apibot.assert-status": AssertStatusView,
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
