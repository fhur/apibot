import styled from "@emotion/styled";
import { useRecoilState, useRecoilValue } from "recoil";
import { $selectedGraph } from "../state";
import { GraphNodeView } from "./Graph/Node";
import { SelectedGraph } from "./Graph/SelectedGraph";
import { Separator } from "./Separator";

export function CenterPanel() {
  const selectedGraph = useRecoilValue($selectedGraph);
  if (!selectedGraph) {
    return (
      <Container>
        <p>no selected graph</p>
      </Container>
    );
  }
  return (
    <Container>
      <SelectedGraph graph={selectedGraph} />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  width: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  overflow-y: scroll;
`;
