import { Colors, Drawer, InputGroup } from "@blueprintjs/core";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { JsonEditor } from "./Editor";
import { $currentExecution, $showDrawer } from "../state";

export function ScopeDrawer() {
  const [showDrawer, setShowDrawer] = useRecoilState($showDrawer);
  const currentExecution = useRecoilValue($currentExecution);

  return (
    <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} size="90%">
      <ScopeSearch scope={currentExecution} />
    </Drawer>
  );
}

function filterCurrentExecution(scope: any, filterScopeQuery: string) {
  const keys = filterScopeQuery
    .trim()
    .split(" ")
    .filter((x) => x.trim().length > 0);
  if (keys.length === 0) {
    return scope;
  }
  let filteredScope = scope;
  let lastKey = keys[0];
  for (const key of keys) {
    try {
      const match = Object.entries(filteredScope).find(([entryKey]) =>
        entryKey.toLowerCase().includes(key.toLowerCase())
      );
      if (!match) {
        return {};
      }
      lastKey = match[0];
      filteredScope = match[1];
    } catch (_) {
      return { [lastKey]: filteredScope };
    }
  }
  return { [lastKey]: filteredScope };
}

export function ScopeSearch({ scope }: { scope: any }) {
  const [filterScopeQuery, setFilterScopeQuery] = React.useState("");

  const filteredScope = filterCurrentExecution(scope, filterScopeQuery);
  return (
    <>
      <InputGroup
        value={filterScopeQuery}
        onChange={(e) => setFilterScopeQuery(e.target.value)}
        autoFocus
        placeholder="type to filter"
        style={{
          borderRadius: 0,
          borderBottom: `1px solid ${Colors.LIGHT_GRAY1}`,
        }}
      ></InputGroup>
      <JsonEditor value={filteredScope} />
    </>
  );
}
