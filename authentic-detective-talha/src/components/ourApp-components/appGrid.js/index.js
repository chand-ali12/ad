import React from "react";
import Link from "next/link";
import { AppStyles } from "./style";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdImage from "@/components/zingImage";

import { commonStyles } from "@/commonStyles";

import Mobile1 from "../../../../public/assets/images/mobile4.png";
import Mobile5 from "../../../../public/assets/images/mobile5.png";
import Mobile6 from "../../../../public/assets/images/mobile6.png";
import Mobile7 from "../../../../public/assets/images/mobile7.png";
import Mobile8 from "../../../../public/assets/images/mobile8.png";
import Mobile2 from "../../../../public/assets/images/mobile2.png";
import Mobile3 from "../../../../public/assets/images/mobile3.png";
import Arrow1 from "../../../../public/assets/images/arrow3.png";
import Arrow4 from "../../../../public/assets/images/arrow4.png";
// import Background from "../../../../public/assets/images/bgApp.png";
// import Background from "../../../../public/bgApp.png"

import { Typography, useMediaQuery, Button, useTheme } from "@mui/material";

import AppleIcon from "../../../../public/assets/images/ios-icon.png";
import AndroidIcon from "../../../../public/assets/images/android-icon-app.png";

const OurAppCom = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  return (
    <>
      <Box
        pb={4}
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f6f3ee",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid container spacing={2} px={2}>
          <Grid item xs={12} sm={12} sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              className="AppHeading"
              sx={{
                textDecoration: "underline",
                ...commonStyles.commonHeadingStyles,
                fontWeight: "bold",
                mb: { xs: 3, sm: 4, md: 7 },
              }}
            >
              Our App{" "}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid item xs={4} sm={3}>
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile1}
                    alt="book a call"
                    style={{
                      BorderRadius: "45%",
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  className="join"
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  Join our app!
                </Typography>
                <Typography
                  className="iphone-font"
                  pl={2}
                  pr={2}
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "13px" },
                  }}
                >
                  {` From certificate management, to our in app marketplace-
                  Authentic Detective has something for everyone!`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={0}
                sm={1}
                pl={0}
                sx={{ pl: "0px !important" }}
              ></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                  }}
                >
                  Certificate Management
                </Typography>
                <Typography
                  className="iphone-font"
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "12px" },
                  }}
                >
                  {`    Conveniently view your pending and completed certificates! You
                  can also manage your inventory with our user friendly
                  management system`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -3,

                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile2}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -7,
                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile3}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  className="join"
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  Over 100 Brands!
                </Typography>
                <Typography
                  className="iphone-font"
                  pl={2}
                  pr={2}
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "13px" },
                  }}
                >
                  {`   Choose from over 100 brands. We have specialty teams covering
                  each brand!`}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                  }}
                >
                  Certificate Viewing{" "}
                </Typography>
                <Typography
                  className="iphone-font"
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "12px" },
                  }}
                >
                  {` Easily save, print, and share your certificates straight from
                  the app!`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -8,
                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile5}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>

              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -5,
                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile6}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  className="join"
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  Business Profiles
                </Typography>
                <Typography
                  className="iphone-font"
                  pl={2}
                  pr={2}
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "13px" },
                  }}
                >
                  {`    Create your own business profile, for free! Connect with app
                  users from your business, generate new clients, and collect
                  reviews from your previous buyers!`}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                  }}
                >
                  Dynamic Forums
                </Typography>
                <Typography
                  className="iphone-font"
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "12px" },
                  }}
                >
                  {` Want to chat? Connect with like minded fashion fanatics using
                  our dynamic fashion forums! Choose from our many groups to
                  find what you love!`}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -6,
                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile7}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
              <Grid
                item
                xs={4}
                sm={3}
                sx={{
                  mt: {
                    xs: -5,
                    sm: -6,
                    md: -16,
                  },
                }}
              >
                <Box
                  pb={1}
                  sx={{
                    height: { xs: "100%", sm: "344px", lg: "auto" },
                    width: { xs: "100%", sm: "170px", lg: "310px" },
                  }}
                >
                  <AdImage
                    src={Mobile8}
                    alt="book a call"
                    style={{
                      width: "100%",
                      height: isMobile ? "100%" : "100%",
                      objectFit: "contain",
                    }}
                    fill={false}
                  />
                </Box>
              </Grid>
              <Grid item xs={8} sm={7}>
                <Typography
                  className="join"
                  mt={1}
                  sx={{
                    ...commonStyles.commonSubHeadingStyles,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  Marketplace
                </Typography>
                <Typography
                  className="iphone-font"
                  pl={2}
                  pr={2}
                  sx={{
                    ...commonStyles.commonTextStyles,
                    textAlign: { xs: "center", md: "center" },
                    padding: { xs: "3px", lg: "13px" },
                  }}
                >
                  {`   Find what you love! Join our global marketplace to buy and
                  sell with no commission!`}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={1} sx={{ pl: "0px !important" }}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid
              container
              spacing={1}
              mt={4}
              sx={{
                textAlign: "center",
              }}
            >
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  href="https://apps.apple.com/us/app/authentic-detective/id1659681647"
                  underline="none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Box
                    component="img"
                    src={AppleIcon.src}
                    alt="iOS App"
                    sx={{
                      height: { xs: "60px", sm: "80px" },
                      maxWidth: "100%",
                    }}
                  />
                </Link>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "end", sm: "center" },
                  alignItems: "center",
                }}
              >
                <Link
                  href="https://play.google.com/store/apps/details?id=com.techificent.authenticdetetctive&pli=1"
                  underline="none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Box
                    component="img"
                    src={AndroidIcon.src}
                    alt="Android App"
                    sx={{
                      height: { xs: "60px", sm: "80px" },
                      maxWidth: "100%",
                      ml: { xs: 0, sm: "3px" },
                    }}
                  />
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default OurAppCom;
