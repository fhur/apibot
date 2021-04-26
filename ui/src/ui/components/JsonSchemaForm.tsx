import { Colors } from "@blueprintjs/core";

type Props = {
  schema: any;
};

export function JsonSchemaForm({ schema }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: `1px solid ${Colors.LIGHT_GRAY1}`,
      }}
    ></div>
  );
}
