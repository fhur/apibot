import { ExecNode } from "@apibot/runtime";
import { FormGroup, InputGroup } from "@blueprintjs/core";
import React from "react";

export function ExtractHeaderView({ node }: { node: ExecNode }) {
  return (
    <div>
      <p>Extract Header View</p>
      <FormGroup label="Header Name"></FormGroup>
    </div>
  );
}

function ConfigView({
  node,
}: {
  node: ExecNode;
  onValueChange(node: ExecNode): void;
}) {}

export function FormString({ label, description, fieldId, value, onChange }) {
  const handleChange = React.useCallback(
    (e) => {
      onChange(fieldId, e.target.value);
    },
    [onChange, fieldId]
  );
  return (
    <FormGroup label={label} helperText={description}>
      <InputGroup value={value} onChange={handleChange}></InputGroup>
    </FormGroup>
  );
}
