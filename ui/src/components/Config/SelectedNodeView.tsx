import { ExecNode } from "@apibot/runtime";
import {
  Colors,
  FormGroup,
  H4,
  NumericInput,
  Tab,
  Tabs,
} from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import { useRecoilValue } from "recoil";
import { $scopeByNodeId, $selectedNode } from "../../state";
import { ScopeSearch } from "../ScopeDrawer";
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
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: Colors.GRAY1,
      }}
    >
      no selected node
    </div>
  );
}

export function SelectedNodeView() {
  const selectedNode = useRecoilValue($selectedNode);
  const scope = useRecoilValue($scopeByNodeId(selectedNode?.id ?? ""));
  if (!selectedNode) {
    return <div>no selected node</div>;
  }
  const type = selectedNode.type;
  const NodeView = nodeViewRegistry[type as any] ?? DefaultNode;
  return (
    <Tabs defaultSelectedTabId="config" id="selected-node-tabs">
      <Tab
        id="config"
        title="Config"
        panel={<NodeView node={selectedNode} />}
      />
      <Tab
        id="scope"
        title={"Scope"}
        disabled={scope === undefined}
        panel={<ScopeSearch scope={scope} />}
      />
    </Tabs>
  );
}
