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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import AdImage from "@/components/zingImage";
import Dp from "../../../../public/assets/images/cuate.png";
// import login from "../../../../public/login.svg";
import Link from "next/link";
import MuiCustomTextField from "@/common-components/muiCustomTextField";
import { commonStyles } from "@/commonStyles";
import { styles } from "@/components/terms-of-service/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSignUpSchema } from "../../../../utils/validationSchemas/contactsUsValidationSchema";
import { USER_LOGIN } from "../../../../utils/api/constants";
import axios, {
  setHeadersToken,
} from "../.../../../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import { useRouter } from "next/router";
import { persistUserData } from "@/store/slice/userData";
import { useDispatch } from "react-redux";
import CustomErrorMessage from "@/common-commponent/error-message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setCookie } from "cookies-next";
import login from "../../../../public/login.4cdabf84.png";

const UserSignUpComponent = () => {
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
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
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
    e.preventDefault();
    setIsLoading(true);
    if (e.key === "Enter") {
      setFormData(formData);
    }

    const bodyData = {
      email: data?.email,
      password: data?.password,
    };

    try {
      const response = await axios.post(USER_LOGIN, bodyData);

      if (response?.data?.data) {
        setIsLoggedIn(true);
        const apiRole = {
          apiRole:
            response?.data?.data?.user?.user_business?.length > 0
              ? "business-user"
              : "user",
        };

        const minimalUserInfo = {
          id: response?.data?.data?.user?.id, // only if needed in middleware
          apiRole: apiRole.apiRole,
          accessToken: response?.data?.data?.accessToken, // if needed
        };

        setCookie(
          "userInfoAuthenticateDetective",
          JSON.stringify(minimalUserInfo),
          {
            expires: new Date("Fri, 31 Dec 9999 23:59:59 GMT"),
          },
        );

        // setCookie(
        //   "userInfoAuthenticateDetective",
        //   JSON.stringify({ ...response?.data?.data, ...apiRole }),
        //   {
        //     expires: new Date("Fri, 31 Dec 9999 23:59:59 GMT"),
        //   }
        // );

        console.log(
          "Cookie size:",
          encodeURIComponent(
            JSON.stringify({ ...response?.data?.data, ...apiRole }),
          ).length,
        );

        dispatch(persistUserData({ ...response?.data?.data, ...apiRole }));
        setHeadersToken(response?.data?.data.accessToken);

        router.push("/");

        if (response?.data?.msg === "User logged in successfully") {
          notifySuccess("User logged in successfully");
        } else {
          notifySuccess(response?.data?.msg);
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
  };

  return (
    <Box>
      <Box pb={14} sx={{ bgcolor: "#f6f3ee", width: "100%" }}>
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
                display: "flex",
                alignItems: "center",
                margin: { xs: "auto" },
                justifyContent: "center",
                zIndex: "1",
                width: { xs: "80%", sm: "80%", md: "80%" },
                height: { xs: "90%", sm: "80%", md: "90%" },
              }}
            >
              <AdImage
                src={login}
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
          {console.log("isLoading: ", isLoading)}
          <Grid pb={1} item xs={12} sm={5}>
            <Box
              sx={{
                display: "flex",

                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              <Button
                sx={{
                  textTransform: "Capitalize",
                  color: userOrBusiness === "user" ? "white" : "black",
                  bgcolor: userOrBusiness === "user" ? "black" : "white",
                  fontWeight: "600",
                  fontSize: { xs: "12px", md: "16px" },
                  ...commonStyles.borderRadius,
                  padding: { xs: "4px 55px", lg: "9px 80px" },
                  "&:hover": {
                    backgroundColor:
                      userOrBusiness === "user" ? "black" : "white",
                  },
                  cursor: "pointer",
                }}
                onClick={() => setUserOrBusiness("user")}
              >
                User
              </Button>
              <Button
                variant="contained"
                sx={{
                  textTransform: "Capitalize",
                  color: userOrBusiness === "business" ? "white" : "black",
                  bgcolor: userOrBusiness === "business" ? "black" : "white",
                  marginLeft: "14px",
                  fontWeight: "600",
                  fontSize: { xs: "12px", md: "16px" },
                  ...commonStyles.borderRadius,

                  padding: { xs: "5px 40px", lg: "9px 66px" },
                  "&:hover": {
                    backgroundColor:
                      userOrBusiness === "business" ? "black" : "white",
                  },
                }}
                onClick={() => setUserOrBusiness("business")}
              >
                Business
              </Button>
              {/* </Link> */}
            </Box>
            {userOrBusiness === "business" && (
              <Box
                sx={{
                  ...commonStyles.commonTextStyles,
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                    md: "14px",
                    lg: "18px",
                    xl: "20px",
                  },

                  mt: "15px",
                  ml: { xs: "5%", sm: "0%" },
                }}
              >
                From new businesses to experienced sellers, create a business
                account to help your business grow. Collect reviews and share
                your positive feedback with new and existing clients!
              </Box>
            )}

            <Box pt={4} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
                color="initial"
                sx={{
                  color: "black",
                  ...commonStyles.commonHeadingStyles,
                  // fontSize: { xs: "20px", sm: "23px", md: "26px" },
                }}
              >
                Sign in
              </Typography>
            </Box>

            <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
                color="initial"
                sx={{
                  textTransform: "Capitalize",
                  color: " black",
                  ...commonStyles.commonTextStyles,
                }}
              >
                {userOrBusiness === "user"
                  ? "To your User Account"
                  : "To your Business Account"}
              </Typography>
            </Box>

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
              <Link
                href={"/forget-password"}
                style={{ textDecoration: "none" }}
              >
                {/* <Box ml={1} sx={{ paddingLeft: { xs: "3%", md: "0%" } }}> */}
                <Typography
                  variant="caption"
                  color="initial"
                  sx={{
                    ml: 1,
                    paddingLeft: { xs: "3%", md: "0%" },
                    color: "gray",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      color: "rgb(25, 118, 210)",
                    },
                  }}
                >
                  Forgot Password?
                </Typography>
                {/* </Box> */}
              </Link>

              <Box
                pt={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  type="submit"
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
                  onKeyDown={(e) => onSubmit(getValues, e)}
                  // disabled={Object.keys(errors).length > 0}
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Sign in"}
                </Button> */}
                <Button
                  type="submit"
                  sx={{
                    textTransform: "Capitalize",
                    color: "white",
                    bgcolor: "black",
                    fontWeight: "600",
                    fontSize: { xs: "12px", md: "16px" },
                    ...commonStyles.borderRadius,
                    ...commonStyles.disabledButton,
                    ...commonStyles.commonHover,
                    padding: { xs: "5px 55px", lg: "9px 80px" },
                    marginRight: "16px",
                  }}
                  onKeyDown={(e) => onSubmit(getValues, e)}
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Sign in"}
                </Button>
              </Box>
            </form>
            <Box
              pt={2}
              sx={{
                display: "flex",
                justifyContent: "center", // Center content horizontally
                alignItems: "center", // Center content vertically if needed
              }}
            >
              <Typography
                variant="caption"
                color="initial"
                sx={{
                  color: "black",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  marginRight: { lg: "19px" },
                }}
              >
                {`Don't have an account?`}{" "}
                <Link
                  href="/signup"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: "bold",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "rgb(25, 118, 210)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "black";
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserSignUpComponent;
