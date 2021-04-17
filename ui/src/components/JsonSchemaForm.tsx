import { Colors } from "@blueprintjs/core";
import Editor from "@monaco-editor/react";
import Form from "@rjsf/core";

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
    >
      <Editor
        height={"80%"}
        defaultLanguage="json"
        defaultValue="{  }"
        options={{ minimap: { enabled: false } }}
      />
    </div>
  );
  //return <Form schema={schema} liveValidate></Form>;
}
