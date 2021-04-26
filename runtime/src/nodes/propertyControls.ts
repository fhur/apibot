type CommonProps = {
  index?: number;
  label?: string;
  description?: string;
};

export type PropertyControlScopeIdentifier = {
  type: "scope-identifier";
  value: string;
} & CommonProps;

export type PropertyControlJsonPath = {
  type: "json-path";
  value: string;
} & CommonProps;

export type PropertyControlNumber = {
  type: "number";
  value: number;
  min?: number;
  max?: number;
} & CommonProps;

export type PropertyControlString = {
  type: "string";
  value: string;
} & CommonProps;

export type PropertyControlStringMap = {
  type: "string-map";
  value: Record<string, string>;
} & CommonProps;

export type PropertyControl =
  | PropertyControlString
  | PropertyControlJsonPath
  | PropertyControlScopeIdentifier
  | PropertyControlNumber
  | PropertyControlStringMap;
