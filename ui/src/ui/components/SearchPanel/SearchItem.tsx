import { CompiledGraph } from "@apibot/compiler";
import { Colors } from "@blueprintjs/core";
import { useRecoilState } from "recoil";
import * as Nodes from "../../model/nodes";
import { $selectedGraphId } from "../../state";

type Props = {
  graph: CompiledGraph;
  selected?: boolean;
};

export function SearchItem({ graph, selected = false }: Props) {
  const text = Nodes.title(graph.root);
  const [selectedGraphId, setSelected] = useRecoilState($selectedGraphId);
  const isSelected = selectedGraphId === graph.id;
  return (
    <div
      onClick={() => {
        setSelected(graph.id);
      }}
      style={{
        ...searchItem,
        borderColor: Nodes.color(graph.root),
        background: selected ? Colors.BLUE5 : undefined,
      }}
    >
      {isSelected ? <strong>{text}</strong> : text}
    </div>
  );
}

const searchItem: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: 40,
  display: "flex",
  whiteSpace: "nowrap",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "10px 16px 10px 16px",
  backgroundColor: "var(--lightgray5, #f5f8fa)",
  overflow: "hidden",
  borderColor: `var(--token-04de202e-c090-493a-a9ee-9e0dc9e7ac7c, #0a6640) /* {"name":"green1"} */`,
  borderStyle: "solid",
  borderTopWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 3,
  borderRightWidth: 0,
};
