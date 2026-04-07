import { Box, Container, Typography } from "@mui/material";
import React from "react";

const HomeAuthentication = () => {
  return (
    <Box mt={0.5} sx={{ bgcolor: "#F6F3EE" }}>
      <Box
        pt={4}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "var(--font-montserrat)",
            color: "black",
            fontWeight: "700",
            fontSize: { xs: "15px", sm: "30px", md: "36px", lg: "39px" },
            textAlign: "center",
          }}
        >
          Authentication
        </Typography>

        <Container display="" mx="" my="" sx="">
          <Typography
            variant="body2"
            mt={3}
            pb={2}
            sx={{
              fontSize: { xs: "11px", lg: "20px" },
              fontFamily: "var(--font-montserrat)",
              color: "#232121",
              fontWeight: "400",
            }}
          >
            We pride ourselves in being the most trusted authentication source
            available. Our competitive rates paired with our confidence, makes
            us the best option to put your heart at ease while shopping. <br />{" "}
            <br /> All of our authenticity checks come with a certificate of
            authenticity, free of charge! Each certificate comes with a QR code
            which when scanned, brings you to a digital variant of the
            certificate to prevent fraud. <br /> <br /> We will typically
            respond to your request within 24 hours. This time will vary
            depending on the product and how clear the images are. We will
            request more images if required. For more immediate solutions,
            please
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeAuthentication;
