import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, List, ListItem, Step } from "@mui/material";
import { commonStyles } from "@/commonStyles";
import Link from "next/link";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { Router, useRouter } from "next/router";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const AuthenticateNowWithLoginModal = ({ open, handleClose }) => {
  const router = useRouter();
  const [modalStepsState, setModalStepsState] = useState(1);
  const [selectedValue, setSelectedValue] = useState();

  const handleClickSubmitButton = () => {
    setModalStepsState(modalStepsState + 1);
  };

  useEffect(() => {
    if (modalStepsState === 4 && selectedValue) {
      router.push({
        pathname: "/authentication",
        query: { type: "bulk", value: selectedValue },
      });
    }
  }, [modalStepsState, router, selectedValue]);

  const values = Array.from({ length: 9 }, (_, i) => i + 2);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  console.log("modalStepsState", selectedValue);

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
            ...commonStyles.commonTextStyles,
            p: 2,
          }}
          id="customized-dialog-title"
        >
          {modalStepsState === 1 || modalStepsState === 2
            ? "Authenticate Queries"
            : "How many Certificate do you want?"}
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
            {modalStepsState <= 2 && (
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
                {modalStepsState === 1
                  ? "Please select what type of authentication you want?"
                  : `Note: For Bulk Authentication you have to add your authentication queries one by one, If you select "2" queries then you will add your 1st query and then you will add your 2nd query respectively. Thank You.`}
              </Typography>
            )}
            {modalStepsState > 2 && (
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="queries_count"
                  name="queries_count"
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <Grid container spacing={1}>
                    {values.map((value) => (
                      <Grid item xs={2} key={value}>
                        <FormControlLabel
                          value={value.toString()}
                          control={<Radio className="ppp" />}
                          label={value}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {modalStepsState === 1 && (
            <Link
              style={{
                textDecoration: "none",
              }}
              href={{
                pathname: "/authentication",
                query: { type: "single" },
              }}
            >
              <Button
                sx={{
                  ...commonStyles.buttonCommonStyles,
                  textTransform: "none",
                  color: "white",
                  bgcolor: "black",

                  fontSize: { xs: "12px", md: "16px" },
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                Single
              </Button>
            </Link>
          )}
          {modalStepsState > 1 && (
            <Button
              onClick={handleClose}
              sx={{
                ...commonStyles.buttonCommonStyles,
                textTransform: "none",
                color: "white",
                bgcolor: "black",
                //   fontWeight: "600",
                fontSize: { xs: "12px", md: "16px" },
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            sx={{
              ...commonStyles.buttonCommonStyles,
              ...commonStyles.disabledButton,

              textTransform: "none",
              color: "white",
              bgcolor: "black",
              // fontWeight: "600",
              fontSize: { xs: "12px", md: "16px" },
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            onClick={handleClickSubmitButton}
            disabled={modalStepsState === 3 && !selectedValue ? true : false}
          >
            {modalStepsState === 1
              ? "Bulk"
              : modalStepsState === 2
              ? "Next"
              : "Proceed"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AuthenticateNowWithLoginModal;
