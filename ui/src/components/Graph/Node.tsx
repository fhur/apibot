import { ExecNode } from "@apibot/runtime";
import { Colors } from "@blueprintjs/core";
import styled from "@emotion/styled";
import * as React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import * as Nodes from "../../model/nodes";
import { $scopeByNodeId, $selectedNodeId, $showAlert } from "../../state";

export function GraphNodeView({ node }: { node: ExecNode }) {
  const [, setSelectedNodeId] = useRecoilState($selectedNodeId);
  const setShowAlert = useSetRecoilState($showAlert);
  const scope = useRecoilValue($scopeByNodeId(node.id!));

  const handleKey = React.useCallback(
    (e) => {
      if (e.key === "Enter") {
        setShowAlert("confirm-execute-node");
      }
    },
    [setShowAlert]
  );

  return (
    <Container
      tabIndex={0}
      style={{
        borderColor: Nodes.color(node),
        opacity: scope === undefined ? 0.5 : 1,
      }}
      onKeyUp={handleKey}
      onFocus={() => setSelectedNodeId(node.id)}
    >
      <RowNodeLabel>{node.id}</RowNodeLabel>
      <RowNodeLabel>{Nodes.title(node)}</RowNodeLabel>
      <RowNodeType>{Nodes.getNodeType(node)}</RowNodeType>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 10px 12px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
  background-color: ${Colors.LIGHT_GRAY5};
  overflow: visible;
  border-style: solid;
  border-top-width: 0;
  border-bottom-width: 0;
  border-left-width: 6;
  border-right-width: 0;
`;

const RowNodeType = styled.div`
  font-size: 10px;
  color: ${Colors.DARK_GRAY5};
`;

const RowNodeLabel = styled.div`
  font-size: 14px;
  font-weight: 300px;
`;
