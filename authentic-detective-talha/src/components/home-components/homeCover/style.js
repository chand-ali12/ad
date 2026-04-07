import { Padding } from "@mui/icons-material";

export const HomeStyle = {
  Bg: {
    width: "100%",
    height: "auto",
    mt: { xs: 2, sm: 4 },
  },
  heading1: {
    color: "white",
    mt: { xs: 2, sm: 4 },
  },
  heading2: {
    color: "white",
  },
  mainbtn1: {
    color: "black",
    justifyContent: { xs: "start", lg: "center" },

    backgroundColor: "white",

    textTransform: "capitalize",

    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    mb: { xs: 2, sm: 3 },

    marginLeft: { xs: "12%", sm: "10%", md: "13%", lg: "0%" },
  },
};
