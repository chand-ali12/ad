import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError } from "../../../utils/toast";
import { CERTIFICATE_UUID_TO_PDF } from "../../../utils/api/constants";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";

const ADCOA = () => {
  const [certificateId, setCertificateId] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loader, setLoader] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const id = router.query.id;
      if (id) {
        // const cleanedId = id.endsWith(".pdf") ? id.replace(".pdf", "") : id;
        setCertificateId(id);
      }
    }
  }, [router.isReady, router.query]);

  const getCOAPDF = async () => {
    try {
      const response = await axiosInstance.get(
        `${CERTIFICATE_UUID_TO_PDF}/${certificateId}`
      );

      window.location.href = response.data?.data;
    } catch (error) {
      notifyError("Failed to fetch the PDF. " + error.toString());
    }
    setLoader(false);
  };

  useEffect(() => {
    if (certificateId) {
      getCOAPDF();
    }
  }, [certificateId]);

  const handleCloseForLoader = () => {
    // setLoader(false);
  };

  return (
    <Box>
      <CustomLoaderWithBackdrop
        open={loader}
        handleClose={handleCloseForLoader}
      />
    </Box>
  );
};

export default ADCOA;
