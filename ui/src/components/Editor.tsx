import styled from "@emotion/styled";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { Controlled as CodeMirror } from "react-codemirror2";

require("codemirror/mode/javascript/javascript");

export function Editor({ value }: { value: string }) {
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

const Container = styled.div`
  flex: 1;
  display: flex;
`;
