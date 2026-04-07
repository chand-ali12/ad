import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Rating,
  useMediaQuery,
  Grid,
  Skeleton,
} from "@mui/material";
import { commonStyles } from "@/commonStyles";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import { useRouter } from "next/router";
import {
  GET_USER_PROFILE,
  GET_BUSINESS_PROFILE,
} from "../../../../utils/api/constants";
import axiosInstance from "../../../../utils/api/axios-client";
import REV from "../../../../public/default-image.png";
// import Dp from "../../../../public/assets/images/monkey2.png";
import Dp from "../../../../public/default-image.png";

import { notifyError } from "../../../../utils/toast";
import CustomLoader from "@/common-components/custom-loader";

import noImage from "../../../../public/noImage.png";
import Image from "next/image";
import ReviewCard from "@/components/reviews/part3";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import VerifiedBusinessIcon from "../../../../public/assets/svgs/verifiedBusinessIcon";

function BusinessProfilePage() {
  const router = useRouter();
  const currentUserInfo = useSelector(currentUserInformation);
  const [reviewsData, setReviewsData] = useState();
  const [userInfo, setUserInfo] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [loader, setLoader] = useState(true);
  //mui media queries
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  useEffect(() => {
    if (userInfo) {
      setImgSrc(
        userInfo?.business_cover_picture
          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessCover/${userInfo?.business_cover_picture}`
          : REV
      );
      // console.log(
      //   "iamge source: ",
      //   `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessCover/${userInfo?.business_cover_picture}`
      // );
    }
  }, [userInfo]);

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `${GET_BUSINESS_PROFILE}?id=${currentUserInfo.user.user_business[0]?.id}`
      );
      // console.log("response of business: ", response);
      setUserInfo(response?.data?.additional_data?.business || {});
      setReviewsData(response?.data?.data);
    } catch (error) {
      notifyError(error.toString());
    }
    setLoader(false);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleImageError = () => {
    setImgSrc(REV);
  };

  return (
    <>
      {!loader ? (
        <Box>
          <Box>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#f0f0f0",
                height: { xs: "200px", sm: "250px", md: "300px", lg: "350px" },
              }}
            >
              {loader ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height="100%"
                />
              ) : (
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
              )}
            </Box>
          </Box>

          <Box mt={1}>
            <Grid container spacing={1}>
              <Grid item xs={4} sm={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 1,
                    ml: 1,
                  }}
                >
                  {loader ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={isMobile ? 100 : 150}
                      height={isMobile ? 100 : 150}
                    />
                  ) : (
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
                  )}
                  {/* {console.log("userInfo jskdfhksd: ", userInfo)} */}
                  {userInfo?.is_featured === 1 && (
                    <Box ml={-2} mt={{ xs: 8, sm: 12 }}>
                      <VerifiedBusinessIcon />
                    </Box>
                  )}
                </Box>
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
                    href={userInfo?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ...commonStyles?.commonTextStyles,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%", // Limit to available width
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
        </Box>
      ) : (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
          }}
        >
          <CustomLoader />
        </Box>
      )}
      {/* {console.log("test00", currentUserInfo?.apiRole)} */}
      <ReviewCard
        reviewsData={reviewsData}
        userInfo={userInfo}
        getUserProfile={getUserProfile}
        apiRole={currentUserInfo?.apiRole}
      />
    </>
  );
}

export default BusinessProfilePage;

{
  /* <Box
mt={2}
sx={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}
>
<Box
  mt={2}
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: { xs: "100%", md: "80%" },
    padding: { xs: 1, md: 0 },
  }}
>
  <Grid container spacing={1}>
    <Grid item xs={3} sm={2}>
      <Box
        sx={{
          width: isMobile ? "100px" : "150px",
          height: isMobile ? "100px" : "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // mt: "12%",
          mt: 0,
          ml: 0,
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
      </Box>
    </Grid>

    <Grid item xs={7} sm={8}>
      <Typography
        className="HeadingReviewPage"
        sx={{
          fontSize: { xs: "16px", sm: "22px", md: "28px" },
          lineHeight: { xs: "20px", sm: "28px", md: "34px" },
          fontWeight: "700",
          pt: { xs: 0, sm: 2.5, md: 3 },
          ml: 5,
          fontFamily: "var(--font-montserrat)",
          textAlign: isMobile ? "center" : "left", // Center text on mobile
        }}
      >
        {userInfo?.business_name}
      </Typography>

      <Typography
        className="WebReviewPage"
        mt={1}
        sx={{
          ml: 5,
          fontSize: { xs: "12px", sm: "16px", md: "18px" },
          fontWeight: "400",
          fontFamily: "var(--font-montserrat)",
          textAlign: isMobile ? "center" : "left", // Center text on mobile
        }}
      >
        {userInfo?.business_address}
      </Typography>
      <Typography
        className="AdressReviewPage"
        mt={1}
        sx={{
          ml: 5,
          fontSize: { xs: "12px", sm: "16px", md: "18px" },
          fontWeight: "400",
          fontFamily: "var(--font-montserrat)",

          textAlign: isMobile ? "center" : "left", // Center text on mobile
        }}
      >
        {userInfo?.website}
      </Typography>
    </Grid>

    <Grid
      item
      xs={12}
      sm={2}
      sx={{
        width: "100%",
        margin: "auto",
        mb: { xs: 1, sm: 0 },
        pt: { xs: 0, sm: undefined },
      }}
    >
      <Box
        className="StarsReviewPage"
        sx={{
          my: { xs: 0, sm: 1 },
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-end",
          mt: isMobile ? 1 : 11,
          width: "100%",
        }}
      >
        <Typography
          variant="body2"
          color="black"
          sx={{
            fontSize: { xs: "12px", sm: "16px" },
            fontWeight: "bold",
            mr: 1,
            ml: { xs: 14, sm: 0 },
          }}
        >
          {userInfo?.business_rating}
        </Typography>

        <Rating
          readOnly
          value={userInfo?.business_rating ?? 0}
          name="feedback"
          precision={0.5}
          sx={{
            ...commonStyles.muiStartsRatingStyles,
            mr: 2,
          }}
          icon={
            <StarIcon
              sx={{ fontSize: { xs: "16px", sm: "24px", md: "29px" } }}
            />
          }
          emptyIcon={
            <StarBorderIcon
              sx={{ fontSize: { xs: "16px", sm: "24px", md: "29px" } }}
            />
          }
        />
      </Box>
    </Grid>
  </Grid>

  <Grid container justifyContent="center">
    <Grid item xs={12} sm={10} md={8}>
      <Typography
        className="DescReviewPage"
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "18px" },
          lineHeight: { xs: "18px", sm: "22px", md: "24px" },
          fontWeight: "400",
          textAlign: "center",
          fontFamily: "var(--font-montserrat)",
          pb: 2,
          ml: { xs: 10, sm: 0 },
        }}
      >
        <b>{userInfo?.about_business}</b>
      </Typography>
    </Grid>
  </Grid>
</Box>
</Box> */
}
