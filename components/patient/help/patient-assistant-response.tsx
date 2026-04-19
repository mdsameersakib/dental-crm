type PatientAssistantResponseProps = {
  text: string;
};

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  let cursor = 0;

  return parts.map((part) => {
    const key = `${cursor}-${part}`;
    cursor += part.length;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function renderLine(line: string, key: string) {
  const trimmed = line.trim();

  if (!trimmed) {
    return <div key={key} className="h-2" />;
  }

  if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
    return (
      <li key={key} className="ml-5 list-disc text-sm leading-7 text-slate-700">
        {renderInlineFormatting(trimmed.slice(2))}
      </li>
    );
  }

  if (/^\d+\.\s/.test(trimmed)) {
    return (
      <li
        key={key}
        className="ml-5 list-decimal text-sm leading-7 text-slate-700"
      >
        {renderInlineFormatting(trimmed.replace(/^\d+\.\s/, ""))}
      </li>
    );
  }

  return (
    <p key={key} className="text-sm leading-7 text-slate-700">
      {renderInlineFormatting(trimmed)}
    </p>
  );
}

export function PatientAssistantResponse({
  text,
}: PatientAssistantResponseProps) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (listBuffer.length === 0 || !listType) {
      return;
    }

    blocks.push(
      listType === "ul" ? (
        <ul key={key} className="space-y-1">
          {listBuffer}
        </ul>
      ) : (
        <ol key={key} className="space-y-1">
          {listBuffer}
        </ol>
      ),
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
    const isNumbered = /^\d+\.\s/.test(trimmed);

    if (isBullet || isNumbered) {
      const nextListType = isBullet ? "ul" : "ol";
      if (listType && listType !== nextListType) {
        flushList(`flush-${index}`);
      }
      listType = nextListType;
      listBuffer.push(renderLine(line, `line-${index}`));
      return;
    }

    flushList(`flush-${index}`);
    blocks.push(renderLine(line, `line-${index}`));
  });

  flushList("flush-final");

  return <div className="space-y-3">{blocks}</div>;
}
