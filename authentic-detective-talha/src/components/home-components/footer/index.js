import {
  Grid,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";
import FotterLogo from "../../../../public/assets/images/footer-logo.png";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import Link from "next/link";
import TechiImageIcon from "../../../../public/svgs/TechiImage";

const Footer = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          height: "2px",
          backgroundColor: "#cfc5b3",
          zIndex: 1,
        }}
      ></Box>
      <Box
        sx={{
          backgroundColor: "#f6f3ee",
          textAlign: "center",
          padding: { xs: "3px", lg: "20px" },
          mb: 1,
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            marginLeft: "0px",
          }}
        >
          <Grid
            item
            xs={5}
            md={3}
            sx={{
              paddingLeft: { xs: "4px !important", sm: "16px" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "start", sm: "space-around" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, lg: 2 },
                textAlign: { xs: "start", sm: "center" },
              }}
            >
              <Link
                href="/terms-of-service"
                style={{
                  textDecoration: "none",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    ...commonStyles.commonTextStyles,
                    width: "100%",
                    fontSize: {
                      xs: "8px",
                      sm: "13px",
                      md: "15px",
                      lg: "16px",
                      xl: "17px",
                    },
                  }}
                >
                  Terms of Service
                </Typography>
              </Link>

              <Link
                href="privacy-policy"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  color: "black",
                  fontWeight: "400",
                  textDecoration: "none",
                  fontSize: { xs: "9px", sm: "14px", lg: "17px" },
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    ...commonStyles.commonTextStyles,
                    width: "100%",
                    fontSize: {
                      xs: "8px",
                      sm: "13px",
                      md: "15px",
                      lg: "16px",
                      xl: "17px",
                    },
                  }}
                >
                  Privacy Policy
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Footer Logo */}
          <Grid
            item
            xs={2}
            md={5}
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                pl: { xs: "0px", sm: "1%", md: "7%" },
              }}
            >
              <AdImage
                src={FotterLogo}
                alt="Footer Logo"
                style={{
                  width: isMobile ? "100%" : isMedium ? "50%" : "15%",
                  height: isMobile ? "auto" : isMedium ? "auto" : "15%",
                  objectFit: "contain",
                }}
                fill={false}
                layout="default"
              />
            </Box>
          </Grid>

          {/* Social Icons */}
          <Grid item xs={5} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "end", sm: "space-between" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, lg: 2 },
                ml: { xs: 0, sm: "" },
              }}
            >
              <Box
                sx={{
                  textAlign: "end",
                }}
              >
                <IconButton
                  href="https://www.facebook.com/share/1Ge4CkxxzL/?mibextid=LQQJ4d"
                  aria-label="Facebook"
                  sx={{
                    color: "black",
                    fontSize: { xs: "10px", lg: "20px" }, // Reduce size for xs screens
                  }}
                >
                  <FacebookIcon sx={{ fontSize: { xs: "10px", lg: "20px" } }} />
                </IconButton>
                <IconButton
                  href="https://www.instagram.com/authenticdetective/profilecard/?igsh=MTJ2bnp6bGlkcHdnOA=="
                  aria-label="Instagram"
                  sx={{
                    color: "black",
                    fontSize: { xs: "10px", lg: "inherit" }, // Reduce size for xs screens
                  }}
                >
                  <InstagramIcon
                    sx={{ fontSize: { xs: "10px", lg: "20px" } }}
                  />
                </IconButton>
                {/* <IconButton
                  href="https://twitter.com"
                  aria-label="Twitter"
                  sx={{
                    color: "black",
                    fontSize: { xs: "10px", lg: "20px" }, // Reduce size for xs screens
                  }}
                >
                  <TwitterIcon sx={{ fontSize: { xs: "10px", lg: "20px" } }} />
                </IconButton> */}
              </Box>
              <Box
                sx={{
                  textAlign: "end",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    ...commonStyles.commonTextStyles,

                    fontSize: {
                      xs: "8px",
                      sm: "13px",
                      md: "15px",
                      lg: "16px",
                      xl: "17px",
                    },
                  }}
                >
                  2025 © Authentic Detective
                </Typography>
              </Box>
            </Box>
          </Grid>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "center" },
              width: "100%",
              alignItems: "center",
              mt: 1,
              mb: 1,
            }}
          >
            <Typography
              sx={{
                color: "black",
                ...commonStyles.commonTextStyles,

                fontSize: {
                  xs: "8px",
                  sm: "13px",
                  md: "15px",
                  lg: "16px",
                  xl: "17px",
                },
              }}
            >
              Powered By
            </Typography>
            <a href="https://techificent.com/" target="_blank">
              <TechiImageIcon isMobile={isMobile} isMedium={isMedium} />
            </a>
          </Box> */}
        </Grid>
      </Box>
    </>
  );
};

export default Footer;
