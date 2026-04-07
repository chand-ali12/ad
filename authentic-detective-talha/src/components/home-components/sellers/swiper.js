import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import {
  Box,
  Rating,
  Typography,
  useMediaQuery,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import UseWindowDimensions from "../../../../utils/getWindowDimensions";
import Image from "next/image";
import Person from "../../../../public/default-image.png";
import VerifiedBusinessIcon from "../../../../public/assets/svgs/verifiedBusinessIcon";
import LinkImageIcon from "../../../../public/assets/images/link.jpg"
import Link from "next/link";
const ProfileImageWithSkeleton = ({ item, isMobile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        border: "1px solid white",
        width: { xs: 70, sm: 100 },
        height: { xs: 70, sm: 100 },
        overflow: "hidden",
        mt: 2,
        position: "relative",
      }}
    >
      {isLoading && (
        <Skeleton
          variant="circular"
          width={isMobile ? 70 : 100}
          height={isMobile ? 70 : 100}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}
      <Image
        src={
          hasError || !item.business_profile_picture
            ? Person // Fallback image
            : `https://auth-detect.s3.amazonaws.com/businessProfile/${item.business_profile_picture}`
        }
        alt={item.business_name || "person"}
        width={isMobile ? 70 : 100}
        height={isMobile ? 70 : 100}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          visibility: isLoading ? "hidden" : "visible", // Hide image until loaded
        }}
      />
    </Box>
  );
};
export default function SliderR({ allVerifiedBusinessData }) {
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isScreen390 = useMediaQuery("(max-width: 390px)");
  const isScreen320 = useMediaQuery("(max-width: 320px)");
  const isScreen360 = useMediaQuery("(max-width: 360px)");
  const isScreen375 = useMediaQuery("(max-width: 375px)");
  const isScreen540 = useMediaQuery("(max-width: 540px)");

  const { width } = UseWindowDimensions();

  const [widthForSmallerScreen, setWidthForSmallerScreen] = useState("144px");

  useEffect(() => {
    if (window) {
      setWidthForSmallerScreen(Math.round(width / 2.08) + "px");
    }
  }, [width]);

  if (!allVerifiedBusinessData || allVerifiedBusinessData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log("allVerifiedBusinessData", allVerifiedBusinessData.id);

const handleLinkIconClick = (event, websiteLink) => {
  event.preventDefault();
  event.stopPropagation();

  if (websiteLink) {
    const hasProtocol = /^(https?:)?\/\//i.test(websiteLink);
    const normalizedLink = hasProtocol ? websiteLink : `https://${websiteLink}`;
    window.open(normalizedLink, "_blank");
  }
};
  return (
    <Box>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 200000, disableOnInteraction: false }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 1,
          },
          540: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          800: {
            slidesPerView: width / 290,
            spaceBetween: 10,
          },
        }}
      >
        {allVerifiedBusinessData.map((item, index) => (
          <SwiperSlide key={index}>
            <Link
              href={`/business-profile/${item?.slug}`}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  border: "1px solid black",
                  bgcolor: "#272727",
                  width: {
                    xs: widthForSmallerScreen,
                    sm: "220px",
                    md: "240px",
                  },
                  margin: "auto",
                  textAlign: "center",
                  paddingBottom: "32px",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProfileImageWithSkeleton item={item} isMobile={isMobile} />
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    position: "relative",
                    // top: isScreen390 ? "-20px" : "-33px",
                    left: "37px", mr: { xs: 3, sm: 1 }, mt: { xs: -3, sm: -4 }, mb: 2.5
                  }}
                >
                  <VerifiedBusinessIcon />
                </Box>

                <Box
                  sx={{
                    justifyContent: "center",
                    textAlign: "center",
                    height: { xs: 2, sm: 9, md: 12, lg: 15 },
                  }}
                >
                  <Typography
                    color="white"
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "14px",
                      mt: "-5px",
                    }}
                  >
                    {item.business_name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                  <Rating
                    readOnly
                    value={item.business_rating}
                    name="feedback"
                    precision={0.5}
                    sx={{
                      mt: (() => {
                        if (isScreen320) return 5;
                        if (isScreen360) return 5;
                        if (isScreen375) return 4;
                        if (isScreen390) return 2.5;
                        if (isScreen540) return 3;
                        return 1.5;
                      })(),
                      "& .MuiRating-iconFilled": {
                        color: "currentColor",
                      },
                      "& .MuiRating-iconEmpty": {
                        color: "white",
                      },
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 1 }} fontSize="inherit" />
                    }
                  />
                </Box>

                <Box
                  pt={0.5}
                  sx={{
                    justifyContent: "center",
                    textAlign: "center", width: "inherit"
                  }}
                >
                  <Typography
                    color="white"
                    noWrap
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "14px",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item?.business_country}
                  </Typography>
                </Box>

                <Box
                  pt={0.5}
                  sx={{ justifyContent: "center", textAlign: "center" }}
                >
                  <Typography
                    color="white"
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "14px",
                    }}
                  >
                    ({item.reviews.length}) Reviews
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    border: "1px solid white",
                    overflow: "hidden",
                    mt: 2,
                  }}
                  onClick={(e) => handleLinkIconClick(e, item?.website)}
                >
                  <Image
                    src={LinkImageIcon}
                    alt="LinkImageIcon"
                    width={isMobile ? 20 : 35}
                    height={isMobile ? 20 : 35}
                  />
                </Box>
              </Box>
            </Link>

            <Box p={2}></Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
