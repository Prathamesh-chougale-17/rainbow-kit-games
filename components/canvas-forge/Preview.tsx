"use client";

interface PreviewProps {
  srcDoc: string;
}

export function Preview({ srcDoc }: PreviewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow bg-white">
        <iframe
          srcDoc={srcDoc}
          title="Live Preview"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
          className="border-0"
        />
      </div>
    </div>
  );
}
