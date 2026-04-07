import AdImage from "@/components/zingImage";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
// import AuthPicture from "../../../../public/Certificate.png";
import AuthPicture from "../../../../public/mobile1.jpg";
import { commonStyles } from "@/commonStyles";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  COMMON_VALUE_FOR_CERTIFICATE,
  COMMON_VALUE_FOR_VALUATION,
} from "../../../../utils/commonData";

const Authenticate = ({
  bulkPage,
  setBulkPage = false,
  quantity,
  setQuantity = "",
  scrollToSection,
  sectionRef,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const isExtraLarge = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const [openBulk, setOpenBulk] = useState(false);
  // const [quantity, setQuantity] = useState('');
  // const [bulkPage, setBulkPage] = useState(false);
  const [singleAuth, setSingleAuth] = useState(false);

  const handleSingleAuth = () => {
    setSingleAuth(true);
    scrollToSection();
  };

  const handleBulkPage = () => {
    setBulkPage(!bulkPage);
    console.log("value00: ", quantity);
    handleClick();
    scrollToSection();
  };

  useEffect(() => {
    if (router.isReady) {
      const { type, value } = router.query;

      if (type === "single") {
        handleSingleAuth();
      } else if (type === "bulk" && value) {
        setBulkPage(!bulkPage);
        setQuantity(value);

        scrollToSection();
      }
    }
  }, [router.isReady]);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    console.log("value00: ", quantity);
  };

  const handleClick = () => {
    setOpenBulk((prevOpenBulk) => !prevOpenBulk);
  };

  const items = ["Bags and Accessories: $12", "Jewelry: $20"];

  const louisVuittonItems = [
    "Regular Bags and Accessories: $12",
    "Jewelry and Watches: $20",
    "Microchipped Bags and Accessories: $20",
    "Takashi Murakami Edition: $20",
    "Trunks: $35",
    "Exotic Leather Bags and Accessories: $35",
  ];

  const items2 = [
    "Small Leather Goods and Accessories: $35",
    "Shoes: $35",

    " Regular Bags: $60",
    "Exotic Leather Bags: $90",
    "Jewelry: $35",
  ];
  const items3 = [
    "Small Leather Goods and Accessories: $20",
    "Shoes: $20",

    " Regular Bags: $35",
    "Exotic Leather Bags: $50",
    "Jewelry: $20",
  ];

  const items4 = ["All Other Jewelry: $20"];

  const styles = {};
  return (
    <Box
      pb={3}
      sx={{
        bgcolor: "#F6F3EE",
        width: "100%",
        height: "auto",
      }}
    >
      <Box
        pt={4}
        sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}
      >
        <Typography
          color="black"
          sx={{
            ...commonStyles.commonHeadingStyles,
          }}
        >
          Authentication
        </Typography>
      </Box>
      <Box
        pt={2}
        pb={2}
        mx="auto"
        my={2}
        sx={{
          width: { xs: "90%", sm: "80%" },
        }}
      >
        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
            fontWeight: "700",
          }}
        >
          A Trusted Name in Luxury Authentication
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
          }}
        >
          {`Authentic Detective is trusted by buyers, resellers, and collectors alike. Our competitive rates, 24-hour turnaround, and certificate-backed results make us the smart choice for anyone buying or selling luxury items.
`}
        </Typography>
        <br></br>
        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
            fontWeight: "700",
          }}
        >
          Certificate of Authenticity Always Included
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
          }}
        >
          {` Every authentication comes with a free Certificate of Authenticity, complete with a unique QR code that links directly to a secure digital copy. This added layer helps prevent fraud and builds trust with buyers.`}
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
            fontWeight: "700",
          }}
        >
          Fast, Professional Turnaround
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
          }}
        >
          {` You’ll typically receive your results within 24 hours. If image quality is low or item details are unclear, we’ll reach out to request more photos so we can guarantee accuracy.`}
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
            fontWeight: "700",
          }}
        >
          Over 100 Luxury Brands
        </Typography>
        <br></br>

        <Typography
          color="#453e3e"
          sx={{
            ...commonStyles.commonTextStyles,
          }}
        >
          {`We authenticate items from more than 100 designer brands, giving your customers peace of mind and helping your business stay credible in the resale market.`}
        </Typography>
      </Box>
      <Box>
        <Box
          sx={{
            marginTop: { xs: "0", md: "12px", lg: "3" },
            minHeight: "100vh",
          }}
        >
          <Grid
            container
            spacing={{ xs: 0, sm: 0, md: 0 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                bgcolor: "black",
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", sm: "80%" },
              }}
            >
              <Box>
                <Grid item xs={12} sx={{ mb: "-1px" }}>
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonHeadingStyles,
                        color: "White",
                        mb: 1,
                      }}
                    >
                      Prices
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonHeadingStyles,
                        color: "White",
                        mb: 0.5,
                      }}
                    >
                      ${COMMON_VALUE_FOR_CERTIFICATE} Including a Certificate{" "}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      color="initial"
                      sx={{
                        color: "White",
                        ...commonStyles.commonTextStyles,
                      }}
                    >
                      *exclusions apply below
                    </Typography>
                  </Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Grid
                  item
                  pb={4}
                  pl={2}
                  xs={12}
                  sm={7}
                  md={7}
                  lg={7}
                  xl={7}
                  sx={{ mb: "-1px" }}
                >
                  <Box ml={{ xs: 1, sm: 2, md: 3 }}>
                    <Box
                      mt={1}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        mt: 2,
                      }}
                    >
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonHeadingStyles,
                          fontSize: {
                            xs: "14px",
                            sm: "18px",
                            md: "22px",
                            lg: "25px",
                            xl: "28px",
                          },
                          color: "White",
                        }}
                      >
                        {"Louis Vuitton"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        pl: { xs: 2, sm: 2 },
                        lineHeight: { xs: "0px", md: "10px" },
                      }}
                    >
                      {louisVuittonItems.map((item, index) => (
                        <List
                          sx={{ listStyleType: "disc", pl: { xs: 2, sm: 2 } }}
                          key={index}
                        >
                          <ListItem
                            sx={{
                              pl: 0,

                              display: "list-item",
                              color: "white",
                              ...commonStyles.commonTextStyles,
                            }}
                          >
                            {item}
                          </ListItem>
                        </List>
                      ))}
                    </Box>
                    <Box
                      mt={1}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        mt: 2,
                      }}
                    >
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonHeadingStyles,
                          fontSize: {
                            xs: "14px",
                            sm: "18px",
                            md: "22px",
                            lg: "25px",
                            xl: "28px",
                          },
                          color: "White",
                        }}
                      >
                        {"Tiffany & Co."}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        pl: { xs: 2, sm: 2 },
                        lineHeight: { xs: "0px", md: "10px" },
                      }}
                    >
                      {items.map((item, index) => (
                        <List
                          sx={{ listStyleType: "disc", pl: { xs: 2, sm: 2 } }}
                          key={index}
                        >
                          <ListItem
                            sx={{
                              pl: 0,

                              display: "list-item",
                              color: "white",
                              ...commonStyles.commonTextStyles,
                            }}
                          >
                            {item}
                          </ListItem>
                        </List>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        mt: 2,
                      }}
                    >
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonHeadingStyles,
                          fontSize: {
                            xs: "14px",
                            sm: "18px",
                            md: "22px",
                            lg: "25px",
                            xl: "28px",
                          },
                          color: "White",
                        }}
                      >
                        {"Hermès"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        pl: { xs: 2, sm: 2 },
                        lineHeight: { xs: "0px", md: "10px" },
                      }}
                    >
                      {items2.map((item, index) => (
                        <List
                          sx={{ listStyleType: "disc", pl: { xs: 2, sm: 2 } }}
                          key={index}
                        >
                          <ListItem
                            sx={{
                              pl: 0,
                              display: "list-item",
                              color: "white",
                              ...commonStyles.commonTextStyles,
                            }}
                          >
                            {item}
                          </ListItem>
                        </List>
                      ))}
                    </Box>

                    <Box
                      mt={1}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        mt: 2,
                      }}
                    >
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonHeadingStyles,
                          fontSize: {
                            xs: "14px",
                            sm: "18px",
                            md: "22px",
                            lg: "25px",
                            xl: "28px",
                          },
                          color: "White",
                        }}
                      >
                        {"Chanel"}
                      </Typography>
                    </Box>

                    <Box pl={2} sx={{}}>
                      {items3.map((item, index) => (
                        <List
                          sx={{ listStyleType: "disc", pl: { xs: 2, sm: 3 } }}
                          key={index}
                        >
                          <ListItem
                            sx={{
                              pl: 0,
                              display: "list-item",
                              color: "white",
                              ...commonStyles.commonTextStyles,
                            }}
                          >
                            {item}
                          </ListItem>
                        </List>
                      ))}
                    </Box>

                    <Box
                      mt={1}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="h2"
                        color="initial"
                        sx={{
                          ...commonStyles.commonHeadingStyles,
                          fontSize: {
                            xs: "14px",
                            sm: "18px",
                            md: "22px",
                            lg: "25px",
                            xl: "28px",
                          },
                          color: "White",
                        }}
                      >
                        {"Jewelry"}
                      </Typography>
                    </Box>

                    <Box pl={2} sx={{}} ref={sectionRef}>
                      {items4.map((item, index) => (
                        <List
                          sx={{ listStyleType: "disc", pl: { xs: 2, sm: 3 } }}
                          key={index}
                        >
                          <ListItem
                            sx={{
                              pl: 0,
                              display: "list-item",
                              color: "white",
                              ...commonStyles.commonTextStyles,
                            }}
                          >
                            {item}
                          </ListItem>
                        </List>
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  lg={5}
                  xl={5}
                  sx={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      mb: { md: 1 },
                      p: 1,
                    }}
                  >
                    <AdImage
                      src={AuthPicture}
                      alt="book a call"
                      style={{
                        width: isMobile ? "80%" : isMedium ? "90%" : "85%",
                        height: isMobile ? "auto" : isMedium ? "auto" : "auto",
                        // maxWidth: isMobile
                        //   ? "100%"
                        //   : isMediumScreen
                        //   ? "70%"
                        //   : isExtraLarge
                        //   ? "100%"
                        //   : "70%",
                        // maxHeight: isMobile ? "100%" : "100%",

                        marginBottom: isMobile ? 40 : 1,
                      }}
                      fill={false}
                      layout="default"
                    />
                  </Box>
                </Grid>
              </Box>
            </Box>
            {!bulkPage && !singleAuth ? (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                sx={{
                  position: "sticky",
                  bottom: "0px",
                  bgcolor: "#ffffff8c",
                  pt: 2,
                  pl: 1,
                  pr: 1,
                  // border: "1px red solid "
                  // display:"flex"
                }}
              >
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSingleAuth}
                      sx={{
                        ...commonStyles.buttonCommonStyles,
                        bgcolor: "#3e4041",
                        textWrap: "nowrap",
                        "&:hover": {
                          backgroundColor: "black",
                        },
                      }}
                    >
                      Single Authentication
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      sx={{
                        ...commonStyles.buttonCommonStyles,
                        bgcolor: "#3e4041",
                        textWrap: "nowrap",
                        "&:hover": {
                          backgroundColor: "black",
                        },
                      }}
                    >
                      Bulk Authentication
                    </Button>
                  </Grid>
                </Grid>
                <br />

                <Box>{""}</Box>
              </Grid>
            ) : null}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ width: { xs: "90%", sm: "80%" } }}>
                <Typography
                  sx={{
                    ...commonStyles.commonTextStyles,
                    // p: 2,
                    py: 2,
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  Please fill in all the fields below and we recommend including
                  10 photos of the item to avoid delays. An Authentic Detective
                  will email you separately if we require additional photos.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box>
        {/* <style>
          {`:root {
  --font-montserrat: "Montserrat", "Inter";
}`}
        </style> */}
        <Dialog open={openBulk} onClose={handleClick}>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...commonStyles.commonSubHeadingStyles,
              fontWeight: "600",
              fontFamily: "sans-serif",
            }}
          >
            Bulk Query
          </Typography>
          <Divider variant="middle" sx={{ borderBottomColor: "#000000c4" }} />
          <DialogContent sx={{ p: 1 }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ...commonStyles.commonTextStyles,
                // fontWeight: "600",
              }}
            >
              Select Quantity
            </Typography>
            <RadioGroup
              value={quantity}
              onChange={handleQuantityChange}
              row
              sx={{
                display: "flex",
                justifyContent: "center", // Centers the radio options horizontally
                alignItems: "center", // Centers the radio options vertically
                gap: "2px", // Optional: Adds space between radio buttons
              }}
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <FormControlLabel
                  key={num}
                  value={num.toString()}
                  control={<Radio />}
                  label={num.toString()}
                />
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClick}
              sx={{
                ...commonStyles.buttonCommonStyles,
                backgroundColor: "white",
                color: "black",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkPage}
              disabled={!quantity}
              sx={{
                ...commonStyles.buttonCommonStyles,
                backgroundColor: "white",
                color: "black",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Authenticate;
