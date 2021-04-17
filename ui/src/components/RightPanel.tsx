import { SelectedNodeView } from "./Config/SelectedNodeView";

export function RightPanel() {
  return (
    <div style={styleRightPanel}>
      <SelectedNodeView />
    </div>
  );
}

const styleRightPanel: React.CSSProperties = {
  height: "100%",
  flexShrink: 0,
  width: 500,
  backgroundColor: "var(--white, #ffffff)",
  overflow: "scroll",
};
