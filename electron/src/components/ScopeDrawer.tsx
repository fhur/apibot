import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { $currentExecution, $showDrawer } from '../state';
import { Drawer, Colors, InputGroup } from '@blueprintjs/core';
import JSONTree from 'react-json-tree';
import styled from '@emotion/styled';
import { MonacoEditor } from './MonacoEditor';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

export function ScopeDrawer() {
  const [showDrawer, setShowDrawer] = useRecoilState($showDrawer);
  const currentExecution = useRecoilValue($currentExecution);
  const [filterScopeQuery, setFilterScopeQuery] = React.useState('');

  function filterCurrentExecution(scope: any, filterScopeQuery: string) {
    const keys = filterScopeQuery
      .trim()
      .split(' ')
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
      <VerticalContainer>
        <InputGroup
          value={filterScopeQuery}
          onChange={(e) => setFilterScopeQuery(e.target.value)}
          autoFocus
          fill
          placeholder="type to filter"
          style={{
            borderRadius: 0,
            borderBottom: `1px solid ${Colors.LIGHT_GRAY1}`,
          }}
        ></InputGroup>
        <MonacoEditor value={JSON.stringify(filteredScope, null, 2)} />
      </VerticalContainer>
    </Drawer>
  );
}

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
