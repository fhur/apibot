import { NodeHttp } from "@apibot/runtime";
import { ControlGroup, FormGroup, InputGroup } from "@blueprintjs/core";
import styled from "@emotion/styled";
import { Control, useOnArgChange } from "./controls";

function ControlMethodUrl({
  node,
  args,
}: {
  node: NodeHttp;
  args: NodeHttp["args"];
}) {
  const { method = "GET", url } = args;
  const handleArgChange = useOnArgChange(node.id);
  return (
    <FormGroup label="URL">
      <ControlGroup vertical={false}>
        <InputGroup
          placeholder="method"
          value={method}
          style={{ width: 80 }}
          onChange={(e) => handleArgChange("method", e.target.value)}
        />
        <InputGroup
          placeholder="url"
          fill
          value={url}
          onChange={(e) => handleArgChange("url", e.target.value)}
        />
      </ControlGroup>
    </FormGroup>
  );
}

export function HttpNodeView({
  node,
  args,
}: {
  node: NodeHttp;
  args: NodeHttp["args"];
}) {
  return (
    <Container>
      <ControlMethodUrl node={node} args={args} />

      <Control node={node} args={args} fieldId={"queryParams"} />

      <Control node={node} args={args} fieldId={"headers"} />
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
