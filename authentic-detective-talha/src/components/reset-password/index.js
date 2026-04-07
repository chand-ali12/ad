import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { commonStyles } from "@/commonStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Dp from "../../../public/assets/images/cuate.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomErrorMessage from "@/common-commponent/error-message";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  useMediaQuery,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ResetPasswordSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";
import AdImage from "../zingImage";
import { useRouter } from "next/router";
import axiosInstance from "../../../utils/api/axios-client";
import { RESET_PASSWORD } from "../../../utils/api/constants";
import { notifyError, notifySuccess } from "../../../utils/toast";

const ResetPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const onSubmit = async (data) => {
    const resetPasswordApiData = {
      password: data.password,
      // confirmPassword: data?.confirmPassword,
      token: router?.query?.token,
    };

    try {
      const response = await axiosInstance.post(
        `${RESET_PASSWORD}`,
        resetPasswordApiData
      );

      if (response?.data?.status_code === 200) {
        notifySuccess(response.data.msg);
        router.push("/login");
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
    <Grid container sx={{ height: "100vh", backgroundColor: "#fff" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          p: 5,
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

            zIndex: "1",

            width: { xs: "75%", sm: "80%", md: "60%" },
            height: { xs: "85%", sm: "80%", md: "90%" },
          }}
        >
          <AdImage
            src={Dp}
            alt="book a call"
            style={{
              width: isMobile ? "100%" : "100%",
              height: isMobile ? "100%" : "100%",
            }}
            fill={false}
            layout="default"
          />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              ...commonStyles.commonTextFieldsLabelStyles,
              mb: 2,
              mt: 2,
              color: "rgba(41, 41, 41, 0.5);",
            }}
          >
            A Better Way to Increase
          </Typography>
          <Typography sx={{ ...commonStyles.commonHeadingStyles }}>
            Customers with Reviews
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
              Reset Password
            </Typography>
            <Typography
              sx={{
                mb: 1,
                ...commonStyles.commonTextStyles,
                fontWeight: "550",
              }}
            >
              Please provide your new password.
            </Typography>
          </Grid>
          <Grid item xs={12} pt={2}>
            <Typography
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
              }}
            >
              Password
            </Typography>
            <TextField
              {...register("password")}
              name="password"
              id="password"
              type={passwordVisible ? "text" : "password"}
              margin="normal"
              fullWidth
              label="Password"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      edge="end"
                    >
                      {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && (
              <CustomErrorMessage errorMessage={errors.password.message} />
            )}
          </Grid>

          <Grid item xs={12} pt={2}>
            <Typography
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              {...register("password_confirmation")}
              name="password_confirmation"
              id="password_confirmation"
              type={confirmPasswordVisible ? "text" : "password"}
              margin="normal"
              fullWidth
              label="Confirm Password"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                      edge="end"
                    >
                      {confirmPasswordVisible ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password_confirmation && (
              <CustomErrorMessage
                errorMessage={errors.password_confirmation.message}
              />
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
              {isSubmitting ? <CircularProgress /> : "Update Password"}
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
