import { Colors } from "@blueprintjs/core";
import styled from "@emotion/styled";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import * as monaco from "monaco-editor";
import React from "react";

require("codemirror/mode/javascript/javascript");

export function Editor2({ value }: { value: string }) {
  return (
    <Container>
      <CodeMirror
        value={value}
        options={{
          mode: { name: "javascript", json: true },
          theme: "idea",
          lineNumbers: false,
        }}
        onBeforeChange={() => {}}
      />
    </Container>
  );
}

export function Editor({ value }: { value: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [model] = React.useState(monaco.editor.createModel(value, "json"));
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

    editor.setModel(model);
  }, []);

  React.useEffect(() => {
    model.setValue(value);
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

const Container = styled.div`
  flex: 1;
  display: flex;
`;
