import { ExecNode, NodeHttp } from "@apibot/runtime";
import { Colors, Tab, Tabs } from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import { useRecoilValue } from "recoil";
import { createArgs } from "../../model/nodes";
import { $argsByNodeId, $scopeByNodeId, $selectedNode } from "../../state";
import { ScopeSearch } from "../ScopeDrawer";
import { ControlView } from "./controls";
import { HttpNodeView } from "./HttpNodeView";

const Container = styled.div`
  padding: 8px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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

function SwitchControlView<T extends ExecNode>({
  node,
  args,
}: {
  node: T;
  args: T["args"];
}) {
  if (node.type === "apibot.chain") {
    return <p>chain</p>;
  }
  if (node.type === "apibot.http-node") {
    return (
      <HttpNodeView node={node as NodeHttp} args={args as NodeHttp["args"]} />
    );
  } else {
    return <ControlView node={node} args={args} />;
  }
}

export function SelectedNodeView() {
  const selectedNode = useRecoilValue($selectedNode);
  const scope = useRecoilValue($scopeByNodeId(selectedNode?.id ?? ""));
  const allArgs = useRecoilValue($argsByNodeId);

  if (!selectedNode) {
    return <DefaultNode />;
  }

  const args = allArgs[selectedNode.id] ?? createArgs(selectedNode.config);

  return (
    <Tabs defaultSelectedTabId="config" id="selected-node-tabs">
      <Tab
        id="config"
        title="Config"
        panel={<SwitchControlView node={selectedNode} args={args} />}
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
