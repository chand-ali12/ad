"use client";

import Header from "@/components/home-components/header";
import Footer from "@/components/home-components/footer";
import { Box, Typography, Button, keyframes } from "@mui/material";
import Image from "next/image";
import NotFound from "../../public/404.png";
import { commonStyles } from "@/commonStyles";
import Link from "next/link";
import Layout from "@/components/layout";

const bounceAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

export default function Custom404() {
  return (
    <Layout >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#f0f4f8",
        }}
      >
        {/* <Header /> */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                mt: 2,
                fontSize: { xs: "48px", sm: "64px", md: "80px", lg: "96px" },
                fontWeight: "bold",
                color: "#333",
                fontFamily: "var(--font-montserrat)",
                animation: `${bounceAnimation} 1.5s ease-in-out infinite`,
              }}
            >
              404
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontWeight: "bold",
              color: "#333",
              ...commonStyles.commonHeadingStyles,
            }}
          >
            Oops! Page Not Found
          </Typography>
          <Typography
            sx={{ mt: 3, color: "#666", ...commonStyles.commonTextStyles }}
          >
            {`The page you are looking for doesn’t exist or has been moved.`}
          </Typography>
          <Box sx={{ mt: 10 }}>
            <Link href="/">
              <Button
                variant="contained"
                color="primary"

                sx={{
                  ...commonStyles.buttonWithBlackColor,
                  padding: { xs: "6px 45px", lg: "9px 65px" },
                }}
              >
                Go Home
              </Button>
            </Link>
          </Box>
        </Box>
        {/* <Footer /> */}
      </Box>
    </Layout>
  );
}
