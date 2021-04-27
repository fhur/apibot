import { NodeExtractBody } from "@apibot/runtime";
import { Control, useOnArgChange } from "./controls";

export function ExtractBodyControl({
  node,
  args,
}: {
  node: NodeExtractBody;
  args: NodeExtractBody["args"];
}) {
  return (
    <div>
      <p>Extract Body</p>
      <Control node={node} args={args} fieldId={"extract"} />
      <Control node={node} args={args} fieldId={"as"} />
    </div>
  );
}
