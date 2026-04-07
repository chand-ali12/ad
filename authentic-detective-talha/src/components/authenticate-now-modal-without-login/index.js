import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { commonStyles } from "@/commonStyles";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, List, ListItem } from "@mui/material";
import Link from "next/link";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const AuthenticateNowWithoutLoginModal = ({ open, handleClose }) => {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          "& .MuiPaper-root": {
            position: "absolute",
            top: "10%",
            margin: "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            ...commonStyles.commonSubHeadingStyles,
            p: 0,
            pl: 2,
          }}
          id="customized-dialog-title"
        >
          Alert
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              padding: "2px 4px 2px 4px",
            }}
          >
            <Typography
              gutterBottom
              sx={{
                ...commonStyles.commonTextStyles,
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                  lg: "18px",
                  xl: "20px",
                },
              }}
            >
              We recommend that you create an account and sign in before
              submitting your request in order to see all of your completed and
              pending certificates.
            </Typography>
            <Typography gutterBottom>
              <List sx={{ listStyleType: "disc", pl: 2 }}>
                <ListItem sx={{ display: "list-item", pl: 0,display:"flex-inline", }}>
                  <Link href={"/login"} onClick={handleClose}>
                    <Typography
                      sx={{
                        ...commonStyles.commonTextStyles,
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                          md: "14px",
                          lg: "18px",
                          xl: "20px",
                        },
                      }}
                    >
                      Sign in/
                    </Typography>
                  </Link>
                  <Link href={"/signup"} onClick={handleClose}>
                    <Typography
                      sx={{
                        ...commonStyles.commonTextStyles,
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                          md: "14px",
                          lg: "18px",
                          xl: "20px",
                        },
                      }}
                    >
                      Sign up
                    </Typography>
                  </Link>
                </ListItem>
                <ListItem sx={{ display: "list-item", pl: 0 }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextStyles,
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "14px",
                        lg: "18px",
                        xl: "20px",
                      },
                    }}
                  >
                    Download our app on{" "}
                    <Link
                      href="https://play.google.com/store/apps/details?id=com.techificent.authenticdetetctive&pli=1"
                      onClick={handleClose}
                      target="_blank"
                      rel="nooppener noreferrer"
                    >
                      Google Play
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="https://apps.apple.com/us/app/authentic-detective/id1659681647"
                      onClick={handleClose}
                      target="_blank"
                      rel="nooppener noreferrer"
                    >
                      App Store
                    </Link>
                  </Typography>
                </ListItem>
                <ListItem sx={{ display: "list-item", pl: 0 }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextStyles,
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "14px",
                        lg: "18px",
                        xl: "20px",
                      },
                    }}
                  >
                    View all of your completed and pending certificates!
                  </Typography>
                </ListItem>
              </List>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              ...commonStyles.buttonCommonStyles,
              textTransform: "none",
              color: "white",
              bgcolor: "black",
              fontWeight: "600",
              fontSize: { xs: "12px", md: "16px" },
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            Close
          </Button>

          <Link
            style={{
              textDecoration: "none",
            }}
            href={"/authentication"}
          >
            <Button
              type="submit"
              sx={{
                ...commonStyles.buttonCommonStyles,
                textTransform: "none",
                color: "white",
                bgcolor: "black",
                fontWeight: "600",
                fontSize: { xs: "12px", md: "16px" },
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Authenticate Now!
            </Button>
          </Link>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AuthenticateNowWithoutLoginModal;
