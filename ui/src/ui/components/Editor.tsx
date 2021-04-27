import { Colors } from "@blueprintjs/core";
import styled from "@emotion/styled";
import * as monaco from "monaco-editor";
import React from "react";

// export function Editor2({ value }: { value: string }) {
//   return (
//     <Container>
//       <CodeMirror
//         value={value}
//         options={{
//           mode: { name: "javascript", json: true },
//           theme: "idea",
//           lineNumbers: false,
//         }}
//         onBeforeChange={() => {}}
//       />
//     </Container>
//   );
// }

export function JsonEditor({ value }: { value: any }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [model, setModel] = React.useState<monaco.editor.ITextModel | null>(
    null
  );
  React.useEffect(() => {
    const editor = monaco.editor.create(ref.current!, {
      minimap: { enabled: false },
      lineNumbers: "off",
      scrollBeyondLastLine: false,
      contextmenu: false,
      selectionHighlight: false,
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      folding: false,
      fixedOverflowWidgets: true,
      automaticLayout: true,
    });

    const str = JSON.stringify(value ?? null, null, 2);
    const model = monaco.editor.createModel(str, "json");
    editor.setModel(model);
    setModel(model);
  }, []);

  React.useEffect(() => {
    const str = JSON.stringify(value ?? null, null, 2);
    if (model) {
      model.setValue(str);
    }
  }, [value]);

  return (
    <EditorWrapper>
      <div
        ref={ref}
        style={{ position: "relative", width: "100%", height: "100%" }}
      />
    </EditorWrapper>
  );
}

const EditorWrapper = styled.div`
  border-radius: 3px;
  border: 1px solid ${Colors.LIGHT_GRAY1};
  height: 100%;
`;
