import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { commonStyles } from "@/commonStyles";
import { useRouter } from "next/router";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PremiumBrandsModal from "@/common-components/premium-brands-modal";

export default function CertificateCountTextCartScreen({
  totalCertificates,
  subscriptionData,
  queryCount,
}) {
  const router = useRouter();

  const [premiumBrandsInfo, setPremiumBrandsInfo] = useState(false);

  const handleClosePremiumBrandsInfoModal = () => {
    setPremiumBrandsInfo(false);
  };
  const handleOpenPremiumBrandsInfoModal = () => {
    setPremiumBrandsInfo(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#423e35",
        borderRadius: "12px",
        padding: 2,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        // border: "1px solid #f0e68c",

        textAlign: "left",
        maxWidth: "950px",
      }}
    >
      {totalCertificates > 0 && totalCertificates - queryCount > 0 ? (
        <Box>
          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "white",
            }}
            gutterBottom
          >
            You have <b>{totalCertificates}</b> requests remaining in your
            subscription.
          </Typography>

          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "white",
            }}
            gutterBottom
          >
            You will have <b>{totalCertificates - queryCount}</b> requests
            remaining after this order.
          </Typography>

          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "white",
            }}
            gutterBottom
          >
            <b>Note:</b> Our subscription plans do not include premium brands
            <Box component={"span"}>
              <Tooltip
                title="More information about the model"
                sx={{ bgcolor: "red" }}
              >
                <IconButton
                  size="small"
                  onClick={handleOpenPremiumBrandsInfoModal}
                  sx={{
                    mt: "-0.5px",
                    marginLeft: 0.5,
                    width: 24,
                    height: 24,
                    padding: 0,
                    bgcolor: "#e0e0e0",
                    "&:hover": {
                      bgcolor: "#1976d2",
                      color: "white",
                    },
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: "18px" }} />{" "}
                </IconButton>
              </Tooltip>
            </Box>
            , valuations, or jewelry.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "white",
            }}
          >
            You are out of subscription requests. <br />
            You will be able to purchase additional requests at a discounted
            price of <b>{subscriptionData?.package?.price_per_request}</b>.
          </Typography>

          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "white",
            }}
            gutterBottom
          >
            <b>Note:</b> Our subscription plans do not include premium brands
            <Box component={"span"}>
              <Tooltip
                title="More information about the model"
                sx={{ bgcolor: "red" }}
              >
                <IconButton
                  size="small"
                  onClick={handleOpenPremiumBrandsInfoModal}
                  sx={{
                    mt: "-0.5px",
                    marginLeft: 0.5,
                    width: 24,
                    height: 24,
                    padding: 0,
                    bgcolor: "#e0e0e0",
                    "&:hover": {
                      bgcolor: "#1976d2",
                      color: "white",
                    },
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: "18px" }} />{" "}
                </IconButton>
              </Tooltip>
            </Box>
            , valuations, or jewelry.
          </Typography>
        </Box>
      )}

      <PremiumBrandsModal
        open={premiumBrandsInfo}
        handleClosePremiumBrandsInfoModal={handleClosePremiumBrandsInfoModal}
      />
    </Box>
  );
}
