import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError } from "../../../utils/toast";
import { GET_COA_PDF } from "../../../utils/api/constants";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";

const ADCOA = () => {
  const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const [certificateId, setCertificateId] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loader, setLoader] = useState(true);
  const iframeRef = useRef(null); // Reference to the iframe
  const [retries, setRetries] = useState(0); // Track retry attempts

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const id = router.query.id;
      if (id) {
        setCertificateId(id);
      }
    }
  }, [router.isReady, router.query]);

  const getCOAPDF = async () => {
    if (!certificateId) return;

    try {
      const response = await axiosInstance.get(
        `${GET_COA_PDF}/${certificateId}`
      );

      setPdfUrl(response?.data?.data);
      console.log("PDF URL set: ", pdfUrl);
    } catch (error) {
      notifyError("Failed to fetch the PDF. " + error.toString());
      console.error("Error fetching PDF: ", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      setLoader(true);
      setPdfUrl(null); // Reset pdfUrl to trigger re-fetch
      getCOAPDF();
    }
  }, [certificateId]);

  // Check if PDF has loaded in the iframe after a delay
  const checkIframeLoad = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;
      if (
        iframeDocument.body.innerHTML.includes("404") ||
        iframeDocument.body.innerHTML === ""
      ) {
        // PDF did not load (could be a 404 or empty iframe)
        console.log("PDF not loaded. Reloading...");
        if (retries < 3) {
          // Limit retries to prevent infinite loop
          setRetries(retries + 1);
          window.location.reload(); // Reload the page
        } else {
          notifyError("Unable to load PDF after multiple attempts.");
        }
      }
    }
  };

  useEffect(() => {
    if (pdfUrl) {
      // Attempt to check after a delay (e.g., 3 seconds)
      const timer = setTimeout(checkIframeLoad, 3000);

      return () => clearTimeout(timer); // Clean up the timeout on unmount
    }
  }, [pdfUrl, retries]);

  const handleCloseForLoader = () => {
    // setLoader(false);
  };

  return (
    <Box>
      {pdfUrl ? (
        <>
          <iframe
            ref={iframeRef} // Set the ref to access the iframe
            src={`https://docs.google.com/gview?embedded=true&url=${mediaBaseUrl}/pdfCertificates/${pdfUrl}`}
            style={{ width: "100%", height: "100vh", border: "none" }}
            title="Certificate of Authenticity PDF"
            onLoad={() => setLoader(false)} // Hide loader once the iframe loads
          />
        </>
      ) : (
        <CustomLoaderWithBackdrop
          open={loader}
          handleClose={handleCloseForLoader}
        />
      )}
    </Box>
  );
};

export default ADCOA;
