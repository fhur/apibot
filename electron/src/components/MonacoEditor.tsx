import * as monaco from 'monaco-editor';
import React from 'react';

export function MonacoEditor({ value }: { value: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const model = React.useRef<monaco.editor.ITextModel>(
    monaco.editor.createModel(value, 'json')
  );

  React.useEffect(() => {
    const node = ref.current!;

    const editor = monaco.editor.create(node, {
      language: 'json',
      minimap: { enabled: false },
      lineNumbers: 'off',
      scrollBeyondLastLine: false,
      contextmenu: false,
      selectionHighlight: false,
      overviewRulerBorder: false,
      // @ts-ignore
      overviewRulerLanes: false,
      folding: false,
      fixedOverflowWidgets: true,
      automaticLayout: true,
      model: model.current,
    });
    return () => {
      editor?.dispose();
    };
  }, []);

  React.useEffect(() => {
    model.current.setValue(value);
  }, [value]);

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      ref={ref}
    />
  );
}
