import React, { useState } from "react";
import Layout from "@/components/layout";
import AuthenticationCertificate from "../components/verify-certificate";
import NeedACertificate from "../components/verify-certificate/need-a-certificate";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { commonStyles } from "@/commonStyles";
import { notifyError } from "../../utils/toast";
import axiosInstance from "../../utils/api/axios-client";
import { VERIFY_CERTIFICATE } from "../../utils/api/constants";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import Image from "next/image";

const Certificate = () => {
  const [certNumber, setCertNumber] = useState("");
  const [error, setError] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseForLoader = () => {};
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (!certNumber.trim()) {
      notifyError("Please enter a valid certificate number");
      setIsLoading(false);
      return;
    }

    const postData = { number: certNumber };

    try {
      console.log("Submitting data to API:", postData);

      const response = await axiosInstance.post(VERIFY_CERTIFICATE, postData);

      if (response?.data?.status && response?.data?.status_code === 200) {
        const data = response?.data?.data;

        if (data?.pdf) {
          const pdfValue = data?.pdf;
          const exploded = pdfValue.split(".");
          const updatedPdfValue = exploded[0] + ".png";
          const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/pdfThumbnail/${updatedPdfValue}`;

          setCertificateImage(imageUrl);
          setError("");
        } else {
          throw new Error("PDF not found in the response");
        }
      } else {
        throw new Error(response.data?.msg || "Invalid response from server");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      notifyError("No data found!");
      setCertificateImage("");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <AuthenticationCertificate />

      <Box sx={{}}>
        <Grid
          container
          spacing={0}
          sx={{
            px: { xs: 2, sm: 4, md: 8 },
            pt: { xs: 2 },
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          <Grid item xs={12} md={12} lg={12}>
            <Typography
              sx={{
                ...commonStyles.commonHeadingStyles,
                textAlign: "center",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                mb: { xs: 4, md: 2 },
              }}
            >
              Verify Authentic Detective Certificate
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ ...commonStyles.commonTextStyles, mb: 1 }}>
              Please add the 6 digit certificate number below.
            </Typography>
            <Typography sx={{ ...commonStyles.applyFontFamily, mb: 3 }}>
              {`Example (Case Sensitive):H2En5G`}
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
              }}
            >
              <TextField
                variant="outlined"
                placeholder=" Enter Certificate Number"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                disabled={isLoading}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "28px",
                    backgroundColor: "#fff",
                    height: "46px",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  ...commonStyles.buttonWithBlackColor,
                  ...commonStyles.commonHover,
                  height: { xs: "42px" },
                }}
              >
                {isLoading ? <CircularProgress /> : "SEARCH"}
              </Button>
            </Box>
          </form>

          {certificateImage && (
            <Box sx={{ mt: 4, width: "100%", textAlign: "center" }}>
              <img
                src={certificateImage}
                alt="Certificate"
                style={{ maxWidth: "103%", height: "auto" }}
              />
            </Box>
          )}
        </Grid>
        <NeedACertificate />
      </Box>
      <CustomLoaderWithBackdrop
        open={isLoading}
        handleClose={handleCloseForLoader}
      />
    </Layout>
  );
};

export default Certificate;
