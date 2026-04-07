import { Typography } from "@mui/material";
import React from "react";

const CustomErrorMessage = ({ errorMessage }) => {
  return (
    <Typography sx={{ color: "red", fontSize: "12px" }}>
      {errorMessage}
    </Typography>
  );
};

export default CustomErrorMessage;
