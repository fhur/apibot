import { NodeExtractResponse } from "@apibot/runtime";
import { Control, useOnArgChange } from "./controls";

export function ExtractResponseControl({
  node,
  args,
}: {
  node: NodeExtractResponse;
  args: NodeExtractResponse["args"];
}) {
  const handleArgsChange = useOnArgChange(node.id);
  return (
    <div>
      <p>Extract Response</p>
      <Control node={node} args={args} fieldId={"extract"} />
      <Control node={node} args={args} fieldId={"as"} />
    </div>
  );
}
