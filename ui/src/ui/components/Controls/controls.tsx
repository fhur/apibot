import { PropertyControl } from "@apibot/compiler/node_modules/@apibot/runtime/build/nodes/propertyControls";
import { ExecNode, propertyControls } from "@apibot/runtime";
import {
  ControlGroup,
  FormGroup,
  InputGroup,
  NumericInput,
} from "@blueprintjs/core";
import styled from "@emotion/styled";
import React from "react";
import { useSetRecoilState } from "recoil";
import { $argsByNodeId } from "../../state";

export function ControlViewString({
  fieldId,
  value,
  onChange,
  control,
}: {
  fieldId: string;
  onChange(fieldId: string, value: string): void;
  value: string;
  control: propertyControls.PropertyControlString;
}) {
  const handleChange = React.useCallback(
    (e) => {
      onChange(fieldId, e.target.value);
    },
    [onChange, fieldId]
  );
  return (
    <FormGroup label={control.label} helperText={control.description}>
      <InputGroup value={value} onChange={handleChange}></InputGroup>
    </FormGroup>
  );
}

type FormControl<P extends propertyControls.PropertyControl> = {
  fieldId: string;
  value: P["value"];
  onChange(fieldId: string, value: P["value"]): void;
  control: P;
};

export function ControlViewNumber({
  fieldId,
  value,
  onChange,
  control,
}: FormControl<propertyControls.PropertyControlNumber>) {
  const [localNumber, setLocalNumber] = React.useState(value);
  React.useEffect(() => {
    setLocalNumber(value);
  }, [value]);

  const handleChange = React.useCallback<
    (num: number, numAsString: string) => void
  >(
    (num, numAsString) => {
      setLocalNumber(num);

      if (!isNaN(num) && value !== num) {
        onChange(fieldId, num);
      }
    },
    [onChange, fieldId, setLocalNumber]
  );

  return (
    <FormGroup label={control.label} helperText={control.description}>
      <NumericInput value={value} onValueChange={handleChange}></NumericInput>
    </FormGroup>
  );
}

export function ControlViewStringMap({
  fieldId,
  value,
  onChange,
  control,
}: FormControl<propertyControls.PropertyControlStringMap>) {
  const handleKeyChange = React.useCallback(
    (oldKey: string, newKey: string) => {
      const { [oldKey]: oldValue, ...rest } = value;
      onChange(fieldId, { ...rest, [newKey]: oldValue });
    },
    [onChange, value]
  );

  const handleValueChange = React.useCallback(
    (oldKey: string, newValue: string) => {
      const { [oldKey]: _, ...rest } = value;
      onChange(fieldId, { ...rest, [oldKey]: newValue });
    },
    [onChange, value]
  );

  const entries = Object.entries(value ?? {});
  return (
    <FormGroup label={control.label} helperText={control.description}>
      {entries.map(([key, value], index) => (
        <ControlGroup
          key={key}
          vertical={false}
          fill
          style={{ marginBottom: index < entries.length - 1 ? 8 : 0 }}
        >
          <InputGroup
            value={key}
            onChange={(e) => handleKeyChange(key, e.target.value)}
          ></InputGroup>
          <InputGroup
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
          ></InputGroup>
        </ControlGroup>
      ))}
    </FormGroup>
  );
}

export function useOnArgChange(nodeId: string) {
  const setArgsByNodeId = useSetRecoilState($argsByNodeId);
  const handleArgsChange = React.useCallback(
    (fieldId: string, newArgs: unknown) => {
      // TODO
    },
    [setArgsByNodeId, nodeId]
  );

  return handleArgsChange;
}

export function Control<T extends ExecNode>({
  node,
  args,
  fieldId,
}: {
  fieldId: keyof T["args"] & string;
  node: T;
  args: T["args"];
}) {
  const handleArgChange = useOnArgChange(node.id);
  const propertyControl: PropertyControl = (node.config as any)[fieldId];

  const value: any = (args ?? {})[fieldId];

  console.log("Control", propertyControl, value, args, fieldId);
  if (propertyControl.type === "string") {
    return (
      <ControlViewString
        value={value}
        onChange={handleArgChange}
        fieldId={fieldId}
        control={propertyControl}
      />
    );
  }
  if (propertyControl.type === "string-map") {
    return (
      <ControlViewStringMap
        value={value}
        onChange={handleArgChange}
        fieldId={fieldId}
        control={propertyControl}
      />
    );
  }
  if (propertyControl.type === "number") {
    return (
      <ControlViewNumber
        value={value}
        onChange={handleArgChange}
        fieldId={fieldId}
        control={propertyControl}
      />
    );
  }
  if (propertyControl.type === "json-path") {
    // TODO: implement control view json-path
    return (
      <ControlViewString
        value={value}
        onChange={handleArgChange}
        fieldId={fieldId}
        control={propertyControl as any}
      />
    );
  }
  if (propertyControl.type === "scope-identifier") {
    // TODO: implement control view json-path
    return (
      <ControlViewString
        value={value}
        onChange={handleArgChange}
        fieldId={fieldId}
        control={propertyControl as any}
      />
    );
  }

  return <p>unknown property control: {(propertyControl as any).type}</p>;
}

export function ControlView<T extends ExecNode>({
  node,
  args,
}: {
  node: T;
  args: T["args"];
}) {
  const propertyControls = Object.entries(node.config).sort(
    ([k1, a], [k2, b]) => (b.index ?? 0) - (a.index ?? 0)
  );
  const controls = propertyControls.map(([fieldId, propertyControl]) => {
    return (
      <Control key={fieldId} node={node} args={args} fieldId={fieldId as any} />
    );
  });
  return (
    <Container>
      <p>{node.title}</p>
      {controls}
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
