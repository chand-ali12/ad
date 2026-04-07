import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SliderR from "./swiper";
import { commonStyles } from "@/commonStyles";

const RecentSeller = () => {
  const starStyle = {
    color: "rgb(255 199 0)", // Color of the filled star

    borderRadius: "50%", // Rounded border
    padding: "5px", // Space between the border and icon
    margin: "0 2px", // Space between stars
  };

  const filledStarStyle = {
    ...starStyle,
    color: "#FFD43B", // Color for the filled star
    border: "none", // Remove border for filled star
  };

  return (
    <Box sx={{ bgcolor: "#F6F3EE", p: 4, pl: 1, pr: 1 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            color: "#3D2F2B",

            ...commonStyles.commonHeadingStyles,
          }}
        >
          Recent Seller Reviews
        </Typography>
      </Box>

      <SliderR />
    </Box>
  );
};

export default RecentSeller;
