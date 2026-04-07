import React from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import AdImage from "@/components/zingImage";
import Dp from "../../../public/assets/images/verify-photo.jpg";
import { commonStyles } from "@/commonStyles";

function AuthenticationCertificate() {
  return (
    <Box sx={{}}>
      <Grid
        container
        spacing={0}
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          pt: { xs: 4, md: 6, lg: 10 },
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <Grid item xs={12} md={5} lg={4}>
          <Typography
            sx={{
              ...commonStyles.commonHeadingStyles,
              textAlign: { xs: "center", sm: "left" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              mb: { xs: 4, md: 0 },
            }}
          >
            Authentic Detective Certificate
            <br /> Verification
          </Typography>
        </Grid>

        <Grid item md={1} lg={2} />

        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: "650px" }}>
            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
                mb: 1,
              }}
            >
              {`Already have an item authenticated by Authentic Detective? Use this page to verify the certificate that came with it—so you know it’s real and untampered.`}
            </Typography>

            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
                mb: 1,
                fontWeight: "700",
              }}
            >
              {`What Is Verification?`}
            </Typography>
            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
              }}
            >
              <Typography
                component={"span"}
                sx={{
                  ...commonStyles.applyFontFamily,
                  fontSize: { xs: "16px", md: "18px" },
                  color: "#4A4A4A",
                  fontWeight: "700",
                }}
              >
                Verification
              </Typography>
              {` confirms that a Certificate of Authenticity issued by Authentic Detective is `}
              <Typography
                component={"span"}
                sx={{
                  ...commonStyles.applyFontFamily,
                  fontSize: { xs: "16px", md: "18px" },
                  color: "#4A4A4A",
                  fontWeight: "700",
                }}
              >
                genuine, unaltered, and matches our official records.
              </Typography>
            </Typography>
            <br></br>

            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
              }}
            >
              {` It’s different from `}
              <Typography
                component={"span"}
                sx={{
                  ...commonStyles.applyFontFamily,
                  fontSize: { xs: "16px", md: "18px" },
                  color: "#4A4A4A",
                  fontWeight: "700",
                }}
              >
                authentication,
              </Typography>
              {`  which is the process of reviewing an item to determine whether it’s real or fake. `}
            </Typography>
            <br></br>
            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
                fontWeight: "700",
              }}
            >
              How to Verify
            </Typography>

            <List sx={{ listStyleType: "decimal", pl: 2 }}>
              <ListItem sx={{ display: "list-item", paddingLeft: 0 }}>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        ...commonStyles.applyFontFamily,
                        fontSize: { xs: "16px", md: "18px" },
                        color: "#4A4A4A",
                        fontWeight: "700",
                      }}
                    >
                      Enter the certificate number{" "}
                      <Typography component="span" fontWeight="normal">
                        in the form below to confirm its validity in our
                        database.
                      </Typography>
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ display: "list-item", paddingLeft: 0 }}>
                <ListItemText
                  primary={
                    <>
                      <Typography
                        sx={{
                          ...commonStyles.applyFontFamily,
                          fontSize: { xs: "16px", md: "18px" },
                          color: "#4A4A4A",
                          fontWeight: "700",
                        }}
                      >
                        <Typography component="span" fontWeight="normal">
                          Or,{" "}
                        </Typography>
                        scan the QR code{" "}
                        <Typography component="span" fontWeight="normal">
                          on the physical certificate to instantly pull up the
                          official digital copy.
                        </Typography>
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </List>
            <br></br>
            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "#4A4A4A",
              }}
            >
              <strong>**Always check that the URL matches:</strong>
            </Typography>

            <Typography
              sx={{
                ...commonStyles.applyFontFamily,
                fontSize: { xs: "16px", md: "18px" },
                color: "blue",
                textDecoration: "underline",
                wordBreak: "break-word",
              }}
            >
              https://authenticdetective.com/certificates/your-code
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <AdImage
              src={Dp}
              alt="Authentication Certificate"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AuthenticationCertificate;
