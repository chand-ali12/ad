import React, { useState, useRef, useEffect } from "react";
import { Box, Dialog, IconButton, useMediaQuery, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { getCertificatePdfUrl, getAllPendingImages } from "../../../utils/certificate-helpers";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import CertificateImageGallery from "./CertificateImageGallery";

const MAX_PDF_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

const CertificateViewer = ({ open, onClose, certificate, type, subType }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewerKey, setViewerKey] = useState(0);
  const iframeRef = useRef(null);

  const isValuation = subType === "valuations";

  const pdfUrl = type === "completed" ? getCertificatePdfUrl(certificate) : null;
  const images = type === "pending" ? getAllPendingImages(certificate) : [];

  // Get brand name - handle both structures
  const brandName = isValuation 
    ? (certificate.brands?.brand || certificate.brand || "---")
    : (certificate.brand || "N/A");

  const displayDate =
    certificate.certificate?.date || certificate.created_at || certificate.certificate?.created_at;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString()
    : (isValuation ? "---" : "N/A");

  // Get certificate number for valuations
  const certificateNumber = isValuation
    ? (certificate.coa_number || certificate.certificate?.certificate_id || certificate.order_number || "---")
    : null;

  const orderNumber =
    certificate.order_number ||
    certificate.certificate?.certificate_id ||
    certificate.authenticate_id ||
    certificate.id ||
    "N/A";

  const modelName =
    certificate.model ||
    certificate.certificate?.product_name ||
    certificate.certificate?.model ||
    (isValuation ? "---" : "N/A");

  // Get price for valuations
  const valuationPrice = isValuation
    ? (certificate.valuation_price || "---")
    : null;
   
    const valuationWithCertificatePrice = certificate.certificate?.valuation_price || null;
  
  
  // Get description for valuations
  const description = isValuation
    ? (certificate.certificate?.note || certificate.note || certificate.certificate?.description || certificate.description || "---")
    : null;

  const noteText =
    certificate.certificate?.note ??
    certificate.note ??
    certificate.certificate?.description ??
    certificate.description ??
    "";

  const statusLabel =
    type === "pending"
      ? "Pending Query"
      : certificate.certificate?.result?.toLowerCase() === "inconclusive"
      ? "Inconclusive Query"
      : certificate.certificate?.result
      ? `${certificate.certificate.result} Query`
      : "Completed Query";

  useEffect(() => {
    if (open && pdfUrl) {
      setLoading(true);
      setPdfLoaded(false);
      setRetryCount(0);
      setViewerKey((prev) => prev + 1); // trigger iframe reload
    }
  }, [open, pdfUrl]);

  useEffect(() => {
    if (!open || !pdfUrl || pdfLoaded) return;
    if (retryCount >= MAX_PDF_RETRIES) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      if (!pdfLoaded) {
        setRetryCount((prev) => prev + 1);
        setViewerKey((prev) => prev + 1); // retry loading iframe
      }
    }, RETRY_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [open, pdfUrl, pdfLoaded, retryCount]);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setPdfLoaded(true);
  };

  const viewerSrc =
    pdfUrl && type === "completed"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          pdfUrl
        )}#retry=${retryCount}`
      : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          backgroundColor: "#000",
          m: 0,
          height: isMobile ? "100%" : "90vh",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with Close and Download buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            display: "flex",
            gap: 1,
          }}
        >
          {pdfUrl && (
            <IconButton
              onClick={handleDownload}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              <DownloadIcon />
            </IconButton>
          )}
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          {type === "completed" && pdfUrl ? (
            <>
              {loading && (
                <CustomLoaderWithBackdrop
                  open={loading}
                  handleClose={() => {}}
                />
              )}
              <iframe
                ref={iframeRef}
                key={`${viewerKey}-${retryCount}`}
                src={viewerSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                title="Certificate PDF"
                onLoad={handleIframeLoad}
              />
              {!loading && !pdfLoaded && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.85)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    color: "white",
                    textAlign: "center",
                    px: 3,
                  }}
                >
                  <Box sx={{ fontSize: "18px", fontWeight: 500 }}>
                    We’re having trouble loading the PDF preview.
                  </Box>
                  <Box sx={{ fontSize: "14px", opacity: 0.8 }}>
                    You can try again or open the certificate in a new tab.
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setLoading(true);
                        setPdfLoaded(false);
                        setRetryCount(0);
                        setViewerKey((prev) => prev + 1);
                      }}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDownload}
                      sx={{
                        backgroundColor: "white",
                        color: "#000",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      Open in new tab
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          ) : type === "pending" && images.length > 0 ? (
            <CertificateImageGallery images={images} onClose={onClose} />
          ) : (
            <Box
              sx={{
                color: "white",
                textAlign: "center",
                p: 4,
              }}
            >
              No content available
            </Box>
          )}
        </Box>

        <Box
          sx={{
            px: { xs: 2, sm: 4 },
            py: { xs: 2, sm: 3 },
            backgroundColor: "#000",
            color: "white",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "var(--font-montserrat)",
            display: "flex",
            flexDirection: "column",
            maxHeight: { xs: "40vh", sm: "35vh", md: "30vh" },
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {brandName}
            </Typography>
            {!isValuation && (
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  mb: 1,
                  fontWeight: 500,
                  color: "#f5f5f5",
                }}
              >
                {statusLabel}
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                mb: 0.5,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Date: {formattedDate}
            </Typography>
            {isValuation ? (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Certificate Number: {certificateNumber}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Model: {modelName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Valuation: {valuationPrice !== "---" ? `$${valuationPrice}` : "---"}
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: 0.5,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Order: {orderNumber}
                </Typography>
             
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: noteText ? 0.5 : 0,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Model: {modelName}
                </Typography>

                {valuationWithCertificatePrice!=null && !isValuation? (
          <>
    <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    mb: noteText ? 0.5 : 0,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                 Valuation: {valuationWithCertificatePrice ? `$${valuationWithCertificatePrice}` : "---"}
           
                </Typography>
</>) 
:(<> </>)}
                
              </>
            )}
          </Box>
          
          {/* Scrollable Description Section */}
          {isValuation ? (
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mt: 0.5,
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.5)",
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                Description: {description}
              </Typography>
            </Box>
          ) : noteText ? (
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mt: 0.5,
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.5)",
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {noteText}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Dialog>
  );
};

export default CertificateViewer;

