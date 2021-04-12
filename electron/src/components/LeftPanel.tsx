import React from "react";
import { useRecoilValue } from "recoil";
import { $searchResultNodes } from "../state";
import { SearchBox } from "./SearchPanel/SearchBox";
import { SearchItem } from "./SearchPanel/SearchItem";
import { Separator } from "./Separator";

export function LeftPanel({}: {}) {
  const nodes = useRecoilValue($searchResultNodes);
  return (
    <div style={styleLeftPanel}>
      <SearchBox />
      {nodes.map((node, index) => {
        return <SearchItem key={"node-" + index} node={node} />;
      })}
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
