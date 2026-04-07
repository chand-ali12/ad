// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { useMediaQuery } from "@mui/material";
// import logo1 from "../../../public/assets/images/logo.png";
// import AdImage from "../zingImage";
// import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// const ReceiptPdfGenerator = ({
//   pdfDataToGenerate,
//   startDate,
//   endDate,
//   userInfo,
//   setShowPdfGeneratorPage,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [html2pdfModule, setHtml2pdfModule] = useState(null);
//   const receiptRef = useRef(null);
//   const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

//   useEffect(() => {
//     import("html2pdf.js")
//       .then((module) => {
//         setHtml2pdfModule(() => module.default || module);
//       })
//       .catch((error) => {
//         console.error("Failed to load html2pdf:", error);
//       });
//   }, []);

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "2-digit",
//     });
//   };

//   const totalPrice =
//     pdfDataToGenerate?.reduce((acc, item) => acc + item.price, 0) || 0;

//   const generatePDF = () => {
//     if (!html2pdfModule) {
//       notifyError("PDF generator is still loading. Please try again.");
//       return;
//     }

//     setIsLoading(true);
//     const element = receiptRef.current;

//     const options = {
//       margin: [15, 15, 15, 15], // Increased margins for better spacing
//       filename: `Receipt-${formatDate(new Date())}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       },
//       jsPDF: {
//         unit: "mm",
//         format: "a4",
//         orientation: "portrait",
//       },
//       pagebreak: { mode: ["avoid-all", "css", "legacy"] }, // Added pagebreak options
//     };

//     html2pdfModule()
//       .set(options)
//       .from(element)
//       .save()
//       .then(() => setIsLoading(false))
//       .catch((error) => {
//         console.error("PDF Generation Error:", error);
//         setIsLoading(false);
//         alert("Failed to generate PDF. Please try again.");
//       });
//   };

//   // Calculate number of items per page (approximately)
//   const itemsPerPage = 25;
//   const totalPages = Math.ceil(pdfDataToGenerate.length / itemsPerPage);

//   return (
//     <div
//       className="receipt-container"
//       style={{ padding: isMobile ? "0px" : "20px" }}
//     >
//       {isLoading && (
//         <div className="loading-overlay">
//           <div className="loading-spinner"></div>
//         </div>
//       )}

//       <div
//         className="pdf-button-container"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <KeyboardBackspaceIcon
//           sx={{
//             width: "50px",
//             height: "40px",
//             cursor: "pointer",
//             mt: 3,
//           }}
//           onClick={() => setShowPdfGeneratorPage(false)}
//         />
//         <button onClick={generatePDF} className="generate-pdf-btn">
//           Generate PDF
//         </button>
//       </div>

//       <div ref={receiptRef} id="receipt-content" className="receipt-content">
//         {Array.from({ length: totalPages }).map((_, pageIndex) => (
//           <div
//             key={pageIndex}
//             className={`page ${pageIndex > 0 ? "new-page" : ""}`}
//           >
//             {pageIndex === 0 && (
//               <>
//                 <div className="receipt-header avoid-break">
//                   <div
//                     className="header-top"
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                     }}
//                   >
//                     <div className="logo-placeholder">
//                       <img
//                         src={logo1.src}
//                         alt="logo"
//                         style={{
//                           width: isMobile ? "30px" : "50px",
//                           height: isMobile ? "auto" : "64px",
//                         }}
//                       />
//                     </div>
//                     <h3>RECEIPT</h3>
//                   </div>

//                   <div className="client-info">
//                     <div className="client-details">
//                       <p className="client-name">{"Client Name"}</p>
//                       <p className="client-name">
//                         <strong>{userInfo?.user?.name || "Client Name"}</strong>
//                       </p>
//                       <p className="client-email">
//                         {userInfo?.user?.email || "client@example.com"}
//                       </p>
//                     </div>
//                     <div className="date-range">
//                       <p>
//                         Date: {formatDate(startDate)} - {formatDate(endDate)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             <table className="receipt-table">
//               {pageIndex === 0 && (
//                 <thead className="avoid-break">
//                   <tr>
//                     <th>Order Number</th>
//                     <th>Brand</th>
//                     <th>Date</th>
//                     <th>Price</th>
//                     <th>Payment</th>
//                   </tr>
//                 </thead>
//               )}
//               <tbody>
//                 {pdfDataToGenerate
//                   // .slice(
//                   //   pageIndex * itemsPerPage,
//                   //   (pageIndex + 1) * itemsPerPage
//                   // )
//                   .map((row, index) => (
//                     <tr
//                       key={row.id || index}
//                       className={index % 2 === 0 ? "even-row" : "odd-row"}
//                     >
//                       <td>{row.order_number || "N/A"}</td>
//                       <td>{row.brand || "N/A"}</td>
//                       <td>
//                         {row.created_at
//                           ? new Date(row.created_at).toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td>${row.price?.toFixed(2) || "N/A"}</td>
//                       <td>
//                         {row.payment_status === 1 && row.is_refund === 0
//                           ? "Success"
//                           : row.payment_status === 1 && row.is_refund === 1
//                           ? "Refunded"
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>

//             {pageIndex === totalPages - 1 && (
//               <div className="total-section avoid-break">
//                 <div
//                   className="total-box"
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <span>Total:</span>
//                   <span>${totalPrice.toFixed(2)}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .receipt-container {
//           max-width: 100%;
//           margin: 0 auto;
//           box-sizing: border-box;
//         }

//         .new-page {
//           page-break-before: always;
//         }

//         .avoid-break {
//           page-break-inside: avoid;
//         }

//         .page {
//           margin-bottom: 20px;
//         }

//         .loading-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }

//         .loading-spinner {
//           width: 50px;
//           height: 50px;
//           border: 5px solid #f3f3f3;
//           border-top: 5px solid #3498db;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         .pdf-button-container {
//           margin-bottom: 20px;
//         }

//         .generate-pdf-btn {
//           padding: 10px 20px;
//           background-color: #000;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//           transition: background-color 0.3s ease;
//         }

//         .generate-pdf-btn:hover {
//           background-color: #333;
//         }

//         .receipt-content {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .header-top {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .client-info {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 20px;
//         }

//         .receipt-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-bottom: 20px;
//         }

//         .receipt-table th,
//         .receipt-table td {
//           border: 1px solid #ddd;
//           padding: 10px;
//           text-align: left;
//         }

//         .receipt-table thead {
//           background-color: #f2f2f2;
//         }

//         .even-row {
//           background-color: #f9f9f9;
//         }

//         .total-section {
//           display: flex;
//           justify-content: flex-end;
//           margin-top: 20px;
//         }

//         .total-box {
//           background-color: black;
//           color: white;
//           padding: 10px 20px;
//           border-radius: 5px;
//           display: inline-flex;
//           justify-content: space-between;
//           min-width: 200px;
//           width: 100%;
//           max-width: ${isMobile ? "100%" : "300px"};
//           box-sizing: border-box;
//         }

//         .total-box span:first-child {
//           margin-right: 20px;
//         }

//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #receipt-content * {
//             visibility: visible;
//           }
//           #receipt-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//           }
//         }

//         @media screen and (max-width: 768px) {
//           .client-info {
//             flex-direction: row;
//           }

//           .receipt-table {
//             font-size: 0.8rem;
//           }

//           .receipt-table th,
//           .receipt-table td {
//             padding: 6px;
//           }

//           .total-box {
//             flex-direction: column;
//             align-items: center;
//             text-align: center;
//             padding: 10px;
//           }

//           .client-details,
//           .date-range {
//             text-align: left;
//             margin-bottom: 10px;
//           }
//         }

//         @media screen and (max-width: 480px) {
//           .receipt-table {
//             font-size: 0.7rem;
//           }

//           .receipt-table th,
//           .receipt-table td {
//             padding: 4px;
//           }

//           .header-top {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .header-top h1 {
//             margin-top: 10px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ReceiptPdfGenerator;

"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";
import logo1 from "../../../public/assets/images/logo.png";
import AdImage from "../zingImage";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ADTextOnlyLogo from "../../../public/ADTextOnlyLogo.png";
import ADLogoTextOnly from "../../../public/assets/svgs/ADLogoTextOnly";

const ReceiptPdfGenerator = ({
  pdfDataToGenerate,
  startDate,
  endDate,
  userInfo,
  setShowPdfGeneratorPage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [html2pdfModule, setHtml2pdfModule] = useState(null);
  const receiptRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    import("html2pdf.js")
      .then((module) => {
        setHtml2pdfModule(() => module.default || module);
      })
      .catch((error) => {
        console.error("Failed to load html2pdf:", error);
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const totalPrice =
    pdfDataToGenerate?.reduce((acc, item) => {
      if (item.payment_status === 1 && item.is_refund === 0) {
        return acc + item.amount;
      }
      return acc;
    }, 0) || 0;

  const generatePDF = () => {
    if (!html2pdfModule) {
      notifyError("PDF generator is still loading. Please try again.");
      return;
    }

    setIsLoading(true);
    const element = receiptRef.current;

    const options = {
      margin: [10, 1, 1, 1],
      filename: `Receipt-${formatDate(new Date())}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { before: ".newPage", mode: ["avoid-all", "css", "legacy"] },
      // pagebreak: {  },
    };

    html2pdfModule()
      .set(options)
      .from(element)
      .save()
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error("PDF Generation Error:", error);
        setIsLoading(false);
        alert("Failed to generate PDF. Please try again.");
      });
  };

  const itemsPerPage = isMobile ? 30 : 20;
  // const itemsPerPageSecond = isMobile ? 25 : 18;

  const pages = Math.ceil(pdfDataToGenerate.length / itemsPerPage);

  return (
    <div
      className="receipt-container"
      style={{ padding: isMobile ? "0px" : "20px" }}
    >
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div
        className="pdf-button-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <KeyboardBackspaceIcon
          sx={{
            width: "50px",
            height: "40px",
            cursor: "pointer",
            mt: 3,
          }}
          onClick={() => setShowPdfGeneratorPage(false)}
        />
        <button onClick={generatePDF} className="generate-pdf-btn">
          Generate PDF
        </button>
      </div>

      <div
        ref={receiptRef}
        id="receipt-content"
        className="receipt-content"
        style={{
          padding: isMobile ? "0px 2px" : "0px 20px",
        }}
      >
        {/* Header Section - Only on first page for PDF */}
        <div className="receipt-header avoid-break">
          <div
            className="header-top"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="logo-placeholder">
              <img
                src={logo1.src}
                alt="logo"
                style={{
                  width: isMobile ? "30px" : "50px",
                  height: isMobile ? "auto" : "64px",
                }}
              />
            </div>
            {/* <img
              src={ADTextOnlyLogo.src}
              alt="logo"
              style={{
                width: isMobile ? "80px" : "150px",
                height: isMobile ? "auto" : "64px",
                objectFit: "contain",
              }}
            /> */}
            <div
              style={{
                width: isMobile ? "80px" : "60px",
                height: isMobile ? "auto" : "64px",
              }}
            >
              <ADLogoTextOnly isMobile={isMobile} />
            </div>
            {isMobile ? <h5>RECEIPTS</h5> : <h3>RECEIPTS</h3>}
          </div>

          <div className="client-info">
            <div className="client-details">
              <p className="client-name">{"Client Name"}</p>
              <p className="client-name">
                <strong>{userInfo?.user?.name || "Client Name"}</strong>
              </p>
              <p className="client-email">
                {userInfo?.user?.email || "client@example.com"}
              </p>
            </div>
            <div className="date-range">
              <p>
                Date: {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Single table for UI, will be split correctly in PDF */}
        <table className="receipt-table">
          <thead className="avoid-break">
            <tr>
              <th>Order Number</th>
              <th>Brand</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {pdfDataToGenerate.map((row, index) => {
              const currentItemsPerPage =
                index < itemsPerPage ? (isMobile ? 25 : 18) : itemsPerPage;
              const isPageBreak = (index + 1) % currentItemsPerPage === 0;

              return (
                <tr
                  key={row.id || index}
                  // className={`${index % 2 === 0 ? "even-row" : "odd-row"} ${
                  //   (index + 1) % itemsPerPage === 0 ? "page-break" : ""
                  // }`}

                  className={`${index % 2 === 0 ? "even-row" : "odd-row"} ${
                    isPageBreak ? "page-break" : ""
                  }`}
                >
                  <td>{row.order_number || "N/A"}</td>
                  {/* <td>{index + 1 || "N/A"}</td> */}

                  <td>{row.brand || "N/A"}</td>
                  <td>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>${row.amount ? row.amount?.toFixed(2) : 0}</td>
                  <td>
                    {row.payment_status === 1 && row.is_refund === 0
                      ? "Success"
                      : row.payment_status === 1 && row.is_refund === 1
                        ? "Refunded"
                        : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total Section */}
        <div className="total-section avoid-break">
          <div
            className="total-box"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ textAlign: "center" }}>Total:</span>
            <span style={{ textAlign: "center" }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .receipt-container {
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .avoid-break {
          page-break-inside: avoid;
        }

        .page-break {
          page-break-after: always;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .pdf-button-container {
          margin-bottom: 20px;
        }

        .generate-pdf-btn {
          padding: 10px 20px;
          background-color: #000;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .generate-pdf-btn:hover {
          background-color: #333;
        }

        .receipt-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .client-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          table-layout: fixed;
        }

        .receipt-table th,
        .receipt-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .receipt-table thead {
          background-color: #f2f2f2;
          display: table-header-group;
        }

        .receipt-table tbody {
          display: table-row-group;
        }

        .even-row {
          background-color: #f9f9f9;
        }

        .total-section {
          display: flex;
          justify-content: flex-center;
          alignItems: "center",
          textAlign: "center",
          margin-top: 20px;
        }

        .total-box {
          background-color: black;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          display: inline-flex;
          justify-content: space-between;
          min-width: 200px;
          width: 100%;
          max-width: ${isMobile ? "100%" : "300px"};
          box-sizing: border-box;
        }

        .total-box span:first-child {
          margin-right: 20px;
        }

        @media print {
          .page-break {
            page-break-after: always;
          }

          .receipt-table thead {
            display: table-header-group;
          }

          body * {
            visibility: hidden;
          }
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }

        @media screen and (max-width: 768px) {
          .client-info {
            flex-direction: row;
          }

          .receipt-table {
            font-size: 0.8rem;
          }

          .receipt-table th,
          .receipt-table td {
            padding: 6px;
          }

          .total-box {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 10px;
          }

          .client-details,
          .date-range {
            text-align: left;
            margin-bottom: 10px;
          }
        }

        @media screen and (max-width: 480px) {
          .receipt-table {
            font-size: 0.7rem;
          }

          .receipt-table th,
          .receipt-table td {
            padding: 4px;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-top h1 {
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptPdfGenerator;
