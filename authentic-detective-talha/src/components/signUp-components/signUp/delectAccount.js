import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  useMediaQuery,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import AdImage from "@/components/zingImage";
import Dp from "../../../../public/assets/images/cuate.png";

import Link from "next/link";
import MuiCustomTextField from "@/common-components/muiCustomTextField";
import { commonStyles } from "@/commonStyles";
import { styles } from "@/components/terms-of-service/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSignUpSchema } from "../../../../utils/validationSchemas/contactsUsValidationSchema";
import { DELETE_ACCOUNT, USER_LOGIN } from "../../../../utils/api/constants";
import axiosInstance from "../../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import { useRouter } from "next/router";
import { persistUserData } from "@/store/slice/userData";
import { useDispatch } from "react-redux";
import CustomErrorMessage from "@/common-commponent/error-message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setCookie } from "cookies-next";

const appkey = "base64:jhpGVQy5BV76gfyLGXee9kGj2o2fMnSq2XhviHX+gMI=";
const defaultContentType = "multipart/form-data";

const DeleteAccountComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userOrBusiness, setUserOrBusiness] = useState("user");
  const [business, setBusiness] = useState("user");

  useEffect(() => {
    if (router.isReady && router?.query?.success) {
      notifySuccess(router.query.success);
    }
  }, [router.isReady, router.query.success]);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: yupResolver(UserSignUpSchema),
  });

  const textFieldStyles = {
    ...commonStyles.textFieldStyles,
    width: "100%",
    mb: 1,
    "& .MuiInputBase-root": {
      height: "50px",
    },
  };

  const onSubmit = async (data, e) => {
    // setIsLoading(true);

    const bodyData = {
      email: getValues()?.email,
      password: getValues()?.password,
    };

    try {
      const response = await axiosInstance.post(USER_LOGIN, bodyData);
      // console.log("response status",response?.data?.data?.accessToken)
      if (response?.data?.data) {
        // router.push("/");
        if (response?.data?.status_code == 200) {
          // notifySuccess("You are now logged in successfully!");
          try {
            const deleteResponse = await axiosInstance.post(
              DELETE_ACCOUNT,
              {},
              {
                headers: {
                  "Content-Type": defaultContentType,
                  sessiontoken: response?.data?.data?.accessToken,
                  // appkey: appkey
                },
              },
            );
            // console.log("delete response", deleteResponse);

            if (deleteResponse?.data?.status) {
              notifySuccess(deleteResponse?.data?.msg);
              router.push("/");
            } else {
              notifyError(deleteResponse?.data?.msg);
            }
          } catch (error) {
            // console.log("error error", error);
            notifyError(error?.message);
          }
        }
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        if (response?.data?.msg === "Invalid Details") {
          setIsLoading(false);
          notifyError("Password invalid");
        } else if (response?.data?.msg === "Email Does not exist") {
          setIsLoading(false);
          notifyError("Email Does not exist");
        } else {
          setIsLoading(false);
          notifyError(response?.data?.msg);
        }
      } else {
        setIsLoading(false);
        notifyError(response?.data?.msg);
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect to the internet first.");
      } else {
        notifyError(error.toString());
      }
    }
    setDeleteModal(false);
  };

  // console.log("valuessss", getValues());

  const [deleteModal, setDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleOpenDeleteModal = () => setDeleteModal(true);
  return (
    <Box>
      <Box pb={14} sx={{ bgcolor: "#f6f3ee", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
          <Typography sx={{ ...commonStyles.commonHeadingStyles }}>
            Delete Account
          </Typography>
        </Box>
        <Grid container spacing={2} pt={{ xs: 2, sm: 5, md: 10 }}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              pb={1}
              sx={{
                pt: { xs: "15px", lg: "2px" },
                // display: "flex",
                // alignItems: "center",
                margin: { xs: "auto" },
                // justifyContent: "center",
                zIndex: "1",
                width: { xs: "80%", sm: "80%", md: "80%", lg: "auto" },
                height: { xs: "90%", sm: "80%", md: "90%", lg: "auto" },
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
          </Grid>

          <Grid pb={1} item xs={12} sm={5}>
            {/* <Box pt={2} sx={{ display: "flex", justifyContent: "center" }}>
                            <Typography
                                color="initial"
                                sx={{
                                    textTransform: "Capitalize",
                                    color: " black",
                                    ...commonStyles.commonTextStyles,
                                }}
                            >
                                Do You Want to Delete Your Account?
                            </Typography>
                        </Box> */}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                pt={2}
                sx={{
                  paddingLeft: { xs: "5%", md: "0%" },
                  paddingRight: { xs: "5%" },
                }}
              >
                <Typography
                  color="initial"
                  sx={{
                    textTransform: "Capitalize",
                    color: " black",

                    textDecoration: "underline",
                    mb: {
                      xs: -1.5,
                      md: 0,
                    },
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
                  placeholder="Email Address"
                  // label="Email Address"
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    sx: { ...commonStyles.muiTextFieldINputProps },
                    disableUnderline: true,
                  }}
                  sx={{ textFieldStyles }}
                />
                {errors.email && (
                  <CustomErrorMessage errorMessage={errors.email.message} />
                )}
              </Box>
              <Box
                pt={2}
                sx={{
                  paddingLeft: { xs: "5%", md: "0%" },
                  paddingRight: { xs: "5%" },
                }}
              >
                <Typography
                  color="initial"
                  sx={{
                    textTransform: "Capitalize",
                    color: " black",
                    mb: {
                      xs: -1.5,
                      md: 0,
                    },
                    textDecoration: "underline",
                    ...commonStyles.commonTextFieldsLabelStyles,
                  }}
                >
                  Password
                </Typography>
                <Box>
                  <TextField
                    {...register("password")}
                    name="password"
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    margin="normal"
                    fullWidth
                    placeholder="Password"
                    // label="Password"
                    autoComplete="current-password"
                    onChangeCapture={(e) => {
                      const trimmedValue = e.currentTarget.value
                        ?.trimStart()
                        ?.trimEnd()
                        ?.replace(/ +(?= )/g, "");

                      if (trimmedValue !== undefined) {
                        setValue("password", trimmedValue);
                      }
                    }}
                    InputProps={{
                      sx: {
                        ...commonStyles.muiTextFieldINputProps,
                        // paddingRight: "15px",
                        pr: 3.5,
                      },
                      disableUnderline: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            edge="end"
                          >
                            {passwordVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ textFieldStyles }}
                  />

                  {errors.password && (
                    <CustomErrorMessage
                      errorMessage={errors.password.message}
                    />
                  )}
                </Box>
              </Box>

              <Box
                pt={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  // type="submit"
                  sx={{
                    textTransform: "Capitalize",
                    color: "white",
                    bgcolor: "black",
                    fontWeight: "600",
                    fontSize: { xs: "12px", md: "16px" },
                    ...commonStyles.borderRadius,
                    ...commonStyles.disabledButton,

                    padding: { xs: "5px 55px", lg: "9px 80px" },
                    "&:hover": {
                      backgroundColor: "black ",
                    },
                    marginRight: "16px",
                  }}
                  onClick={() => handleOpenDeleteModal()}
                  //onSubmit(getValues, e)
                  // disabled={Object.keys(errors).length > 0}
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  Delete
                  {/* {isSubmitting ? <CircularProgress size={24} /> : "Delete"} */}
                </Button>
                {/* {console.log("errors", isLoading)} */}
                <Dialog
                  open={deleteModal}
                  onClose={handleCloseDeleteModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  sx={{
                    borderRadius: "20px",
                    minWidth: "320px",
                    boxShadow: 1,
                    p: 2,
                    bgcolor: "transparent",
                  }}
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust the opacity here (0.3 is lighter)
                    },
                  }}
                >
                  <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "400",
                      textAlign: "center",
                      color: "text.primary",
                    }}
                  >
                    Are you sure you want to Delete?
                  </DialogTitle>
                  <DialogActions
                    sx={{
                      justifyContent: "center",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Button
                      onClick={() => handleCloseDeleteModal()}
                      variant="contained"
                      // color="primary"
                      sx={{
                        ...commonStyles.borderRadius,
                        width: "10px",
                        textTransform: "Capitalize",
                        color: "white",
                        fontWeight: "600",
                        fontSize: { xs: "12px", md: "16px" },
                        padding: { xs: "5px 55px", lg: "9px 80px" },
                        marginRight: "16px",
                        bgcolor: "black",
                        "&:hover": { bgcolor: "black" },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      autoFocus
                      variant="contained"
                      color="error"
                      type="submit"
                      onClick={() => {
                        onSubmit();
                      }}
                      sx={{
                        width: "10px",
                        textTransform: "Capitalize",
                        color: "white",
                        fontWeight: "600",
                        fontSize: { xs: "12px", md: "16px" },
                        ...commonStyles.borderRadius,
                        padding: { xs: "5px 55px", lg: "9px 80px" },
                        marginRight: "16px",
                      }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DeleteAccountComponent;
