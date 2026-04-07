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

import { notifyError } from "../../../utils/toast";
import CustomLoader from "@/common-components/custom-loader";

import noImage from "../../../public/noImage.png";
import REV from "../../../public/assets/images/revBg.png";
import Dp from "../../../public/assets/images/monkey2.png";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewCard from "../reviews/part3";

function UserProfileView() {
  const router = useRouter();
  const currentUserInfo = useSelector(currentUserInformation);
  const [userInfo, setUserInfo] = useState();
  const [loader, setLoader] = useState(true);
  const [imgSrc, setImgSrc] = useState();
  const [reviewsData, setReviewsData] = useState();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `${GET_USER_PROFILE}?id=${currentUserInfo.user.id}`
      );
      console.log("response: ", response);
      setUserInfo(response?.data?.additional_data || {});
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
        <Box sx={{ width: "90%" }}>
         

          <Box
            sx={{
              width: "100%",
              minHeight: "75vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                marginTop: 2,
                alignItems: "center",
                maxWidth: { xs: "90%", sm: "80%", md: "80%" },
                width: "100%",
                boxShadow: 3,
                borderRadius: 2,
                padding: { xs: 2, md: 2 },
                backgroundColor: "white",
              }}
            >
              {console.log("PROFILE PIC: ", userInfo?.user?.profile_picture)}
              {/* Profile Image */}
              <Avatar
                src={
                  userInfo?.user?.profile_picture
                    ? `${process?.env?.NEXT_PUBLIC_MEDIA_BASE_URL}/usersProfile/${userInfo?.user?.profile_picture}`
                    : noImage?.src
                }
                sx={{
                  width: { xs: 100, sm: 150 },
                  height: { xs: 100, sm: 150 },
                  marginRight: 3,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ ...commonStyles.commonHeadingStyles, fontWeight: "bold" }}
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
                  Total Reviews({userInfo?.businessReviewCount})
                </Typography>
              </Box>
            </Box>
          </Box >
          

          <ReviewCard
            reviewsData={reviewsData}
            userInfo={userInfo}
            getUserProfile={getUserProfile}
            apiRole={currentUserInfo?.apiRole}
          />
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
    </>
  );
}

export default UserProfileView;
