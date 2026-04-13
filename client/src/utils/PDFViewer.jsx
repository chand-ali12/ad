import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";

export default function PDFViewer({ pdfUrl, bigSize = false }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(400);

  const proxyUrl = `/pdf-proxy${pdfUrl
    .split("#")[0]
    .replace("https://auth-detect.s3.amazonaws.com", "")}`;

  // Dynamically calculate available width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center bg-white"
      style={{
        overflow: "hidden", // 🚫 removes scrollbars
      }}
    >
      <Document
        file={proxyUrl}
        loading={<div className="text-sm text-gray-500">Loading PDF...</div>}
        error={(err) => {
          console.error("PDF load error:", err);
          return (
            <div className="text-sm text-red-500">Failed to load PDF</div>
          );
        }}
      >
        <Page
          pageNumber={1}
          width={bigSize ? width : width * 0.6}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}