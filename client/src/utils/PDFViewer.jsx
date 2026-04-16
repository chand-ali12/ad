// import { Document, Page } from "react-pdf";
// import { useEffect, useRef, useState } from "react";

// export default function PDFViewer({ pdfUrl, bigSize = false }) {
//   const containerRef = useRef(null);
//   const [width, setWidth] = useState(400);

//   const proxyUrl = `/pdf-proxy${pdfUrl
//     .split("#")[0]
//     .replace("https://auth-detect.s3.amazonaws.com", "")}`;

//   // Dynamically calculate available width
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const resizeObserver = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         setWidth(entry.contentRect.width);
//       }
//     });

//     resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="w-full flex justify-center bg-white"
//       style={{
//         overflow: "hidden", // 🚫 removes scrollbars
//       }}
//     >
//       <Document
//         file={proxyUrl}
//         loading={<div className="text-sm text-gray-500">Loading PDF...</div>}
//         error={(err) => {
//           console.error("PDF load error:", err);
//           return (
//             <div className="text-sm text-red-500">Failed to load PDF</div>
//           );
//         }}
//       >
//         <Page
//           pageNumber={1}
//           width={bigSize ? width : width * 0.6}
//           renderTextLayer={false}
//           renderAnnotationLayer={false}
//         />
//       </Document>
//     </div>
//   );
// }

// import { useMemo } from "react";

// export default function PDFViewer({ pdfUrl, bigSize = false }) {

//   console.log("PDF url is :- ", pdfUrl);

//   const viewerUrl = useMemo(() => {
//     if (!pdfUrl) return "";
//     return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
//   }, [pdfUrl]);

//   if (!pdfUrl) {
//     return (
//       <div className="text-sm text-gray-500">
//         No PDF available
//       </div>
//     );
//   }

//   return (
//     <div
//       className="w-full bg-white flex justify-center"
//       style={{
//         height: bigSize ? "90vh" : "500px",
//       }}
//     >
//       <iframe
//         src={viewerUrl}
//         title="PDF Viewer"
//         className="w-full h-full border-0"
//       />
//     </div>
//   );
// }

// import { useMemo } from "react";

// export default function PDFViewer({ pdfUrl, bigSize = false }) {
//   const viewerUrl = useMemo(() => {
//     if (!pdfUrl) return "";
//     // Google Docs embed – hides toolbar
//     return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}#toolbar=0`;
//   }, [pdfUrl]);

//   if (!pdfUrl) {
//     return <div className="text-sm text-gray-500">No PDF available</div>;
//   }

//   return (
//     <div
//       className="w-full bg-white flex justify-center items-center"
//       style={{
//         height: bigSize ? "90vh" : "500px",
//         backgroundColor: "#ffffff",
//         overflow: "hidden", // Hides any scrollbars on the wrapper
//       }}
//     >
//       <iframe
//         src={viewerUrl}
//         title="Certificate PDF"
//         className="w-full h-full border-0"
//         style={{
//           backgroundColor: "#ffffff",
//           overflow: "hidden", // Hides scrollbars inside the iframe
//         }}
//         scrolling="no" // Fallback for older browsers
//         sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
//       />
//     </div>
//   );
// }

import { useMemo } from "react";

export default function PDFViewer({ pdfUrl, bigSize = false }) {
  const viewerUrl = useMemo(() => {
    if (!pdfUrl) return "";
    // Direct PDF embed with hidden toolbar, navigation, and scrollbars
    return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  }, [pdfUrl]);

  if (!pdfUrl) {
    return <div className="text-sm text-gray-500">No PDF available</div>;
  }

  return (
    <div
      className="w-full bg-white flex justify-center items-center"
      style={{
        height: bigSize ? "100vh" : "500px",
        width: "100%",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <embed
        src={viewerUrl}
        type="application/pdf"
        className="w-full h-full"
        style={{
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
