import React from "react";
import { useRecoilValue } from "recoil";
import { $searchResultNodes } from "../state";
import { FileSystemView } from "./FileSystemView";
import { SearchBox } from "./SearchPanel/SearchBox";
import { SearchItem } from "./SearchPanel/SearchItem";

export function LeftPanel() {
  const nodes = useRecoilValue($searchResultNodes);
  return (
    <div style={styleLeftPanel}>
      <FileSystemView graphs={nodes} />
    </div>
  );
}

const styleLeftPanel: React.CSSProperties = {
  height: "100%",
  flexShrink: 0,
  width: 250,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: "var(--lightgray4, #ebf1f5)",
  overflow: "visible",
};
