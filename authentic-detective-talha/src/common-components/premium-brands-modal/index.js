import { commonStyles } from "@/commonStyles";
import { Box, Modal, Typography } from "@mui/material";
import React from "react";

const PremiumBrandsModal = ({ open, handleClosePremiumBrandsInfoModal }) => {
  return (
    <Modal
      open={open}
      onClose={handleClosePremiumBrandsInfoModal}
      aria-labelledby="model-modal-title"
      aria-describedby="model-modal-description"
      sx={{ ...commonStyles?.applyFontFamily }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "60%", sm: "50%", md: "50%", lg: "80%" },
          maxWidth: "300px",
          borderRadius: "10px",
          bgcolor: "#333333",
          py: 2,
          px: 2,
        }}
      >
        <Typography
          id="model-modal-title"
          sx={{
            color: "white",
            ...commonStyles.modalHeading,
            fontWeight: "bold",
          }}
        >
          Premium Brands
        </Typography>

        <Typography
          id="model-modal-description"
          sx={{
            mt: 2,
            color: "white",
            // textAlign: "center",
            textAlign: { xs: "center", sm: "center" },
            ...commonStyles.modalText,
            lineHeight: {
              xs: "18px",
              sm: "22px",
              md: "24px",
              lg: "26px",
              xl: "28px",
            },
          }}
        >
          Premium brands include Chanel, Hermes and Tiffany & Co.
        </Typography>

        <hr
          style={{
            border: "none",
            height: "0.5px",
            backgroundColor: "#d3d3d3",
            margin: "10px 0",
            width: "110%",
            maxWidth: "110%",
          }}
        />

        <Typography
          onClick={() => {
            handleClosePremiumBrandsInfoModal();
          }}
          sx={{
            width: "100%",
            color: "#1976d2",
            cursor: "pointer",
            textAlign: "center",
            ...commonStyles.modalHeading,
            fontWeight: "bold",
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          Ok
        </Typography>
      </Box>
    </Modal>
  );
};

export default PremiumBrandsModal;
