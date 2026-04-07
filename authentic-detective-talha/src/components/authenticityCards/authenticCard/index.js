import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import axiosInstance from "../../../../utils/api/axios-client";
import Card1 from "../../../../public/assets/images/card1.png";
import Card2 from "../../../../public/assets/images/card2.png";
import Card3 from "../../../../public/assets/images/card3.png";
import { AUTHENTICITY_CARDS_PRICING } from "../../../../utils/api/constants";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const AuthenticityCard = () => {
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.post(
          `${AUTHENTICITY_CARDS_PRICING}`
        );

        if (response?.data?.data) {
          setPricingData(response?.data?.data);
        } else {
          notifyError(response?.data?.msg);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.code === "ERR_NETWORK") {
          notifyError("Please connect to the internet first.");
        } else {
          notifyError(error.toString());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const renderPricingTable = (type) => {
    const filteredData = pricingData.filter((item) => item.type === type);

    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ color: "white", height: "100px" }}
        >
          <CircularProgress color="inherit" />
        </Box>
      );
    }

    if (filteredData.length === 0) {
      return (
        <Typography sx={{ color: "white", ml: "10px" }}>
          No data available.
        </Typography>
      );
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={4} sm={2} md={2}>
          <Box ml={4}>
            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                fontWeight: "550",
                color: "white",
                mb: "6px",
                marginLeft: {
                  xs: "-16%",
                  md: "-8%",
                },
              }}
            >
              Quantity
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={3} md={3}>
          <Box>
            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                fontWeight: "550",
                color: "white",
                mb: "6px",
                marginLeft: {
                  xs: "-8%",
                  md: "-3%",
                },
              }}
            >
              Price (USD)
            </Typography>
          </Box>
        </Grid>

        {filteredData.map((item, index) => (
          <Grid container key={index} spacing={1}>
            <Grid item xs={4} sm={2} md={2}>
              <Box ml={4}>
                <Typography
                  sx={{ ...commonStyles.commonTextStyles, color: "white" }}
                >
                  {item.qty}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={3} md={3}>
              <Box>
                <Typography
                  sx={{ ...commonStyles.commonTextStyles, color: "white" }}
                >
                  ${item.amount}
                  {index === filteredData.length - 1 && " /each"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box mt={0.5} sx={{ bgcolor: "#1b1b1d" }}>
      <Box
        pt={4}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          sx={{ color: "white", ...commonStyles.commonHeadingStyles }}
        >
          Authenticity Cards
        </Typography>

        <Box
          pt={4}
          pb={1}
          sx={{
            width: { xs: "auto", lg: "390px" },
            height: { xs: "200px", lg: "300px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AdImage
            src={Card1}
            alt="book a call"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            fill={false}
          />
        </Box>

        <Box
          // pb={3}
          sx={{
            border: "1px solid white",
            width: { xs: "90%", sm: "80%", md: "80%" },
            textAlign: "center",
          }}
        >
          <Typography
            m={{ xs: 1, sm: 3 }}
            sx={{
              textAlign: "justify",
              color: "white",
              ...commonStyles.commonTextStyles,
            }}
          >
            {`  A revolutionary new product that brings certainty and convenience
        to verifying the authenticity of your luxury items. Linked to your
        Certificate of Authenticity, these sleek cards utilize NFC
        technology, allowing you to access your certificate with a simple
        tap of the card to the back of your phone (2018+). Alternatively,
        scan the QR code on the back of the card to instantly view your
        certificate. Say goodbye to rummaging through paperwork or doubt
        about your item's legitimacy. With Authenticity Cards, proof of
        authenticity is always at your fingertips, making it easier than
        ever to buy, sell, and own with confidence.`}
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          mt={1}
          mb={3}
          sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}
        >
          {[Card2, Card3].map((item, index) => (
            <Grid item xs={6} md={6} key={index}>
              <Box
                sx={{
                  textAlign: index === 0 ? "end" : "start",
                  width: "100%",
                  height: "100%",
                }}
              >
                <AdImage
                  src={item}
                  alt="authenticity card"
                  style={{
                    width: isMobile ? "95%" : "80%",
                    height: isMobile ? "200px" : "auto",
                  }}
                  fill={false}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{ ...commonStyles.commonSubHeadingStyles, color: "white" }}
            >
              Prices
            </Typography>
          </Box>

          <Box
            sx={{
              width: "90vw",
              border: "1px solid",
              borderColor: "white",
              pb: 3,
              mb: 5,
            }}
          >
            <Typography
              sx={{
                ...commonStyles.commonSubHeadingStyles,
                color: "white",
                fontWeight: "400",
                mb: 1,
                textAlign: "center",
              }}
            >
              Domestic (USA)
            </Typography>

            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              Transit time 1-5 days
            </Typography>

            {renderPricingTable(1)}
          </Box>

          {/* <Box
            sx={{
              width: "90vw",
              border: "1px solid",
              borderColor: "white",
              pb: 3,
              mt: 2,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                ...commonStyles.commonSubHeadingStyles,
                color: "white",
                fontWeight: "400",
                mb: 1,
                textAlign: "center",
              }}
            >
              International (Outside USA)
            </Typography>
            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              Transit time 5-10 days
            </Typography>
            {renderPricingTable(2)}
          </Box> */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              width: "90vw",

              pb: 3,
              mb: 1,
            }}
          >
            <Typography
              sx={{ ...commonStyles.commonTextStyles, color: "white" }}
            >
              International orders have a 10 card minimum. Please email us at{" "}
              <a
                href="mailto:support@authenticdetective.com"
                style={{ color: "white", textDecoration: "underline" }}
              >
                support@authenticdetective.com
              </a>{" "}
              for more information.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              ...commonStyles.buttonCommonStyles,
            }}
          >
            <Link href="/authenticity-cards">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "primary",
                  borderRadius: 8,
                  fontSize: { xs: "10px", md: "16px" },
                  padding: { xs: "2px 12px", md: "6px 15px" },
                }}
                startIcon={
                  <ShoppingCartOutlinedIcon
                    sx={{
                      color: "white",
                      p: { xs: 0.5, sm: 0 },
                      fontSize: { xs: "15px", md: "30px" },
                    }}
                  />
                }
              >
                BUY NOW
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticityCard;
