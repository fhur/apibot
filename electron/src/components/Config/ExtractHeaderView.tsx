import { FormGroup } from "@blueprintjs/core";
import { ExecNode } from "@apibot/runtime";
import { $selectedNodeId } from "../../state";
import { useSetRecoilState } from "recoil";

export function ExtractHeaderView({ node }: { node: ExecNode }) {
  return (
    <div>
      <p>Extract Header View</p>
      <FormGroup></FormGroup>
    </div>
  );
}
