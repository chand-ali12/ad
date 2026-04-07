import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  Grid,
  Rating,
} from "@mui/material";
import { commonStyles } from "@/commonStyles";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import { useRouter } from "next/router";
import { GET_USER_PROFILE } from "../../../utils/api/constants";
import axiosInstance from "../../../utils/api/axios-client";
import { Skeleton } from "@mui/material";

import { notifyError } from "../../../utils/toast";
import CustomLoader from "@/common-components/custom-loader";

// import noImage from "../../../public/noImage.png";
import noImage from "../../../public/default-image.png";

import REV from "../../../public/default-image.png";
import Dp from "../../../public/assets/images/monkey2.png";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewCard from "../reviews/part3";

function ProfilePage(userId = null) {
  const router = useRouter();
  const currentUserInfo = useSelector(currentUserInformation);
  const [userInfo, setUserInfo] = useState();
  const [loader, setLoader] = useState(true);
  const [imgSrc, setImgSrc] = useState();
  const [reviewsData, setReviewsData] = useState();
  const [selectedID, setSelectedID] = useState(userId?.userId);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const getUserProfile = async () => {
    try {
      // const id = userId ?? currentUserInfo.user.id;
      // console.log("adafadfd: ", userId?.userId);
      const id = selectedID || currentUserInfo?.user?.id;
      const response = await axiosInstance.get(`${GET_USER_PROFILE}?id=${id}`);

      console.log("response: ", response);
      setUserInfo(response?.data?.additional_data || {});
      setReviewsData(response?.data?.data);
    } catch (error) {
      notifyError(error.toString());
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleImageError = () => {
    setImgSrc(REV);
  };

  useEffect(() => {
    if (userInfo) {
      setImgSrc(
        userInfo?.user?.cover_picture
          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersCover/${userInfo?.user?.cover_picture}`
          : REV
      );
      console.log(
        "iamge source: ",
        `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersCover/${userInfo?.user?.cover_picture}`
      );
    }
  }, [userInfo]);

  return (
    <>
      {!loader ? (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#f0f0f0",
                  height: {
                    xs: "200px",
                    sm: "250px",
                    md: "300px",
                    lg: "350px",
                  },
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
                    src={imgSrc}
                    alt="Cover Image"
                    onError={handleImageError}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>

              <Grid
                container
                justifyContent="center"
                sx={{
                  width: "100%",
                  minHeight: "auto",
                  padding: { xs: 2, md: 4 },
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={10}
                  md={8}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: { xs: 2, md: 2 },
                    backgroundColor: "white",
                  }}
                >
                  {loader ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 80, sm: 120 },
                        marginRight: 3,

                      }}
                    />
                  ) : (
                    <Avatar
                      src={
                        userInfo?.user?.profile_picture
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersProfile/${userInfo.user.profile_picture}`
                          : noImage?.src
                      }
                      sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 80, sm: 120 },
                        marginRight: 3,
                      }}
                    />
                  )}

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        ...commonStyles.commonHeadingStyles,
                        fontWeight: "bold",
                      }}
                    >
                      {userInfo?.user?.name}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 1, ...commonStyles.commonTextStyles }}
                    >
                      {userInfo?.user?.country}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 1, ...commonStyles.commonTextStyles }}
                    >
                      Total Reviews ({userInfo?.businessReviewCount})
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <ReviewCard
                reviewsData={reviewsData}
                userInfo={userInfo}
                getUserProfile={getUserProfile}
                apiRole={currentUserInfo?.apiRole}
              />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomLoader />
        </Box>
      )}
    </>
  );
}

export default ProfilePage;
