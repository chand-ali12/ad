import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { commonStyles } from "@/commonStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../../utils/api/axios-client";
import { CHANGE_PASSWORD } from "../../../utils/api/constants";
import { currentUserInformation } from "@/store/slice/userData";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { notifyError, notifySuccess } from "../../../utils/toast";
import CustomErrorMessage from "@/common-commponent/error-message";
import { UpdatePasswordSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

function UpdatePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // mode: "onBlur",
    resolver: yupResolver(UpdatePasswordSchema),
  });
  const router = useRouter();
  const userInfo = useSelector(currentUserInformation);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const changePassword = async (newPassword) => {
    try {
      const response = await axiosInstance.post(CHANGE_PASSWORD, {
        password: newPassword,
      });
      if (response?.data?.status) {
        notifySuccess(response?.data?.msg);
        router.push("/profile");
      } else {
        notifyError(response?.data?.msg);
      }
    } catch (error) {
      // notifyError(response?.data?.msg);
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect to the internet first.");
      } else {
        notifyError(error.toString());
      }
    }
  };

  const onSubmit = async (data) => {
    // console.log("data of teh form: ", data);
    // Assuming the new password is passed in the 'password' field
    await changePassword(data.newPassword);
  };

  return (
    <Box
      sx={{
        height: "82vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* {console.log("userInfo in change password: ", userInfo)}; */}
      <Box
        sx={{
          maxWidth: { xs: "95%", sm: "80%", md: "65%" },
          width: "100%",
          marginTop: 6,
        }}
      >
        <Typography
          gutterBottom
          sx={{
            ...commonStyles.commonHeadingStyles,
          }}
        >
          Change Password
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: { xs: "90%", sm: "80%", md: "60%" },
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          padding: { xs: 2, md: 4 },
          backgroundColor: "white",
          marginTop: 2,
        }}
      >
        <Box sx={{ padding: "10px" }}>
          <Box pt={2}>
            <Typography sx={commonStyles.commonTextFieldsLabelStyles}>
              New Password
            </Typography>
            <TextField
              {...register("newPassword")}
              type={passwordVisible ? "text" : "password"}
              margin="normal"
              fullWidth
              placeholder="New Password"
              onChangeCapture={(e) => {
                const trimmedValue = e.currentTarget.value
                  ?.trimStart()
                  ?.trimEnd()
                  ?.replace(/ +(?= )/g, "");

                if (trimmedValue !== undefined) {
                  setValue("newPassword", trimmedValue);
                }
              }}
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
            {errors.newPassword && (
              <CustomErrorMessage errorMessage={errors.newPassword.message} />
            )}
          </Box>

          <Box pt={2}>
            <Typography sx={commonStyles.commonTextFieldsLabelStyles}>
              Confirm New Password
            </Typography>
            <TextField
              {...register("confirmPassword")}
              type={confirmPasswordVisible ? "text" : "password"}
              margin="normal"
              fullWidth
              placeholder="Confirm New Password"
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
            {errors.confirmPassword && (
              <CustomErrorMessage
                errorMessage={errors.confirmPassword.message}
              />
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={Object.keys(errors).length > 0}
            sx={{
              mt: 3,
              ...commonStyles.buttonCommonStyles,
              ...commonStyles.commonHover,
              color: "white",
              bgcolor: "black",
              textTransform: "none",

              // "&:hover": {
              //   backgroundColor: "black",
              // },
              cursor: "pointer",
            }}
          >
            {isSubmitting ? <CircularProgress /> : "Change Password"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default UpdatePassword;
