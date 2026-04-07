import React from "react";
import { Grid, Box, Typography, Card, Button, Link } from "@mui/material";
import Image from "next/image";
import { commonStyles } from "../../../commonStyles";
import Icon1 from "../../../../public/assets/images/resale.webp";
import Icon2 from "../../../../public/assets/images/sales.webp";
import Icon3 from "../../../../public/assets/images/trusted-seller.webp";

export default function NeedACertificate() {
  const data = [
    {
      heading: "Resale Value",
      description:
        "Items sold with a certificate of authenticity are typically priced higher as it puts the buyers mind at ease.",
      icon: Icon1,
    },
    {
      heading: "Quicker Sales",
      description: "Sell your items faster with a certificate of authenticity",
      icon: Icon2,
    },
    {
      heading: "Increased Trust",
      description:
        "Reputation is important. Make it clear to your clients that you sell authentic items.",
      icon: Icon3,
    },
  ];

  return (
    <Box>
      <Grid
        container
        spacing={1}
        sx={{ display: "flex", justifyContent: "center", p: 1, mb: 1 }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            sx={{
              ...commonStyles.commonHeadingStyles,
              textAlign: "center",
              my: { xs: 1, md: 4 },
            }}
          >
            Why You Need A Certificate
          </Typography>
        </Grid>
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={4}
            md={4}
            lg={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: { xs: 2, sm: 0 },
              mb: 1,
            }}
          >
            <Card
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid",
                borderColor: "#4a4a4a",
              }}
            >
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={5}
                  sm={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 1,
                    pl: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "90px",
                      height: "70px",
                      position: "relative",
                      mt: 2,
                    }}
                  >
                    <Image
                      src={item.icon}
                      alt={`${item.heading} icon`}
                      fill
                      style={{
                        objectFit: "contain",
                      }}
                      sizes="90px"
                    />
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={7}
                  sm={7}
                  sx={{
                    ...commonStyles.applyFontFamily,
                    fontWeight: 500,
                    fontSize: {
                      xs: "16px",
                      sm: "18px",
                      md: "20px",
                      lg: "24px",
                      xl: "30px",
                    },
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {item?.heading}
                </Grid>
                <Grid item xs={12} sm={12} p={1}>
                  <Typography
                    sx={{
                      ...commonStyles.applyFontFamily,
                      flexGrow: 1,
                      minHeight: {
                        xs: "60px",
                        sm: "100px",
                        md: "120px",
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: {
                        xs: "12px",
                        sm: "14px",
                        md: "16px",
                        lg: "20px",
                        xl: "22px",
                      },
                      color: "#4a4a4a",
                    }}
                  >
                    {item?.description}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Link href="/authentication" passHref>
          <Button
            sx={{
              ...commonStyles.borderRadius,
              ...commonStyles?.applyFontFamily,
              ...commonStyles?.buttonCommonStyles,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              color: "black",
              backgroundColor: "white",
              textTransform: "capitalize",
              zIndex: "10",
              mt: { xs: 1, sm: 7 },
              mb: { xs: 3, sm: 5 },
            }}
            variant="contained"
            fullWidth
          >
            Authenticate Now
          </Button>
        </Link>
      </Grid>
    </Box>
  );
}
