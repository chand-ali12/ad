// pages/forgot-password.js
import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgetPasswordSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";
import CustomErrorMessage from "@/common-commponent/error-message";
import { commonStyles } from "@/commonStyles";
import { FORGET_PASSWORD } from "../../../utils/api/constants";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../utils/toast";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ForgetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    // console.log("Submitted data:", data);

    const forgetPasswordApi = {
      email: data?.email,
    };

    try {
      const response = await axiosInstance.post(
        `${FORGET_PASSWORD}`,
        forgetPasswordApi
      );

      if (response?.data?.status_code === 200) {
        notifySuccess(response.data.msg);
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        notifyError(response.data.msg);
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("please connect to the internet first");
      } else {
        notifyError(error.toString());
      }
    }
  };

  return (
    <Grid container sx={{ height: "85vh", backgroundColor: "#fff" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          p: 5,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              ...commonStyles.commonTextFieldsLabelStyles,
              mb: 2,
              color: "rgba(41, 41, 41, 0.5);",
            }}
          >
            A Better Way to Increase
          </Typography>
          <Typography sx={{ ...commonStyles.commonHeadingStyles }}>
            Customers with Reviews.
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: { xs: "100%", sm: "75%", md: "70%" },
            p: 2,
          }}
        >
          <Grid item xs={12}>
            <Typography sx={{ ...commonStyles.commonHeadingStyles }}>
              Forgot
            </Typography>
            <Typography sx={{ mb: 3, ...commonStyles.commonSubHeadingStyles,mt:0 }}>
              your Password?
            </Typography>
          </Grid>

          <Grid item xs={12} pt={2}>
            <Typography
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
              }}
            >
              Email Address
            </Typography>
            <TextField
              {...register("email")}
              name="email"
              id="email"
              type="email"
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <CustomErrorMessage errorMessage={errors.email.message} />
            )}
          </Grid>

          <Grid
            item
            xs={12}
            pt={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              sx={{
                ...commonStyles.buttonWithBlackColor,
                                  ...commonStyles.commonHover,
                
                backgroundColor: "black",
                color: "white",
              }}
              disabled={Object.keys(errors).length > 0}
              variant="contained"
              fullWidth
            >
              {isSubmitting ? <CircularProgress /> : "Send"}
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
