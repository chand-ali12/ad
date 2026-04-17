import { useMemo } from "react";

export default function PDFViewer_VerifyCerificate({ pdfUrl }) {
  const viewerUrl = useMemo(() => {
    if (!pdfUrl) return "";
    return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitPage`;
  }, [pdfUrl]);

  if (!pdfUrl) {
    return <div className="text-sm text-gray-500">No PDF available</div>;
  }

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <embed
        src={viewerUrl}
        type="application/pdf"
        style={{
          border: "none",
          display: "block",
          position: "absolute",
          top: "-6%",
          left: "-6%",
          width: "112%",
          height: "112%",
        }}
      />
    </div>
  );
}
