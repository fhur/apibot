import { containsFailedAssertion } from "@apibot/compiler/node_modules/@apibot/runtime/build/nodes/node";
import { ExecNode, Scope } from "@apibot/runtime";
import { Colors, Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import styled from "@emotion/styled";
import * as React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import * as Nodes from "../../model/nodes";
import { $scopeByNodeId, $selectedNodeId, $showAlert } from "../../state";
import { ScopeSearch } from "../ScopeDrawer";

export function GraphNodeView({ node }: { node: ExecNode }) {
  const [, setSelectedNodeId] = useRecoilState($selectedNodeId);
  const setShowAlert = useSetRecoilState($showAlert);
  const scope = useRecoilValue($scopeByNodeId(node.id!));
  const [showScopePopup, setShowScopePopup] = React.useState(false);

  const handleKey = React.useCallback(
    (e) => {
      if (e.key === "Enter") {
        setShowAlert("confirm-execute-node");
      }
    },
    [setShowAlert]
  );

  const handleInteration = React.useCallback(
    (nextOpenState: boolean) => {
      setShowScopePopup(nextOpenState);
    },
    [setShowScopePopup]
  );

  const executedSuccessfully = scope && !containsFailedAssertion(scope);

  return (
    <Container
      style={{
        borderColor: Nodes.color(node),
      }}
      tabIndex={0}
      onKeyUp={handleKey}
      onFocus={() => setSelectedNodeId(node.id)}
    >
      <VerticalFlexbox>
        <RowNodeLabel>{Nodes.title(node)}</RowNodeLabel>
        <RowNodeType>{Nodes.getNodeType(node)}</RowNodeType>
      </VerticalFlexbox>

      <IconContainer>
        <Popover2
          placement="right"
          isOpen={showScopePopup && !!scope}
          content={
            <div style={{ height: 400, width: 400 }}>
              <ScopeSearch scope={scope} />
            </div>
          }
          minimal={false}
          onInteraction={handleInteration}
          interactionKind="hover"
          usePortal={true}
        >
          <StateIcon scope={scope} node={node} />
        </Popover2>
      </IconContainer>
    </Container>
  );
}

function StateIcon({ scope, node }: { scope?: Scope; node: ExecNode }) {
  let color = Colors.LIGHT_GRAY2;
  if (scope && containsFailedAssertion(scope)) {
    color = Colors.RED1;
  }
  if (scope && !containsFailedAssertion(scope)) {
    color = Colors.GREEN1;
  }

  return <Icon icon="eye-open" color={color} />;
}

const IconContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 6px;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
  background-color: ${Colors.LIGHT_GRAY5};
  overflow: visible;
  border-style: solid;
  border-top-width: 0;
  border-bottom-width: 0;
  border-left-width: 4px;
  border-right-width: 0;
`;

const VerticalFlexbox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 10px 12px;
`;

const RowNodeType = styled.div`
  font-size: 10px;
  color: ${Colors.DARK_GRAY5};
`;

const RowNodeLabel = styled.div`
  font-size: 14px;
  font-weight: 300px;
`;
