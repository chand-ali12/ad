import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Box, Typography, useMediaQuery, Grid } from "@mui/material";
import Image from "next/image";
import Person from "../../../../public/default-image.png";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseWindowDimensions from "../../../../utils/getWindowDimensions";

const filledStarStyle = { color: "gold", marginRight: "2px" };
const starStyle = { color: "yellow", marginRight: "2px" };

const slidesData = [
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText: "Great authentic items. Would recommend to everyone!",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText:
      "Bought a Louis Vuitton bag and a body suit from her and i love them! Such a easy process! Great quality! Recommend to anyone that wants some great deals on authentic designer items!",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText:
      "Super friendly and honest! | appreciate how she's transparent and always takes time to make sure an item is authentic.",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText:
      "Very trusted store, bought from them multiple times and everything was always perfect",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText: "Great Seller",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText:
      "Very trusted store, bought from them multiple times and everything was always perfect",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText: "Great Seller",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText:
      "Very trusted store, bought from them multiple times and everything was always perfect",
  },
  {
    imgSrc: Person,
    reviewer: "Alexandre",
    reviewed: "Savic",
    rating: 1,
    reviewText: "Great Seller",
  },
  // Add more items as needed
];

const RecentStyle = {
  Gridsx: {
    backgroundColor: "white",
    width: { xs: "259px", sm: "233px", lg: "259px" },
    height: { xs: "310px", sm: "276px", lg: "310px" },
    border: "1px solid white",
    borderRadius: "6px",
    margin: "auto",
  },
  Heading1: {
    fontFamily: "var(--font-montserrat)",
    color: "black",
    fontWeight: "600",
    fontSize: { xs: "12px", lg: "13px" },
  },
  Heading2: {
    fontFamily: "var(--font-montserrat)",
    color: "gray",
    fontSize: { xs: "12px", lg: "10px" },
  },
  Heading3: {
    fontFamily: "var(--font-montserrat)",
    color: "black",
    fontWeight: "600",
    fontSize: { xs: "12px", lg: "15px" },
  },
};

export default function SliderR() {
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const { width } = UseWindowDimensions();

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        375: {
          slidesPerView: 1,
          spaceBetween: 3,
        },
        425: {
          slidesPerView: 1,
          spaceBetween: 4,
        },
        480: {
          slidesPerView: width / 330,
          spaceBetween: 10,
        },
        800: {
          slidesPerView: width / 330,
          spaceBetween: 10,
        },
      }}
    >
      {slidesData.map((item, index) => (
        <SwiperSlide key={index}>
          <Grid item xs={12} sm={4} lg={2.3} sx={{ justifyContent: "center" }}>
            <Box sx={{ ...RecentStyle.Gridsx }}>
              <Box
                sx={{
                  borderRadius: "50%",
                  border: "1px solid white",
                  width: 50,
                  height: 50,
                  overflow: "hidden",
                  mt: 1.5,
                  ml: 1.5,
                }}
              >
                <Image src={item.imgSrc} alt="Logo" width={50} height={50} />
              </Box>

              <Box>
                <Typography
                  ml={9}
                  mt={-6.5}
                  variant="body2"
                  sx={{ ...RecentStyle.Heading1 }}
                >
                  {item.reviewer}
                </Typography>
                <Typography
                  ml={9}
                  variant="body2"
                  sx={{ ...RecentStyle.Heading2 }}
                >
                  reviewed
                </Typography>
                <Typography
                  ml={9}
                  variant="body2"
                  sx={{ ...RecentStyle.Heading1 }}
                >
                  {item.reviewed}
                </Typography>
              </Box>

              <Box pl={1} pt={1} display="" mx="" my="" sx="">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ color: "white" }}>{item.rating}</Box>
                  <FontAwesomeIcon icon={faStarSolid} style={filledStarStyle} />
                  <FontAwesomeIcon icon={faStarSolid} style={filledStarStyle} />
                  <FontAwesomeIcon icon={faStarSolid} style={filledStarStyle} />
                  <FontAwesomeIcon icon={faStarSolid} style={filledStarStyle} />
                  <FontAwesomeIcon icon={faStarSolid} style={filledStarStyle} />
                </div>
              </Box>

              <Box ml={2} p={0.7}>
                <Typography variant="body2" sx={{ ...RecentStyle.Heading3 }}>
                  {item.reviewText}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Box p={2}></Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
