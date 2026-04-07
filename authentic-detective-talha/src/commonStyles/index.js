export const commonStyles = {
  borderRadius: {
    borderRadius: { xs: "7px", sm: "9px", md: "11px", lg: "13px" },
  },

  disabledButton: {
    "&.Mui-disabled": {
      backgroundColor: "grey",
      color: "white",
    },
  },

  applyFontFamily: {
    fontFamily: "var(--font-montserrat)",
  },

  commonHeadingStyles: {
    fontWeight: "700",
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "32px", xl: "36px" },
    lineHeight: { xs: "22px", sm: "28px", md: "34px", lg: "38px", xl: "42px" },
  },
  commonLightHeadingStyles: {
    fontWeight: "500",
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "32px", xl: "36px" },
    lineHeight: { xs: "22px", sm: "28px", md: "34px", lg: "38px", xl: "42px" },
  },

  commonSubHeadingStyles: {
    fontWeight: "600",
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "14px", sm: "18px", md: "22px", lg: "25px", xl: "28px" },
    lineHeight: { xs: "16px", sm: "20px", md: "25px", lg: "30px", xl: "33px" },
    mt: 2,
    mb: 2,
  },
  commonTextStyles: {
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "12px", sm: "16px", md: "18px", lg: "20px", xl: "22px" },
    lineHeight: { xs: "18px", sm: "22px", md: "24px", lg: "26px", xl: "28px" },
    fontWeight: "400",
  },
  buttonCommonStyles: {
    padding: {
      xs: "6px 14px",
      sm: "7px 15px",
      md: "8px 22px",
      lg: "10px 28px",
      xl: "10px 33px",
    },
    fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18", xl: "20px" },
    borderRadius: { xs: "7px", sm: "9px", md: "11px", lg: "13px" },
    fontFamily: "var(--font-montserrat)",
    textTransform: "capitalize",
  },
  buttonWithBlackColor: {
    fontFamily: "var(--font-montserrat)",
    backgroundColor: "black",
    color: "white",
    fontWeight: "600",
    fontSize: { xs: "12px", md: "16px" },
    borderRadius: { xs: "7px", sm: "9px", md: "11px", lg: "13px" },
    // padding: { xs: "6px 55px", lg: "9px 80px" },
    padding: {
      xs: "6px 14px",
      sm: "7px 15px",
      md: "8px 22px",
      lg: "10px 28px",
      xl: "10px 33px",
    },
    textTransform: "none",
    cursor: "pointer",
  },

  commonHover: {
    "&:hover": {
      backgroundColor: "black",
      // Only apply hover effect when button is not disabled
      "&:not(:disabled)": {
        backgroundColor: "#000", // or any color you want for hover
      },
    },
    "&:disabled": {
      backgroundColor: "gray", // or your desired disabled color
      cursor: "not-allowed",
      opacity: 0.7,
    },
  },

  commonTextFieldsLabelStyles: {
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px", xl: "22px" },
    lineHeight: { xs: "18px", sm: "22px", md: "24px", lg: "26px", xl: "28px" },
    fontWeight: "500",
    fontFamily: "var(--font-montserrat)",
  },
  commonCartTextStyles: {
    fontFamily: "var(--font-montserrat)",
    fontSize: { xs: "12px", sm: "12px", md: "16px", lg: "18px", xl: "18px" },
    lineHeight: { xs: "18px", sm: "22px", md: "24px", lg: "26px", xl: "28px" },
    fontWeight: "400",
  },

  textFieldStyles: {
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
    "& .MuiOutlinedInput-input": {
      backgroundColor: "white",
      borderRadius: "25px",
    },
  },
  modalHeading: {
    fontSize: {
      xs: "16px",
      sm: "16px",
      md: "18px",
      lg: "20px",
      xl: "24px",
    },
    fontFamily: "var(--font-montserrat)",
  },
  modalText: {
    fontSize: {
      xs: "14px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "18px",
    },
    fontFamily: "var(--font-montserrat)",
  },

  fontFamilyProject: {
    fontFamily: "var(--font-montserrat)",
  },

  muiTextFieldINputProps: {
    // changes
    marginTop: {
      xs: "8px",
      sm: "4px",
      md: "0px",
      xl: "-2px",
    },
    backgroundColor: "white !important",
    borderRadius: "25px",
    height: {
      xs: "35px",
      sm: "40px",
      md: "45px",
      lg: "50px",
      xl: "55px",
    },
    "& .MuiOutlinedInput-input": {
      height: {
        xs: "0px",
        sm: "10px",
        md: "15px",
        lg: "20px",
        xl: "30px",
      },
    },
  },
  muiStartsRatingStyles: {
    opacity: 1,
    fontSize: { xs: "12px", sm: "29px" },
    "& .MuiRating-iconFilled": {
      color: "#FBAF01",
    },
    "& .MuiRating-iconEmpty": {
      color: "#FBAF01",
      position: "relative",
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: -1,
      },
    },
  },
};
