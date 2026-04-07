import React from "react";
import Grid from "@mui/material/Grid";
import { CardsStyle } from "./style";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { TextField, SearchIcon } from "@mui/icons-material";

import { commonStyles } from "@/commonStyles";
import Link from "next/link";

const AuthentiCards = () => {
  return (
    <>
      <Box sx={{ bgcolor: "#050404" }}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center", textAlign: "center" }}
        >
          <Grid item md={10}>
            <Box pt={5} sx={{ justifyContent: "center", textAlign: "center" }}>
              <Typography
                variant="h2"
                color="initial"
                sx={{
                  ...CardsStyle.heading1,
                  ...commonStyles.commonHeadingStyles,
                }}
              >
                Authenticity Cards
              </Typography>
            </Box>

            <Box
              m={1}
              pt={2}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                color="initial"
                sx={{
                  ...CardsStyle.Para1,
                  ...commonStyles.commonTextStyles,
                  fontWeight: "700",
                }}
              >
                {` Tap to Verify. Always Be Sure.`}
              </Typography>
            </Box>

            <Box
              m={1}
              pt={2}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                color="initial"
                sx={{ ...CardsStyle.Para1, ...commonStyles.commonTextStyles }}
              >
                {`Each Authenticity Card is digitally linked to your Certificate of Authenticity. With built-in NFC technology, simply tap the card to your phone to instantly access proof of authenticity—anytime, anywhere.`}
              </Typography>
              <br></br>
              <Typography
                sx={{
                  ...CardsStyle.Para1,
                  ...commonStyles.commonTextStyles,
                  fontWeight: "700",
                }}
              >
                {` A sleek, secure way to show your item is the real deal.`}
              </Typography>
            </Box>
            <Link
              href="/authentic-cards"
              variant="body1"
              style={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
            >
              <Box
                p={4}
                pb={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <Button
                  sx={{
                    ...CardsStyle.mainbtn1,
                    ...commonStyles.buttonCommonStyles,
                  }}
                >
                  Get My Card
                </Button>
              </Box>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AuthentiCards;
