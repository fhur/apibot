import { NodeAssertStatus } from "@apibot/runtime";
import { Control } from "./controls";

export function AssertStatusControl({
  node,
  args,
}: {
  node: NodeAssertStatus;
  args: NodeAssertStatus["args"];
}) {
  return (
    <div>
      <p>Assert Status</p>
      <Control node={node} args={args} fieldId={"from"} />
      <Control node={node} args={args} fieldId={"to"} />
    </div>
  );
}
