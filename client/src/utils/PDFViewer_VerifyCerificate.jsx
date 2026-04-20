import { useEffect, useMemo, useRef } from "react";

export default function PDFViewer_VerifyCerificate({ pdfUrl }) {
  const scrollRef = useRef(null);

  const viewerUrl = useMemo(() => {
    if (!pdfUrl) return "";
    return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=Fit`;
  }, [pdfUrl]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const centerScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max > 0) {
        el.scrollLeft = max / 2;
      }
    };

    const timers = [
      setTimeout(centerScroll, 50),
      setTimeout(centerScroll, 400),
      setTimeout(centerScroll, 900),
    ];

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [viewerUrl]);

  if (!pdfUrl) {
    return <div className="text-sm text-gray-500">No PDF available</div>;
  }

  return (
    <div
      ref={scrollRef}
      className="w-full h-full relative"
      style={{
        backgroundColor: "#ffffff",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <iframe
        title="Certificate"
        src={viewerUrl}
        scrolling="no"
        style={{
          border: "none",
          display: "block",
          width: "130%",
          height: "100%",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
}
