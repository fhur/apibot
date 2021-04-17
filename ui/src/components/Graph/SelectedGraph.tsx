import { CompiledGraph } from "@apibot/compiler";
import styled from "@emotion/styled";
import React from "react";
import { useRecoilState } from "recoil";
import * as Nodes from "../../model/nodes";
import { $selectedNodeId } from "../../state";
import { Separator } from "../Separator";
import { GraphNodeView } from "./Node";
type Props = {
  graph: CompiledGraph;
};

export function SelectedGraph({ graph }: Props) {
  const nodes = Nodes.getChildren(graph.root);
  const [, setSelectedNodeId] = useRecoilState($selectedNodeId);

  React.useEffect(() => {
    setSelectedNodeId(nodes[0].id);
  }, [nodes, setSelectedNodeId]);

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
