import React from 'react';
import { ExecNode } from '@apibot/runtime';
import { Colors, ControlGroup, FormGroup, InputGroup } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { MonacoEditor } from '../MonacoEditor';
import { indexProps } from './../../model/nodes';

export function HttpNodeView({ node }: { node: ExecNode }) {
  const { method, url, headers = {}, queryParams = {}, body } = indexProps(
    node.config
  );
  return (
    <Container>
      <FormGroup label="URL">
        <ControlGroup vertical={false}>
          <InputGroup
            placeholder="method"
            value={method}
            style={{ width: 80 }}
          />
          <InputGroup placeholder="url" fill value={url} />
        </ControlGroup>
      </FormGroup>

      <KeyValueView label="Query Params" object={queryParams} />

      <KeyValueView label="Headers" object={headers} />

      <EditorFormGroup label="Body">
        {body && (
          <EditorWrapper>
            <MonacoEditor value={JSON.stringify(body, null, 2)} />
          </EditorWrapper>
        )}
      </EditorFormGroup>
    </Container>
  );
}

const Container = styled.div`
  padding: 8px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorFormGroup = styled(FormGroup)`
  height: 100%;

  .bp3-form-content {
    height: 100%;
  }
`;

const EditorWrapper = styled.div`
  border-radius: 3px;
  border: 1px solid ${Colors.LIGHT_GRAY1};
  height: 100%;
`;

export function KeyValueView({
  object,
  label,
}: {
  object: object;
  label: string;
}) {
  const entries = Object.entries(object);
  return (
    <FormGroup label={label}>
      {entries.map(([key, value], index) => (
        <ControlGroup
          key={key}
          vertical={false}
          fill
          style={{ marginBottom: index < entries.length - 1 ? 8 : 0 }}
        >
          <InputGroup value={key}></InputGroup>
          <InputGroup value={value + ''}></InputGroup>
        </ControlGroup>
      ))}
    </FormGroup>
  );
}
