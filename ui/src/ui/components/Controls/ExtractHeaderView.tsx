import { NodeExtractHeader } from "@apibot/runtime";
import { Control, useOnArgChange } from "./controls";

export function ExtractHeaderView({
  node,
  args,
}: {
  node: NodeExtractHeader;
  args: NodeExtractHeader["args"];
}) {
  const handleArgsChange = useOnArgChange(node.id);
  return (
    <div>
      <p>Extract Header View</p>
      <Control node={node} args={args} fieldId={"headerName"} />
      <Control node={node} args={args} fieldId={"as"} />
    </div>
  );
}
