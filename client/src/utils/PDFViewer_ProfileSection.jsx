import { useMemo } from "react";

export default function PDFViewer_ProfileSection({ pdfUrl }) {
  const viewerUrl = useMemo(() => {
    if (!pdfUrl) return "";
    return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH,0`;
  }, [pdfUrl]);

  if (!pdfUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        No PDF available
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white relative">
      <embed
        src={viewerUrl}
        type="application/pdf"
        style={{
          border: "none",
          display: "block",
          position: "absolute",
          top: "-4%",
          left: "-4%",
          width: "108%",
          height: "108%",
        }}
      />
    </div>
  );
}
