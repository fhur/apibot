import {
  Button,
  Colors,
  Dialog,
  Drawer,
  HotkeyConfig,
  InputGroup,
  useHotkeys,
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import styled from "@emotion/styled";
import "normalize.css/normalize.css";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./App.css";
import { CenterPanel } from "./components/CenterPanel";
import { Editor } from "./components/Editor";
import { LeftPanel } from "./components/LeftPanel";
import { NavigationBar } from "./components/Navbar";
import { RightPanel } from "./components/RightPanel";
import { SearchItem } from "./components/SearchPanel/SearchItem";
import { useExecuteGraph } from "./model/useExecuteGraph";
import {
  $currentExecution,
  $executionRequestId,
  $omniboxQuery,
  $omniboxResults,
  $selectedEnvironmentId,
  $selectedGraph,
  $selectedGraphId,
  $showAlert,
  $showDrawer,
} from "./state";

function App() {
  const showAlert = useSetRecoilState($showAlert);
  const showDrawer = useSetRecoilState($showDrawer);

  // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
  const hotkeys: HotkeyConfig[] = React.useMemo(
    () => [
      {
        combo: "cmd+k",
        label: "Omnibar",
        global: true,

        onKeyDown: () => {
          showAlert("omnibox");
        },
      },
      {
        combo: "cmd+f",

        label: "Omnibar",
        global: true,
        preventDefault: true,

        onKeyDown: () => {
          showAlert("omnibox");
        },
      },
      {
        combo: "cmd+enter",
        label: "Run Current Scenario",
        global: true,

        onKeyDown: () => {
          showAlert("confirm-execute-graph");
        },
      },
      {
        combo: "cmd+x",
        label: "Run Current Scenario",
        global: true,

        onKeyDown: () => {
          showAlert("confirm-execute-graph");
        },
      },
      {
        combo: "cmd+/",
        label: "Show Current Scope",
        global: true,

        onKeyDown: () => {
          showDrawer((x) => !x);
        },
      },
    ],
    [showAlert, showDrawer]
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <>
      <div
        className="App"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <NavigationBar />
        <div style={mainPanel}>
          <LeftPanel></LeftPanel>
          <CenterPanel></CenterPanel>
          <RightPanel></RightPanel>
        </div>
      </div>
      <ScopeDrawer />
      <Omnibox />
      <AlertConfirmExecuteGraph />
    </>
  );
}

function Omnibox() {
  const [showOmnibox, setShowOmnibox] = useRecoilState($showAlert);
  const [query, setQuery] = useRecoilState($omniboxQuery);
  const setSelectedGraphId = useSetRecoilState($selectedGraphId);
  const graph = useRecoilValue($omniboxResults);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  React.useEffect(() => setSelectedIndex(0), [graph]);
  const handleKeyUp = React.useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((i) => Math.min(i + 1, graph.length - 1));
      } else if (e.key === "Enter") {
        setSelectedGraphId(graph[selectedIndex].id);
        setShowOmnibox(undefined);
        setQuery("");
      }
    },
    [graph, selectedIndex, setQuery, setShowOmnibox, setSelectedGraphId]
  );
  return (
    <Dialog
      isOpen={showOmnibox === "omnibox"}
      onClose={() => setShowOmnibox(undefined)}
    >
      <InputGroup
        leftIcon="search"
        placeholder="Search anything"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        onKeyUp={handleKeyUp}
      ></InputGroup>
      {graph.map((graph, index) => {
        return (
          <SearchItem
            key={"node-" + index}
            graph={graph}
            selected={index === selectedIndex}
          />
        );
      })}
    </Dialog>
  );
}

function AlertConfirmExecuteGraph() {
  const [showAlert, setShowAlert] = useRecoilState($showAlert);
  const [executionRequestId] = useRecoilState($executionRequestId);
  const selectedGraph = useRecoilValue($selectedGraph);
  const selectedEnvironmentId = useRecoilValue($selectedEnvironmentId);

  const executeGraph = useExecuteGraph();

  const handleExecuteNode = React.useCallback(
    (e) => {
      if (e.key === "Enter") {
        executeGraph();
      }
    },
    [executeGraph]
  );

  return (
    <Dialog
      isOpen={
        showAlert === "confirm-execute-graph" &&
        executionRequestId === undefined
      }
      onClose={() => setShowAlert(undefined)}
      style={{ width: 300 }}
    >
      <Container>
        <p>Running {selectedGraph?.root?.title}? Press enter to continue.</p>
        <Button
          icon="play"
          intent="primary"
          fill={false}
          style={{ maxWidth: 150 }}
          onKeyUp={handleExecuteNode}
          onClick={executeGraph}
          autoFocus
        >
          Run on {selectedEnvironmentId}
        </Button>
      </Container>
    </Dialog>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 0 16px;
  align-items: center;
`;

function ScopeDrawer() {
  const [showDrawer, setShowDrawer] = useRecoilState($showDrawer);
  const currentExecution = useRecoilValue($currentExecution);
  const [filterScopeQuery, setFilterScopeQuery] = React.useState("");

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

  const filteredScope = filterCurrentExecution(
    currentExecution,
    filterScopeQuery
  );

  return (
    <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} size="90%">
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
      <Editor value={JSON.stringify(filteredScope, null, 2)} />
    </Drawer>
  );
}

export default App;

const mainPanel: React.CSSProperties = {
  flex: 1,
  height: 1,
  flexShrink: 0,
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
  overflow: "hidden",
};
