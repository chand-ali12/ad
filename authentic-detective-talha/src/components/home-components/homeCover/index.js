import React, { useState } from "react";
import Box from "@mui/material/Box";
import { HomeStyle } from "./style";
import Image from "next/image";
import Logo from "../../../../public/assets/images/New Logos/AD-logo.png";
import Cover from "../../../../public/assets/images/home1.png";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { commonStyles } from "@/commonStyles";
import AdImage from "@/components/zingImage";
import { useMediaQuery } from "@mui/material";
import { display, textAlign } from "@mui/system";
import Link from "next/link";
import { faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import AuthenticateNowWithoutLoginModal from "@/components/authenticate-now-modal-without-login";
import AuthenticateNowWithLoginModal from "@/components/authenticate-now-modal-with-login";
import { useRouter } from "next/router";
const HomeCover = ({}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const isExtraLarge = useMediaQuery((theme) => theme.breakpoints.up("xl"));

  const router = useRouter();

  const userInfo = useSelector(currentUserInformation);

  const [
    showAuthenticateModalWithoutLogin,
    setShowAuthenticateModalWithoutLogin,
  ] = useState(false);

  const [
    showAuthenticationModalWithLogin,
    setshowAuthenticationModalWithLogin,
  ] = useState(false);

  const handleCloseAuthenticateModalWithoutLogin = () => {
    setShowAuthenticateModalWithoutLogin(false);
  };

  const handleCloseAuthenticateModalWithLogin = () => {
    setshowAuthenticationModalWithLogin(false);
  };

  const handleAuthenticateNowButtonClick = () => {
    if (Object.keys(userInfo)?.length > 0) {
      router.push("/authentication");
      // setshowAuthenticationModalWithLogin(true);
    } else {
      setShowAuthenticateModalWithoutLogin(true);
    }
  };

  return (
    <>
      <Box sx={{ ...HomeStyle.Bg, bgcolor: "#050404" }}>
        <Grid
          container
          sx={{
            position: "relative",
            display: { xs: "flex", md: "" },
            position: "relative",
          }}
        >
          <Grid item xs={12} sm={8} lg={8}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",

                width: {
                  xs: "99.5vw",
                  sm: "84.5vw",
                  md: "85.5vw",
                  lg: "87vw",
                  xl: "90vw",
                },
                height: "auto",
                filter: "invert(1)",
              }}
            >
              <AdImage
                src={Logo}
                alt="Logo"
                width={isMobile ? 130 : isMedium ? 150 : 200} // Default width
                height={isMobile ? 90 : isMedium ? 90 : 100} // Default height
                fill={false}
              />
            </Box>

            <Box
              sx={{
                mt: { xs: "-10px", lg: "-32px" },
                pl: { xs: "5%", md: "6%" },
              }}
            >
              <Typography
                color="initial"
                sx={{
                  ...HomeStyle.heading1,
                  ...commonStyles.commonHeadingStyles,
                }}
              >
                Professional Luxury Goods Authentication: Bags, Shoes,
                Accessories.
              </Typography>
              <Box
                sx={{
                  width: { xs: "100%", sm: "75%" },
                }}
              >
                <Typography
                  color="initial"
                  pt={3}
                  pb={3}
                  sx={{
                    ...HomeStyle.heading2,
                    ...commonStyles.commonTextStyles,
                  }}
                >
                  {
                    "Authenticate Luxury Items with Confidence. Trust Authentic Detective to verify your designer bags, shoes, and accessories. Every authentication includes a Certificate of Authenticity, so you can shop, sell, or gift with total peace of mind."
                  }
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "start", lg: "center" },
                ml: { xs: -3.5, sm: 0 },
                width: {
                  xs: "96vw",
                  sm: "84.5vw",
                  md: "85.5vw",
                  lg: "87vw",
                  xl: "90vw",
                },
              }}
            >
              {/* <Link
                href={"/authentication"}
                style={{ textDecoration: "none", zIndex: "10" }}
              > */}
              <Button
                sx={{
                  ...HomeStyle.mainbtn1,
                  ...commonStyles.borderRadius,
                  ...commonStyles?.applyFontFamily,
                  ...commonStyles?.buttonCommonStyles,
                  zIndex: "10",
                }}
                // fullWidth
                onClick={handleAuthenticateNowButtonClick}
              >
                Authenticate Now
              </Button>
              {/* </Link> */}
            </Box>
          </Grid>
          {!isMobile && (
            <Grid
              item
              xs={4}
              sm={4}
              lg={4}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  opacity: "10%",
                  textAlign: "center",
                  display: "flex",
                  alignItems: { xs: "end", sm: "" },
                  justifyContent: "center",
                }}
              >
                <AdImage
                  src={Cover}
                  alt="Logo"
                  style={{
                    width: isMobile
                      ? "100%"
                      : isMediumScreen
                      ? "100%"
                      : isExtraLarge
                      ? "50%"
                      : "70%",
                    height: isMobile
                      ? "auto"
                      : isMediumScreen
                      ? "100%"
                      : "100%",
                  }}
                  fill={false}
                  layout="default"
                />
              </Box>
            </Grid>
          )}
          {isMobile && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                opacity: "10%",
                display: { xs: "block", sm: "none" },
                position: "absolute",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "end",
              }}
            >
              <AdImage
                src={Cover}
                alt="Logo"
                style={{
                  width: isMobile
                    ? "42%"
                    : isMediumScreen
                    ? "100%"
                    : isExtraLarge
                    ? "50%"
                    : "70%",
                  height: isMobile ? "auto" : isMediumScreen ? "100%" : "100%",
                  objectFit: "contain",
                  marginBottom: "15px",
                }}
                fill={false}
                layout="default"
              />
            </Box>
          )}
        </Grid>
      </Box>
      {showAuthenticateModalWithoutLogin && (
        <AuthenticateNowWithoutLoginModal
          open={showAuthenticateModalWithoutLogin}
          handleClose={handleCloseAuthenticateModalWithoutLogin}
        />
      )}

      {showAuthenticationModalWithLogin && (
        <AuthenticateNowWithLoginModal
          open={showAuthenticationModalWithLogin}
          handleClose={handleCloseAuthenticateModalWithLogin}
        />
      )}
    </>
  );
};

export default HomeCover;
