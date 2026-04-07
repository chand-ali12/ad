import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { VaultStyle } from "./style";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import Typography from "@mui/material/Typography";
// import Pic from "../../../../public/assets/images/vault.JPG";
import Pic from "../../../../public/vault.JPG";
import Pic2 from "../../../../public/assets/images/vault2.JPG";
import { useRouter } from "next/router";

// import Link from "@mui/material/Link";

const data = [
  {
    image: Pic,
    Heading: "Subscriptions",
    topHeading: "Flexible Authentication Plans for Every Buyer",
    description: `Whether you're a reseller, thrifter, or just want peace
                  of mind for every luxury purchase, our subscription
                  plans help you save up to 15% on authenticating designer
                  bags, shoes, and accessories. `,
    bottomText: "Explore our tiers and choose the one that fits your needs.",
    buttonText: "View Plans & Save",
    // buttonText: "Coming Soon",
    link: "/subscriptions",
  },
  {
    image: Pic2,
    Heading: "Valuations",
    topHeading: "Know What Your Item Is Worth",
    description: `Get an accurate, up-to-date valuation for your authenticated luxury item. We analyze current market trends and recent sales data to estimate what your bag, shoes, or accessory could sell for today. `,
    bottomText: "Perfect for resellers, collectors, or curious owners.",
    buttonText: "See What It's Worth",
    link: "/valuation-coa",
  },
];

const TheVault = () => {
  const router = useRouter();

  const manageNavigation = (link) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <>
      <Box pt={2} sx={{ bgcolor: "#F6F3EE" }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          {data?.map((item, index) => {
            return (
              <Grid item xs={6} md={6} key={item?.Heading}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image Section */}
                  <Box
                    sx={{
                      height: {
                        xs: "200px",
                        sm: "250px",
                        md: "300px",
                        lg: "350px",
                      },
                      flex: "0 0 auto",
                    }}
                  >
                    <AdImage
                      src={item?.image}
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      fill={false}
                      layout={"default"}
                    />
                  </Box>

                  {/* Title Section */}
                  <Box
                    sx={{
                      textAlign: "center",
                      padding: "20px",
                      flex: "0 0 auto",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        ...VaultStyle.Heading1,
                        ...commonStyles.commonHeadingStyles,
                      }}
                    >
                      {item?.Heading}
                    </Typography>
                  </Box>

                  {/* Content Section - This will expand to fill available space */}
                  <Box
                    m={1}
                    sx={{
                      mt: "0px", // Remove negative margins
                      textAlign: { xs: "justify", lg: "center" },
                      flex: "1 1 auto",
                      display: "flex",
                      // border: "1px solid red",
                      flexDirection: "column",
                      justifyContent: "space-between", // This will distribute content evenly
                      minHeight: {
                        xs: "160px", // For screens <= 430px (matches your CSS)
                        sm: "300px", // For screens <= 375px (matches your CSS)
                        md: "240px",
                        lg: "220px",
                      },
                      // Override for iPhone XR specifically (414px width)
                      "@media (max-width: 414px) and (min-width: 376px)": {
                        minHeight: "280px",
                      },
                      // Match your global CSS media queries
                      "@media (max-width: 430px)": {
                        minHeight: "160px",
                      },
                      "@media (max-width: 375px)": {
                        minHeight: "280px",
                      },
                      "@media (max-width: 320px)": {
                        minHeight: "330px",
                      },
                    }}
                    className="manageHeightForTheValutText"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      {/* Top heading section - fixed height */}
                      <Box
                        sx={{
                          flex: "0 0 auto",
                          minHeight: {
                            xs: "35px",
                            sm: "45px",
                            md: "40px",
                            lg: "35px",
                          },
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          sx={{
                            ...VaultStyle.Para1,
                            ...commonStyles.commonTextStyles,
                            fontWeight: "700",
                            lineHeight: 1.3,
                          }}
                        >
                          {item?.topHeading}
                        </Typography>
                      </Box>
                      <br></br>

                      {/* Main description section - fixed height */}
                      <Box
                        sx={{
                          flex: "0 0 auto",
                          minHeight: {
                            xs: "150px", // Increased for iPhone X (375px)
                            sm: "160px",
                            md: "120px",
                            lg: "100px",
                          },
                          display: "flex",
                          alignItems: "flex-start",
                          mt: { xs: "8px", md: "0px" },
                        }}
                      >
                        <Typography
                          sx={{
                            ...VaultStyle.Para1,
                            ...commonStyles.commonTextStyles,
                            lineHeight: 1.4,
                          }}
                        >
                          {item?.description}
                        </Typography>
                      </Box>
                      <br></br>

                      {/* Bottom section - fixed height */}
                      <Box
                        sx={{
                          flex: "0 0 auto",
                          minHeight: {
                            xs: "40px", // Increased for iPhone X (375px)
                            sm: "55px",
                            md: "50px",
                            lg: "55px",
                          },
                          display: "flex",
                          alignItems: "flex-start",
                          // mt: { xs: "8px", md: "0px" },
                        }}
                      >
                        <Typography
                          sx={{
                            ...VaultStyle.Para1,
                            ...commonStyles.commonTextStyles,
                            fontWeight: "700",
                            lineHeight: 1.3,
                          }}
                        >
                          {item?.bottomText}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Button Section - Fixed at bottom */}
                  <Box
                    sx={{
                      p: { xs: 1, sm: 2, md: 3 },
                      mb: { xs: 3, lg: 2 },
                      mt: { xs: 1, lg: 0 },
                      display: "flex",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <Button
                      onClick={() => manageNavigation(item?.link)}
                      sx={{
                        ...VaultStyle.mainbtn1,
                        ...commonStyles.borderRadius,
                        ...commonStyles.buttonCommonStyles,
                      }}
                    >
                      {item?.buttonText}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default TheVault;
