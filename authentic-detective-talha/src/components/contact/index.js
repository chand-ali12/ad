import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const Container = styled(Box)({
  backgroundColor: "#F6F3EE", // Gray background
  height: "70vh", // Full viewport height
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Montserrat, sans-serif",
});

const StyledTypography = styled(Typography)({
  color: "black", // Font color
  textAlign: "center",
  "& a": {
    color: "blue",
    textDecoration: "underline",
  },
});

const ContactComponent = () => (
  <Container sx={{minHeight:"85vh"}}>
    <StyledTypography variant="h6">
      Questions? Contact us at{" "}
      <a
        href="mailto:support@authenticdetective.com"
        style={{ color: "rgb(25, 118, 210)" }}
      >
        support@authenticdetective.com
      </a>
    </StyledTypography>
  </Container>
);

export default ContactComponent;
