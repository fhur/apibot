import { ExecNode } from "@apibot/runtime";
import { FormGroup } from "@blueprintjs/core";

export function ExtractHeaderView({ node }: { node: ExecNode }) {
  return (
    <div>
      <p>Extract Header View</p>
      <FormGroup></FormGroup>
    </div>
  );
}
