"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, DragEvent, useRef } from "react";
import { FileCode2, Upload } from "lucide-react";
import { useI18n } from "@/i18n/provider";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <EditorLoading />,
});

function EditorLoading() {
  const { messages } = useI18n();
  return <div className="editor-loading">{messages.editor.loading}</div>;
}
const MAX_FILE_BYTES = 2 * 1024 * 1024;

interface Props {
  label: string;
  fileName: string;
  version: string;
  value: string;
  onChange(value: string, fileName?: string): void;
  onError(message: string): void;
}

export function SpecificationEditor({
  label,
  fileName,
  version,
  value,
  onChange,
  onError,
}: Props) {
  const { messages } = useI18n();
  const t = messages.editor;
  const inputRef = useRef<HTMLInputElement>(null);
  async function readFile(file?: File) {
    if (!file) return;
    if (!/\.(ya?ml|json)$/i.test(file.name)) return onError(t.chooseFile);
    if (file.size > MAX_FILE_BYTES) return onError(t.size);
    onChange(await file.text(), file.name);
  }
  const upload = (event: ChangeEvent<HTMLInputElement>) =>
    void readFile(event.target.files?.[0]);
  const drop = (event: DragEvent) => {
    event.preventDefault();
    void readFile(event.dataTransfer.files[0]);
  };
  const language =
    fileName.endsWith(".json") || value.trimStart().startsWith("{")
      ? "json"
      : "yaml";
  return (
    <section
      className="editor-card"
      onDragOver={(e) => e.preventDefault()}
      onDrop={drop}
      aria-label={`${label} ${t.specification}`}
    >
      <div className="editor-header">
        <div>
          <FileCode2 size={18} />
          <strong>{label}</strong>
          <span className="tag">v{version}</span>
        </div>
        <span className="mono editor-language">{language.toUpperCase()}</span>
      </div>
      <div className="editor-file">
        <span>{fileName}</span>
        <button type="button" onClick={() => inputRef.current?.click()}>
          {t.upload}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".yaml,.yml,.json"
          hidden
          onChange={upload}
        />
      </div>
      <div className="monaco-wrap">
        <MonacoEditor
          height="100%"
          language={language}
          value={value}
          onChange={(next) => onChange(next ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontFamily: "JetBrains Mono",
            fontSize: 13,
            lineHeight: 22,
            lineNumbersMinChars: 3,
            padding: { top: 18, bottom: 18 },
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            wordWrap: "on",
            ariaLabel: `${label} ${t.openApiEditor}`,
          }}
        />
      </div>
      <button
        className="editor-drop"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={15} /> {t.drop}
      </button>
      <div className="editor-status">
        <span>{t.ready}</span>
        <span>
          UTF-8 &nbsp;·&nbsp; {value.split("\n").length} {t.lines}
        </span>
      </div>
    </section>
  );
}
