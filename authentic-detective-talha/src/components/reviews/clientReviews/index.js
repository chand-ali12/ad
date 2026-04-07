//packages imports
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import React, { useEffect, useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, Grid, useMediaQuery, Typography, Rating } from "@mui/material";
// assets imports
import REV from "../../../../public/assets/images/revBg.png";
// import Dp from "../../../../public/assets/images/monkey2.png";
import Dp from "../../../../public/default-image.png";

//axios instance
import axios from "../../../../utils/api/axios-client";
//styles
import { commonStyles } from "@/commonStyles";
//components imports
import { notifyError } from "../../../../utils/toast";
import Part2Reviews from "@/components/reviews/reviewsPart2";
import { currentUserInformation } from "@/store/slice/userData";
import { GET_BUSINESS_PROFILE, GET_BUSINESS_PROFILE_SLUG } from "../../../../utils/api/constants";
import ReviewCard from "../part3";
import CustomLoader from "@/common-components/custom-loader";
import VerifiedBusinessIcon from "../../../../public/assets/svgs/verifiedBusinessIcon";

const ClientReview = ({ id }) => {
  //states
  const [userInfo, setUserInfo] = useState();
  const [reviewsData, setReviewsData] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [refreshReviews, setRefreshReviews] = useState(false);
  const [loader, setLoader] = useState(true);

  const handleRefreshReviews = () => {
    setRefreshReviews((prev) => !prev); 
  };

  //mui media queries
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  //redux data
  const currentUserInfo = useSelector(currentUserInformation);

  const getBusinessProfile = async () => {
    try {
      const response = await axios.get(`${GET_BUSINESS_PROFILE_SLUG}?id=${id}`);
      setUserInfo(response?.data?.additional_data?.business || {});
      setReviewsData(response?.data?.data);
      console.log("userInfo in clientReview", userInfo?.id);
      console.log(
        "currentuserInfo in clientReview",
        currentUserInfo?.user?.user_business[0]?.id
      );
    } catch (error) {
      notifyError(error.toString());
    }
    setLoader(false);
  };

  const handleImageError = () => {
    setImgSrc(REV);
  };

  useEffect(() => {
    getBusinessProfile();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setImgSrc(
        userInfo?.business_cover_picture
          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessCover/${userInfo?.business_cover_picture}`
          : REV
      );
    }
  }, [userInfo]);

  return (
    <>
      {loader ? (
        <Box
          sx={{
            height: "50vh",
          }}
        >
          <CustomLoader />
        </Box>
      ) : (
        <Box>
          <Box>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#f0f0f0",
                height: { xs: "200px", sm: "250px", md: "300px", lg: "350px" },
              }}
            >
              <Image
                width={500}
                height={300}
                quality={100}
                fill={false}
                src={imgSrc}
                alt="book a call"
                // layout="responsive"
                onError={handleImageError}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <Grid container spacing={1}>
              <Grid item xs={4} sm={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 0,
                    ml: 1,
                  }}
                >
                  <Image
                    src={
                      userInfo?.business_profile_picture
                        ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessProfile/${userInfo?.business_profile_picture}`
                        : Dp.src
                    }
                    alt="Dp"
                    width={isMobile ? 100 : 150}
                    height={isMobile ? 100 : 150} // Ensure square dimensions
                    onError={(event) => {
                      event.target.src = Dp.src;
                    }}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%", // Circle shape
                      marginTop: isMobile ? 4 : 1,
                    }}
                  />
                  {userInfo?.is_featured === 1 && (
                    <Box ml={-2} mt={{ xs: 8, sm: 12 }}>
                      <VerifiedBusinessIcon />
                    </Box>
                  )}
                </Box>
                {/* {console.log("userInfo aaaaasd: ", userInfo)} */}
              </Grid>

              <Grid item xs={8} sm={8}>
                <Box
                  sx={{
                    p: 1,
                    mt: 1,
                    ml: { sm: -4.5, md: -10, lg: -15 },
                  }}
                >
                  <Typography
                    sx={{
                      ...commonStyles?.commonHeadingStyles,
                      mb: 0.3,
                    }}
                  >
                    {userInfo?.business_name}
                  </Typography>

                  <Typography
                    sx={{
                      ...commonStyles?.commonTextStyles,
                      mb: 0.3,
                    }}
                  >
                    {userInfo?.business_address}
                  </Typography>
                  <Typography
                    component="a"
                    href={
                      userInfo?.website
                        ? userInfo.website.startsWith("http")
                          ? userInfo.website
                          : `http://${userInfo.website}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ...commonStyles?.commonTextStyles,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    {userInfo?.website}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      position: "relative",
                      mt: 1,
                      mr: 1,
                      // top: "-23px",
                    }}
                  >
                    <Typography
                      sx={{ mr: 0, fontSize: { xs: "12px", sm: "18px" } }}
                    >
                      {userInfo?.business_rating} &nbsp;
                    </Typography>

                    <Rating
                      readOnly
                      value={userInfo?.business_rating ?? 0}
                      name="feedback"
                      precision={0.5}
                      sx={{
                        ...commonStyles.muiStartsRatingStyles,
                        "& .MuiRating-iconEmpty": {
                          "&::before": {
                            backgroundColor: "transparent",
                          },
                        },
                      }}
                      icon={
                        <StarIcon
                          sx={{
                            fontSize: { xs: "16px", sm: "24px", md: "29px" },
                          }}
                        />
                      }
                      emptyIcon={
                        <StarBorderIcon
                          sx={{
                            fontSize: { xs: "16px", sm: "24px", md: "29px" },
                          }}
                        />
                      }
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Box sx={{ textAlign: "center", p: 1, pt: 0 }}>
                  <Typography
                    sx={{
                      ...commonStyles?.commonTextStyles,
                      fontWeight: "600",
                    }}
                  >
                    {userInfo?.about_business}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            mt={2}
            mb={2}
            sx={{ width: "100%", border: "1.3px solid hsla(240,7%,62%,1)" }}
          ></Box>
        </Box>
      )}

      {!currentUserInfo?.accessToken ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              textAlign: "center",
              mb: 0,
              mt: 2,
            }}
          >
            <b>
              <Link href="/login" underline="hover">
                Log in
              </Link>{" "}
              to leave a review!
            </b>
          </Typography>
        </Box>
      ) : (
        currentUserInfo?.user?.user_business[0]?.id != userInfo?.id && (
          <Part2Reviews
            userInfo={userInfo}
            getBusinessProfile={getBusinessProfile}
            apiRole={currentUserInfo?.apiRole}
            refresh={refreshReviews}
          />
        )
      )}

      <ReviewCard
        reviewsData={reviewsData}
        userInfo={userInfo}
        getUserProfile={getBusinessProfile}
        apiRole={currentUserInfo?.apiRole}
        onDelete={handleRefreshReviews}
      />
    </>
  );
};

export default ClientReview;
