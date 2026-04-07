import { TextField, MenuItem, Box, Typography } from "@mui/material";
import React from "react";

const MuiCustomTextField = ({ fullWidth, placeholder }) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder ? placeholder : ""}
      InputProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "25px",
          height: {
            xs: "35px",
            sm: "40px",
            md: "45px",
            lg: "50px",
            xl: "55px",
          },
        },
        disableUnderline: true,
      }}
      sx={{
        width: { xs: "95%", sm: "100%", md: fullWidth ? "100%" : "80%" },

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "transparent",
          },
          "&:hover fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            borderColor: "transparent",
          },
        },
      }}
    />
  );
};

export default MuiCustomTextField;
