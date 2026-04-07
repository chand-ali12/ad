import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { COMMON_VALUE_FOR_CERTIFICATE } from "../../../utils/commonData";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const SubscriptionModal = ({ open, handleClose, handleDoNotShowAgain }) => {
  const [checked, setChecked] = React.useState(false);

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    handleDoNotShowAgain(isChecked);
  };

  const CurrentDate = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    return <strong>{today}</strong>;
  };
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
            ml: { xs: 1, sm: "auto" },
            mr: { xs: 1, sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            padding: "16px 24px",
            pl: 2,
          }}
          id="customized-dialog-title"
        >
          Attention
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
              padding: "2px 4px",
            }}
          >
            <Typography
              gutterBottom
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                  md: "16px",
                  lg: "18px",
                  xl: "20px",
                },
                fontWeight: "400",
              }}
            >
              Due to our rapid growth and to continue bringing you our efficient
              and reliable service, price of a standard certificate of
              authenticity will increase to $10. Our prices for premium brands
              and jewelry will remain unchanged. You can save up to 15% with our
              new subscriptions!
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleCheckboxChange} />
            }
            label="Do not show again"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
              color: "white",
              bgcolor: "black",
              fontWeight: "600",
              fontSize: { xs: "12px", md: "16px" },
              padding: { xs: "5px 20px", lg: "8px 40px" },
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
          <Link href="/subscriptions" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                textTransform: "none",
                color: "white",
                bgcolor: "black",
                fontWeight: "600",
                fontSize: { xs: "12px", md: "16px" },
                padding: { xs: "5px 20px", lg: "8px 40px" },
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Subscribe
            </Button>
          </Link>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default SubscriptionModal;
