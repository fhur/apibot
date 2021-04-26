import { ExecNode } from "@apibot/runtime";
import { ControlGroup, FormGroup, InputGroup } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { JsonEditor } from "../Editor";

export function HttpNodeView({ node }: { node: ExecNode }) {
  if (node.type !== "apibot.http-node") {
    throw Error("Expected HTTP node");
  }
  const {
    method,
    url,
    headers = { value: {} },
    queryParams = { value: {} },
    body,
  } = node.config;

  return (
    <Container>
      <FormGroup label="URL">
        <ControlGroup vertical={false}>
          <InputGroup
            placeholder="method"
            value={method.value}
            style={{ width: 80 }}
          />
          <InputGroup placeholder="url" fill value={url.value} />
        </ControlGroup>
      </FormGroup>

      <KeyValueView label="Query Params" object={queryParams.value} />

      <KeyValueView label="Headers" object={headers.value} />

      <EditorFormGroup label="Body">
        {body.value && <JsonEditor value={body.value} />}
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

export function KeyValueView({
  object = {},
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
          <InputGroup value={value + ""}></InputGroup>
        </ControlGroup>
      ))}
    </FormGroup>
  );
}
