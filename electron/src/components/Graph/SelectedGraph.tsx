import React from "react";
import { ExecNode } from "@apibot/runtime";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import * as Nodes from "../../model/nodes";
import { $selectedNodeId } from "../../state";
import { Separator } from "../Separator";
import { GraphNodeView } from "./Node";
type Props = {
  graph: ExecNode;
};

export function SelectedGraph({ graph }: Props) {
  const nodes = Nodes.getChildren(graph);
  const [selectedNodeId, setSelectedNodeId] = useRecoilState($selectedNodeId);

  React.useEffect(() => {
    console.log("update selection");
    setSelectedNodeId(nodes[0].id);
  }, [graph]);

  return (
    <Container>
      {nodes.map((n, index) => {
        const showDivider = index < nodes.length - 1;
        return (
          <>
            <GraphNodeView key={"node-" + index} node={n} />
            {showDivider && <Separator key={"divider-" + index} />}
          </>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
