import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextField, Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import DebounceFunction from "../../../../utils/debounce-function";
import axiosInstance from "../../../../utils/api/axios-client.js";
import SliderR from "./swiper";
import { GET_ALL_VERIFIED_BUSINESS } from "../../../../utils/api/constants";
import { notifyError } from "../../../../utils/toast";
import { commonStyles } from "@/commonStyles";
import CustomLoader from "@/common-components/custom-loader";

const SellersCollective = () => {
  const [allVerifiedBusinessData, setAllVerifiedBusinessData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(true);

  const getAllVerifiedBusinessData = async (searchText = "") => {
    const endpoint = searchText
      ? `${GET_ALL_VERIFIED_BUSINESS}/${searchText}`
      : GET_ALL_VERIFIED_BUSINESS;

    try {
      const response = await axiosInstance.get(endpoint);
      setAllVerifiedBusinessData(response?.data?.data || []);
      setLoader(false);
    } catch (error) {
      notifyError(error.toString());
      setLoader(false);
    }
  };

  const debouncedSearch = useCallback(
    DebounceFunction((searchText) => {
      getAllVerifiedBusinessData(searchText);
    }, 900),
    []
  );

  useEffect(() => {
    if (searchText.trim() !== "") {
      debouncedSearch(searchText);
    } else {
      getAllVerifiedBusinessData();
    }
  }, [searchText]);

  return (
    <>
      <Box sx={{ bgcolor: "#F6F3EE" }}>
        <Box sx={{ justifyContent: "center", textAlign: "center" }}>
          <Typography
            pt={4}
            color="white"
            sx={{
              color: "#3D2F2B",
              ...commonStyles.commonHeadingStyles,
            }}
          >
            The Sellers Collective
          </Typography>
        </Box>
        <Box pt={2} sx={{ justifyContent: "center", textAlign: "center" }}>
          <Typography
            sx={{
              color: "#3D2F2B",
              ...commonStyles?.commonTextStyles,
              fontWeight: "700",
            }}
          >
            {" Discover Trusted Luxury Sellers — Rated by Real Buyers"}
          </Typography>
        </Box>
        <Box pt={1} sx={{ justifyContent: "center", textAlign: "center" }}>
          <Typography
            sx={{
              color: "#3D2F2B",
              ...commonStyles?.commonTextStyles,
            }}
          >
            {
              "The Sellers Collective is our growing, community-powered directory of luxury sellers. Browse reviews from real customers, leave your own ratings, and shop with confidence—knowing who’s legit before you buy. Built on transparency, trust, and buyer protection."
            }
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Heading in the first row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    ...commonStyles.commonHeadingStyles,
                  }}
                >
                  Verified Businesses
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  sx={{
                    mx: 2,
                    bgcolor: "white",
                    fontSize: { xs: "16px", md: "18px" },
                    width: { xs: "70%", sm: "80%" },

                    borderRadius: "32px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "32px",
                      "& .MuiInputBase-input": {
                        padding: { xs: "6px 13px", md: "10px  10px" },
                        fontSize: { xs: "16px", md: "16px" },
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "32px",
                    },
                  }}
                  variant="outlined"
                  placeholder="Search a company"
                  InputProps={{
                    sx: {
                      backgroundColor: "white",
                      borderRadius: "25px",
                      height: {
                        xs: "35px",
                        sm: "40px",
                        md: "45px",
                        lg: "50px",
                        xl: "55px",
                      },
                    },

                    endAdornment: (
                      <SearchIcon
                        sx={{
                          fontSize: { xs: "16px", sm: "19px", lg: "29px" },
                          cursor: "pointer",
                        }}
                      />
                    ),
                  }}
                />

                <Link href="/seller-collective">
                  <Button
                    variant="contained"
                    sx={{
                      width: { xs: "115%" },
                      backgroundColor: "white",
                      color: "black",
                      ...commonStyles.buttonCommonStyles,
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    See All
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {loader ? (
          <Box
            sx={{
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomLoader />
          </Box>
        ) : allVerifiedBusinessData.length === 0 && searchText ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                ...commonStyles?.commonTextStyles,
                fontWeight: "bold",
              }}
            >
              No matching businesses found!
            </Typography>
          </Box>
        ) : (
          <SliderR allVerifiedBusinessData={allVerifiedBusinessData} />
        )}
      </Box>
    </>
  );
};

export default SellersCollective;
