import {
  Button,
  Colors,
  Dialog,
  Drawer,
  HotkeyConfig,
  InputGroup,
  useHotkeys,
} from '@blueprintjs/core';
import styled from '@emotion/styled';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { CenterPanel } from './components/CenterPanel';
import { LeftPanel } from './components/LeftPanel';
import { NavigationBar } from './components/Navbar';
import { RightPanel } from './components/RightPanel';
import { ScopeDrawer } from './components/ScopeDrawer';
import { SearchItem } from './components/SearchPanel/SearchItem';
import './Root.css';
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
} from './state';

function App() {
  const showAlert = useSetRecoilState($showAlert);
  const showDrawer = useSetRecoilState($showDrawer);

  // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
  const hotkeys: HotkeyConfig[] = React.useMemo(
    () => [
      {
        combo: 'cmd+k',
        label: 'Omnibar',
        global: true,

        onKeyDown: () => {
          showAlert('omnibox');
        },
      },
      {
        combo: 'cmd+f',

        label: 'Omnibar',
        global: true,
        preventDefault: true,

        onKeyDown: () => {
          showAlert('omnibox');
        },
      },
      {
        combo: 'cmd+enter',
        label: 'Run Current Scenario',
        global: true,

        onKeyDown: () => {
          showAlert('confirm-execute-graph');
        },
      },
      {
        combo: 'cmd+x',
        label: 'Run Current Scenario',
        global: true,

        onKeyDown: () => {
          showAlert('confirm-execute-graph');
        },
      },
      {
        combo: 'cmd+/',
        label: 'Show Current Scope',
        global: true,

        onKeyDown: () => {
          showDrawer((x) => !x);
        },
      },
    ],
    []
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <>
      <div
        id="RootComponent"
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
  const nodes = useRecoilValue($omniboxResults);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  React.useEffect(() => setSelectedIndex(0), [nodes]);
  const handleKeyUp = React.useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (e) => {
      console.log(e.key);
      if (e.key === 'ArrowUp') {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((i) => Math.min(i + 1, nodes.length - 1));
      } else if (e.key === 'Enter') {
        setSelectedGraphId(nodes[selectedIndex].id);
        setShowOmnibox(undefined);
        setQuery('');
      }
    },
    [nodes, selectedIndex]
  );
  return (
    <Dialog
      isOpen={showOmnibox === 'omnibox'}
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
      {nodes.map((node, index) => {
        return (
          <SearchItem
            key={'node-' + index}
            node={node}
            selected={index === selectedIndex}
          />
        );
      })}
    </Dialog>
  );
}

function AlertConfirmExecuteGraph() {
  const [showAlert, setShowAlert] = useRecoilState($showAlert);
  const [executionRequestId, setExecutionRequestId] = useRecoilState(
    $executionRequestId
  );
  const selectedGraph = useRecoilValue($selectedGraph);
  const selectedEnvironmentId = useRecoilValue($selectedEnvironmentId);
  function executeNode() {
    setShowAlert(undefined);
    const requestId = 'execution-request-id: ' + Math.floor(Date.now() / 10000);
    setExecutionRequestId(requestId);
    console.log('Execute node ' + selectedEnvironmentId, requestId);
  }
  const handleExecuteNode = React.useCallback(
    (e) => {
      if (e.key === 'Enter') {
        console.log(e.key);
        executeNode();
      }
    },
    [executeNode]
  );

  return (
    <Dialog
      isOpen={
        showAlert === 'confirm-execute-graph' &&
        executionRequestId === undefined
      }
      onClose={() => setShowAlert(undefined)}
      style={{ width: 300 }}
    >
      <Container>
        <p>
          Are you sure you want to run <strong>{selectedGraph?.title}</strong>?
        </p>
        <Button
          icon="play"
          intent="primary"
          fill={false}
          style={{ maxWidth: 150 }}
          onKeyUp={handleExecuteNode}
          onClick={executeNode}
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

export default App;

const mainPanel: React.CSSProperties = {
  flex: 1,
  height: '100%',
  flexShrink: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
};
