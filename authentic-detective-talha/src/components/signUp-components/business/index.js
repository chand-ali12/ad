import {
  Box,
  Container,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import AdImage from "@/components/zingImage";
import Dp from "../../../../public/assets/images/cuate.png";
import Link from "next/link";
const UserSignUpComponent = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <Box>
      <Box pb={14} sx={{ bgcolor: "#f6f3ee", width: "100%" }}>
        <Grid container spacing={2} pt={10}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              pb={1}
              sx={{
                pt: { xs: "15px", lg: "2px" },

                display: "flex",
                alignItems: "center",
                margin: { xs: "auto" },
                justifyContent: "center",
                position: "relative",
                zIndex: "1",
                top: { lg: "-60px", xs: "-60px" },
              }}
            >
              <AdImage
                src={Dp}
                alt="book a call"
                style={{
                  width: isMobile ? "200px" : "250px",
                  height: isMobile ? "145px" : "350px",
                }}
                fill={false}
                // layout="default"
              />
            </Box>
          </Grid>
          <Grid pb={1} item xs={12} sm={5}>
            <Box
              sx={{
                display: "flex",
                paddingLeft: { xs: "5%", md: "0%" },
              }}
            >
              <Link
                href="/login"
                style={{
                  textDecoration: "none",
                  display: "block",
                  color: "inherit",
                }}
              >
                <Button
                  sx={{
                    textTransform: "Capitalize",
                    color: " black",
                    bgcolor: "white",
                    fontWeight: "600",
                    fontSize: { xs: "12px", md: "16px" },
                    borderRadius: "24px",
                    padding: { xs: "4px 55px", lg: "9px 80px" },
                    "&:hover": {
                      backgroundColor: "white",
                    },
                    cursor: "pointer",
                  }}
                >
                  User
                </Button>
              </Link>
              <Link
                href="/business-signup"
                style={{
                  textDecoration: "none",
                  display: "block", // Make Link a block to occupy the full width of the Button
                  width: "48%", // Adjust width to fit within the container with some spacing
                  color: "inherit",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "Capitalize",
                    color: " white",
                    marginLeft: "14px",
                    bgcolor: "black",
                    fontWeight: "600",
                    fontSize: { xs: "12px", md: "16px" },
                    borderRadius: "24px",
                    padding: { xs: "5px 40px", lg: "9px 66px" },
                    "&:hover": {
                      backgroundColor: "black",
                    },
                  }}
                >
                  Business
                </Button>
              </Link>
            </Box>

            <Box pt={4} sx={{ paddingLeft: { xs: "5%", lg: "0px" } }}>
              <Typography
                variant="body2"
                color="initial"
                sx={{
                  textTransform: "Capitalize",
                  color: " black",

                  fontWeight: "600",
                  fontSize: { xs: "20px", sm: "23px", md: "26px" },
                }}
              >
                Sign in
              </Typography>
            </Box>

            <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%0" } }}>
              <Typography
              
                color="initial"
                sx={{
                  textTransform: "Capitalize",
                  color: " black",
                  fontWeight: "100",
                  fontSize: "23px",
                }}
              >
                To your Business Account
              </Typography>
            </Box>

            <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
               
                color="initial"
                sx={{
                  textTransform: "Capitalize",
                  color: " black",
                  fontWeight: "600",
                  fontSize: "15px",
                  textDecoration: "underline",
                }}
              >
                Email Address
              </Typography>
              <Box
                pt={2}
                sx={{
                  borderRadius: "32px",
                  overflow: "hidden", // Ensures that the border radius is visible
                  display: "inline-block", // Adjust based on your layout needs
                }}
              >
                <TextField
                  required
                  id="filled-helperText"
                  defaultValue=" "
                  fullWidth // Ensure the text field takes up full width of the container
                  variant="outlined"
                  // Ensure the TextField uses an outline style
                  sx={{
                    borderRadius: "25px",
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      border: "none", // Remove default border
                      "& fieldset": {
                        border: "none", // Remove the fieldset border
                      },
                      "&:hover fieldset": {
                        border: "none", // Remove the fieldset border on hover
                      },
                      "&.Mui-focused fieldset": {
                        border: "none", // Remove the fieldset border when focused
                      },
                    },
                    width: { xs: "300px", sm: "340px", md: "600px" },
                  }}
                />
              </Box>
            </Box>
            <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
                
                color="initial"
                sx={{
                  textTransform: "Capitalize",
                  color: " black",
                  fontWeight: "600",
                  fontSize: "15px",
                  textDecoration: "underline",
                }}
              >
                Password
              </Typography>
              <Box
                pt={3}
                sx={{
                  borderRadius: "32px",
                  overflow: "hidden", // Ensures that the border radius is visible
                  display: "inline-block", // Adjust based on your layout needs
                }}
              >
                <TextField
                  required
                  id="filled-helperText"
                  defaultValue=" "
                  fullWidth // Ensure the text field takes up full width of the container
                  variant="outlined"
                  // Ensure the TextField uses an outline style
                  sx={{
                    borderRadius: "25px",
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      border: "none", // Remove default border
                      "& fieldset": {
                        border: "none", // Remove the fieldset border
                      },
                      "&:hover fieldset": {
                        border: "none", // Remove the fieldset border on hover
                      },
                      "&.Mui-focused fieldset": {
                        border: "none", // Remove the fieldset border when focused
                      },
                    },
                    width: { xs: "300px", sm: "340px", md: "600px" },
                  }}
                />
              </Box>
            </Box>
            <Box ml={1} sx={{ paddingLeft: { xs: "3%", md: "0%" } }}>
              <Typography
                variant="caption"
                color="initial"
                sx={{
                  color: "gray",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Box
              pt={3}
              sx={{
                display: "flex",
                justifyContent: "center", // Center content horizontally
                alignItems: "center", // Center content vertically if needed
              }}
            >
              <Button
                sx={{
                  textTransform: "Capitalize",
                  color: "white",
                  bgcolor: "black",
                  fontWeight: "600",
                  fontSize: { xs: "12px", md: "16px" },
                  borderRadius: "24px",
                  padding: { xs: "5px 55px", lg: "9px 80px" },
                  "&:hover": {
                    backgroundColor: "black ",
                  },
                  marginRight: "16px",
                }}
              >
                Sign in
              </Button>
            </Box>

            <Box
              pt={2}
              sx={{
                display: "flex",
                justifyContent: "center", // Center content horizontally
                alignItems: "center", // Center content vertically if needed
              }}
            >
              <Typography
                variant="caption"
                color="initial"
                sx={{
                  color: "black",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                }}
              >
                {`Don't have an account?`}

                <Link href="/UserSignUpPage">Sign Up!</Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserSignUpComponent;
