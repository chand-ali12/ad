import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Pagination,
  TextField,
  Stack,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { commonStyles } from "@/commonStyles";
import { GET_ALL_VERIFIED_BUSINESS_LIST } from "../../../utils/api/constants";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError } from "../../../utils/toast";
import DebounceFunction from "../../../utils/debounce-function";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import defaultCardIMage from "../../../public/default-image.png";
import Image from "next/image";
import Link from "next/link";
import CustomLoader from "@/common-components/custom-loader";
import VerifiedBusinessIcon from "../../../public/assets/svgs/verifiedBusinessIcon";

const BusinessImage = ({ src, alt, baseUrl }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Skeleton
          variant="circular"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}
      <Image
        src={hasError || !src ? defaultCardIMage : `${baseUrl}/${src}`}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        layout="fill"
        objectFit="cover"
        style={{ visibility: isLoading ? "hidden" : "visible" }}
      />
    </>
  );
};
const BusinessCollection = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [sellersCollectiveList, setSellersCollectiveList] = useState([]);
  const [imgSrc, setImgSrc] = useState(false);

  const baseURl = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessProfile`;

  const getSellersList = useCallback(
    async (num = page) => {
      try {
        setLoader(true);
        const formData = new FormData();
        if (searchText) {
          formData.append("keyword", searchText);
        }
        const endPoint = GET_ALL_VERIFIED_BUSINESS_LIST;
        const response = await axiosInstance.post(endPoint, formData, {
          params: { page: num },
        });
        setSellersCollectiveList(response?.data || []);
      } catch (error) {
        notifyError(error.toString());
      } finally {
        setLoader(false);
      }
    },
    [page, searchText]
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    getSellersList(page);
  }, [page, getSellersList]);

  const debouncedGetSelleres = useCallback(
    DebounceFunction((search) => {
      setPage(1);
      //  getSellersList(1);
    }, 900),
    []
  );

  useEffect(() => {
    if (searchText) {
      debouncedGetSelleres(searchText);
    } else {
      getSellersList(1, "");
    }
  }, [searchText, debouncedGetSelleres]);

  console.log("sellersCollectiveList", sellersCollectiveList);

  const handleChange = (event, value) => {
    setPage(value);
    // getSellersList(value); // Fetch data for the selected page
  };

  return (
    <>
      <Box sx={{ minHeight: "85vh" }}>
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
          <Box sx={{ justifyContent: "center", textAlign: "center" }}>
          <Typography
            pt={4}
            color="white"
            sx={{
              color: "#3D2F2B",
              ...commonStyles.commonTextStyles,
            }}
          >
            {`The Sellers Collective is our growing, community-powered directory of luxury sellers. Browse reviews from real customers, leave your own ratings, and shop with confidence—knowing who’s legit before you buy. Built on transparency, trust, and buyer protection.

`}
          </Typography>
        </Box>
        <Box sx={{ justifyContent: "center", textAlign: "center" }}>
          <Typography
            pt={4}
            color="white"
            sx={{
              color: "#3D2F2B",
              ...commonStyles.commonHeadingStyles,
            }}
          >
            All Businesses
          </Typography>
        </Box>

        <Box sx={{ padding: { xs: "5px", sm: "20px" } }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ marginBottom: "12px" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "90%", lg: "50%" },
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
                  width: { xs: "100%", sm: "80%" },
                  borderRadius: "32px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "32px",
                    "& .MuiInputBase-input": {
                      padding: { xs: "6px 13px", md: "10px 10px" },
                      fontSize: { xs: "16px", md: "16px" }, // Set at least 16px for input text
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
                        fontSize: { xs: "16px", sm: "19px", lg: "29px" }, // Adjust icon size
                        cursor: "pointer",
                      }}
                    />
                  ),
                }}
              />
            </Box>
          </Box>

          {!loader ? (
            <Box
              sx={{
                width: { xs: "98%", md: "90%" },

                display: "flex",
                justifyContent: "center",
                margin: "auto",
              }}
            >
              <Grid container spacing={{ xs: 1, lg: 4 }}>
                {sellersCollectiveList?.data?.map((item) => (
                  <Grid item xs={6} sm={6} md={4} lg={2.4} key={item.id}>
                    {console.log("item item",item)}
                    <Link
                      href={`/business-profile/${item?.slug}`}
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            height: { xs: "145px", sm: "200px", lg: "200px" },
                            width: { xs: "145px", sm: "200px", lg: "200px" },
                            margin: "0 auto",
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "relative",
                            mt: 1,
                          }}
                        >
                          <BusinessImage
                            src={item?.business_profile_picture}
                            alt={item?.about_business}
                            baseUrl={baseURl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            minHeight: {
                              xs: "120px",
                              sm: "140px",
                              md: "150px",
                            },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            mt={-1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Box sx={{
                              maxWidth: "85%", textAlign: "center"
                            }}>
                              <Typography
                                // display={"inline"}
                                sx={{
                                  display: "inline",wordBreak:"break-word",
                                  fontSize: {
                                    xs: "12px",
                                    sm: "15px",
                                    md: "16px",
                                    lg: "16px",
                                    xl: "18px",
                                  },
                                  fontWeight: "500",
                                  textAlign: "center",
                                }}
                              >
                                {item.business_name}
                              </Typography>
                            </Box>
                            {item?.is_featured === 1 && (
                              <Box
                                sx={{
                                  textAlign: "center", pl: 0.5,mt:0.3,
                                  width: {
                                    xs: "15px", sm: "15px", md: "16px",
                                    lg: "16px", xl: "18px",
                                  },
                                  height: {
                                    xs: "15px", sm: "15px", md: "16px",
                                    lg: "16px", xl: "18px",
                                  },
                                }}
                              >
                                <VerifiedBusinessIcon
                                  width={"inherit"}
                                  height={"auto"}
                                />
                              </Box>
                            )}
                          </Box>

                          <Box
                            mb={0.5}
                            mt={-0}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "11px",
                                  sm: "13px",
                                  md: "13px",
                                  lg: "13px",
                                  xl: "20px",
                                },
                                fontWeight: "300",
                                textAlign: "center",
                              }}
                              color="gray"
                            >
                              {item?.business_country}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Typography
                              color="black"
                              sx={{
                                fontSize: { xs: "11px", sm: "15px" },
                                fontWeight: "400",
                                textAlign: "center",
                              }}
                            >
                              {item?.business_rating}
                            </Typography>

                            <Rating
                              readOnly
                              value={item?.business_rating}
                              name="feedback"
                              precision={0.5}
                              sx={{
                                ...commonStyles.muiStartsRatingStyles,
                              }}
                              icon={<StarIcon />}
                              emptyIcon={<StarBorderIcon />}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "10px",
                                  sm: "12px",
                                  md: "13px",
                                  lg: "13px",
                                  xl: "17px",
                                },
                                fontWeight: "300",
                                color: "black",
                                textAlign: "center",
                              }}
                            >
                              <b> Reviews ({item.reviews_count})</b>
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>

              {/* <Grid container spacing={{ xs: 1, lg: 4 }}>
              {sellersCollectiveList?.data?.map((item) => (
                <Grid item xs={6} sm={6} md={4} lg={2.4} key={item.id}>
                  <Link
                    href={`/business-profile/${item?.id}`}
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: "150px", sm: "300px", lg: "200px" },
                          position: "relative",
                        }}
                      >
                        <BusinessImage
                          src={item?.business_profile_picture}
                          alt={item?.about_business}
                          baseUrl={baseURl}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          minHeight: { xs: "120px", sm: "140px", md: "150px" }, // Adjusted minHeight values
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          mt={-1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%", // Ensure full width for proper centering
                          }}
                        >
                          <Typography
                            display={"inline"}
                            sx={{
                              fontSize: {
                                xs: "12px",
                                sm: "15px",
                                md: "16px",
                                lg: "16px",
                                xl: "18px",
                              },
                              fontWeight: "500",
                              textAlign: "center", // Ensures text is centered within its container
                            }}
                          >
                            {item.business_name}
                          </Typography>
                          {item?.is_featured === 1 && (
                            <Box
                              pl={1}
                              sx={{
                                width: {
                                  xs: "15px",
                                  sm: "15px",
                                  md: "16px",
                                  lg: "16px",
                                  xl: "18px",
                                },
                                height: {
                                  xs: "15px",
                                  sm: "15px",
                                  md: "16px",
                                  lg: "16px",
                                  xl: "18px",
                                },
                              }}
                            >
                              <VerifiedBusinessIcon
                                width={"inherit"}
                                height={"auto"}
                              />
                            </Box>
                          )}
                        </Box>

                        <Box
                          mb={0.5}
                          mt={-0}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%", // Ensures full width for centering the text
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "11px",
                                sm: "13px",
                                md: "13px",
                                lg: "13px",
                                xl: "20px",
                              },
                              fontWeight: "300",
                              textAlign: "center", // Center text horizontally
                            }}
                            color="gray"
                          >
                            {item?.business_country}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%", // Ensures full width for proper centering
                          }}
                        >
                          <Typography
                            color="black"
                            sx={{
                              fontSize: { xs: "11px", sm: "15px" },
                              fontWeight: "400",
                              textAlign: "center", // Center the rating text horizontally
                            }}
                          >
                            {item?.business_rating}
                          </Typography>

                          <Rating
                            readOnly
                            value={item?.business_rating}
                            name="feedback"
                            precision={0.5}
                            sx={{
                              ...commonStyles.muiStartsRatingStyles,
                            }}
                            icon={<StarIcon />}
                            emptyIcon={<StarBorderIcon />}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%", // Ensures full width for centering
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                                md: "13px",
                                lg: "13px",
                                xl: "17px",
                              },
                              fontWeight: "300",
                              color: "black",
                              textAlign: "center", // Center the review count text horizontally
                            }}
                          >
                            <b> Reviews ({item.reviews_count})</b>
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid> */}
            </Box>
          ) : (
            <Box
              sx={{
                height: "70vh",
              }}
            >
              <CustomLoader />
            </Box>
          )}

          {!loader && (
            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {sellersCollectiveList?.data?.length > 0 ? (
                <Stack spacing={1}>
                  <Pagination
                    shape="rounded"
                    variant="outlined"
                    page={page}
                    count={sellersCollectiveList?.last_page}
                    onChange={handleChange}
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: { xs: "0.7rem", sm: "0.9rem", lg: "1rem" },
                        color: "black",
                        margin: { xs: "2px 2px", sm: "6px 9px", md: "0 8px" },
                        padding: { xs: "4px", lg: "19px " },
                      },
                    }}
                  />
                </Stack>
              ) : (
                <Typography
                  sx={{
                    marginLeft: { xs: "0px", lg: "80px" },
                    fontWeight: "600",
                    marginBottom: "6%",
                    marginTop: "6%",
                    textAlign: { xs: "center", lg: "left" },
                    ...commonStyles.commonHeadingStyles,
                  }}
                >
                  No business found
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
export default BusinessCollection;
