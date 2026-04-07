import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AdImage from "@/components/zingImage";
import Dp from "../../../public/assets/images/cuate.png";
// import SignUp from "../../../public/signup.svg"
import SignUp from "../../../public/signup.634064b8.jpg";
import Link from "next/link";
import { commonStyles } from "@/commonStyles";
import ReCAPTCHA from "react-google-recaptcha";
import { countries } from "../../../utils/countries";
import {
  SIMPLE_USER_SIGNUP,
  BUSINESS_USER_SIGNUP,
  GET_BRANDS,
  GET_ALL_BRANDS_WITH_CATEGORIES,
} from "../../../utils/api/constants";
import axios from "../../../utils/api/axios-client";

import {
  SignUpSchema,
  SignUpBusinessSchema,
} from "../../../utils/validationSchemas/contactsUsValidationSchema";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useRouter } from "next/router";
import CustomErrorMessage from "@/common-commponent/error-message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../../../utils/api/axios-client";

const SignUpComponent = () => {
  const router = useRouter();

  const [userOrBusiness, setUserOrBusiness] = useState("user");
  const [formData, setFormData] = useState({});
  const [brandsData, setBrandsData] = useState();

  const [reCaptchaToken, setReCaptchaToken] = useState("");

  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const userNameRef = useRef(null);
  const businessNameRef = useRef(null);
  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width: 320px)");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [businessPasswordVisible, setBusinessPasswordVisible] = useState(false);
  const [confirmBusinessPasswordVisible, setConfirmBusinessPasswordVisible] =
    useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const handleRecaptcha = (value) => {
    setReCaptchaToken(value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedBrands(typeof value === "string" ? value.split(",") : value);
  };

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      brands: [],
    },
    resolver: yupResolver(
      userOrBusiness === "user" ? SignUpSchema : SignUpBusinessSchema
    ),
  });

  useEffect(() => {
    if (selectedBrands.length > 0) {
      setValue("brands", selectedBrands, { shouldValidate: true });
    }
  }, [selectedBrands, setValue]);

  // console.log("errrorfdffd", errors);
  const getBrandsData = async () => {
    try {
      const response = await axiosInstance.get(GET_ALL_BRANDS_WITH_CATEGORIES);
      // console.log("fjhudfhjfdb ", response);

      setBrandsData(response?.data?.data?.brands);
    } catch (error) {
      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBrandsData();
  }, []);

  const handleUserSubmit = async (data, e) => {
    e.preventDefault();
    const bodyData = {
      email: data?.email,
      password: data?.password,
      name: data?.username,
    };

    const businessBodyData = {
      email: data?.email,
      password: data?.password,
      name: data?.username,
      business_name: data?.businessBusiness,
      website: data?.website,
      country: data?.country,
    };

    try {
      const response = await axios.post(
        userOrBusiness === "user" ? SIMPLE_USER_SIGNUP : BUSINESS_USER_SIGNUP,
        userOrBusiness === "user" ? bodyData : businessBodyData
      );

      if (response?.data) {
        if (response?.data?.msg === "The email has already been taken.") {
          notifyError(response?.data?.msg);
        } else {
          notifySuccess(response?.data?.msg);
        }

        router.push("/login");
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        // notifyError("User already exists");
        notifyError(response?.data?.msg);
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect  internet first ");
      } else {
        notifyError(error.toString());
      }
    }
  };
  const handleBusinessSubmit = async (data, e) => {
    e.preventDefault();
    const bodyData = {
      email: data?.email,
      password: data?.password,
      name: data?.username,
    };

    const businessBodyData = {
      email: data?.businessEmail,
      password: data?.businessPassword,
      name: data?.businessUsername,
      business_name: data?.businessBusiness,
      business_brands: selectedBrands.join(","),
      website: data?.website,
      country: data?.country,
    };

    try {
      const response = await axios.post(
        userOrBusiness === "user" ? SIMPLE_USER_SIGNUP : BUSINESS_USER_SIGNUP,
        userOrBusiness === "user" ? bodyData : businessBodyData
      );

      if (response?.data) {
        notifySuccess(response?.data?.msg);

        router.push("/login");
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        notifyError("User already exists");
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect  internet first ");
      } else {
        notifyError(error.toString());
      }
    }
  };

  useEffect(() => {
    setFormData({});
    reset();
  }, [userOrBusiness]);

  // Set focus on the first input field when the form type changes
  useEffect(() => {
    if (userOrBusiness === "user") {
      userNameRef.current?.focus();
    } else if (userOrBusiness === "business") {
      businessNameRef.current?.focus();
    }
    console.log("form Tpye Changes", userOrBusiness);
  }, [userOrBusiness]);

  useEffect(() => {
    const adjustRecaptcha = () => {
      const recaptchaWrapper = document.querySelector(".captcha");
      if (recaptchaWrapper && recaptchaLoaded) {
        const screenWidth = window.innerWidth;
        let marginLeft;

        if (screenWidth <= 320) {
          marginLeft = "0%";
        } else if (screenWidth <= 375) {
          marginLeft = "2%";
        } else if (screenWidth <= 390) {
          marginLeft = "2%";
        } else if (screenWidth <= 414) {
          marginLeft = "6%";
        } else if (screenWidth <= 768) {
          marginLeft = "6%";
        } else if (screenWidth <= 1024) {
          marginLeft = "2%";
        } else {
          marginLeft = "1%";
        }

        recaptchaWrapper.style.marginLeft = marginLeft;
      }
    };

    adjustRecaptcha();
    window.addEventListener("resize", adjustRecaptcha);

    return () => {
      window.removeEventListener("resize", adjustRecaptcha);
    };
  }, [recaptchaLoaded]);

  console.log("errors", errors);
  const marginTopValue = userOrBusiness === "business" ? "-46%" : "-210px";

  return (
    <Box>
      <Box pb={14} sx={{ bgcolor: "#f6f3ee", width: "100%" }}>
        <Grid
          container
          spacing={2}
          pt={{ xs: 2, sm: 5, md: 10 }}
          pr={{ xs: 2.5 }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: { xs: "16px", sm: "0px" },
              marginTop: {
                xs: "0px",
                sm: "0px",
                md: "0px",
                lg: marginTopValue,
              },
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
                width: { xs: "100%", sm: "80%", md: "90%", lg: "80%" },
                height: { xs: "85%", sm: "80%", md: "auto", lg: "80%" },
              }}
            >
              <AdImage
                src={SignUp}
                alt="book a call"
                style={{
                  width: isMobile ? "100%" : "100%",
                  height: isMobile ? "100%" : "100%",
                  objectFit: "contain",
                }}
                fill={false}
                layout="default"
              />
            </Box>
          </Grid>
          <Grid pb={1} item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              <Button
                sx={{
                  color: userOrBusiness === "user" ? "white" : "black",
                  bgcolor: userOrBusiness === "user" ? "black" : "white",
                  fontWeight: "600",
                  ...commonStyles.buttonCommonStyles,
                  padding: { xs: "4px 55px", lg: "9px 80px" },
                  "&:hover": {
                    backgroundColor:
                      userOrBusiness === "user" ? "black" : "white",
                  },
                  cursor: "pointer",
                }}
                onClick={() => {
                  setUserOrBusiness("user");
                  reset();
                }}
              >
                User
              </Button>

              <Button
                variant="contained"
                sx={{
                  // textTransform: "Capitalize",
                  color: userOrBusiness === "business" ? "white" : "black",
                  bgcolor: userOrBusiness === "business" ? "black" : "white",
                  marginLeft: "14px",
                  fontWeight: "600",
                  ...commonStyles.buttonCommonStyles,

                  padding: { xs: "5px 40px", lg: "9px 66px" },
                  "&:hover": {
                    backgroundColor:
                      userOrBusiness === "business" ? "black" : "white",
                  },
                }}
                onClick={() => {
                  setUserOrBusiness("business");
                  reset();
                }}
              >
                Business
              </Button>
            </Box>
            <Box pt={4} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
                sx={{
                  color: "black",
                  ...commonStyles.commonHeadingStyles,
                }}
              >
                Sign up
              </Typography>
            </Box>
            <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
              <Typography
                sx={{
                  textTransform: "none",
                  color: " black",
                  ...commonStyles.commonTextStyles,
                }}
              >
                {userOrBusiness === "user"
                  ? "for a User account"
                  : "for a business account"}
              </Typography>
            </Box>

            {userOrBusiness === "user" ? (
              <form onSubmit={handleSubmit(handleUserSubmit)}>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    {...register("username")}
                    id="username"
                    name="username"
                    type="text"
                    margin="normal"
                    fullWidth
                    // label="Your Name"
                    placeholder="Your Name"
                    autoComplete="name"
                    autoFocus
                    inputRef={userNameRef}
                  />
                  {errors.username && (
                    <CustomErrorMessage
                      errorMessage={errors.username.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
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
                    // label="Email Address"
                    placeholder="Email Address"
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <CustomErrorMessage errorMessage={errors.email.message} />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
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
                  />
                  {errors.password && (
                    <CustomErrorMessage
                      errorMessage={errors.password.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    margin="normal"
                    fullWidth
                    placeholder="Confirm Password"
                    // label="Confirm Password"
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
                <Box pt={3} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Grid container spacing={1} alignItems="baseline">
                    <Grid item>
                      <Checkbox
                        {...register("terms")}
                        sx={{
                          paddingRight: "0px",
                          marginTop: "0px",
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography
                        id="term"
                        name="term"
                        variant="caption"
                        sx={{
                          fontSize: "12px",
                          color: "black",
                          ...commonStyles.applyFontFamily,
                          underline: "none",
                        }}
                      >
                        By Signing Up, you accept the{" "}
                        <Link
                          href="/terms-of-service"
                          color="#1976d2"
                          style={{ cursor: "pointer", textDecoration: "none" }}
                        >
                          <span style={{ color: "#1976d2", cursor: "pointer" }}>
                            Terms of Service
                          </span>{" "}
                        </Link>
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          underline="none"
                          color="#1976d2"
                          style={{ cursor: "pointer", textDecoration: "none" }}
                        >
                          <span style={{ color: "#1976d2", cursor: "pointer" }}>
                            Privacy Policy
                          </span>
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                  {errors.terms && (
                    <CustomErrorMessage errorMessage={errors.terms.message} />
                  )}
                </Box>

                <Box
                  className="captcha"
                  mt={5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: "100%",
                    transition: "margin-left 0.3s ease",
                  }}
                >
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                    asyncScriptOnLoad={() => {
                      setRecaptchaLoaded(true);
                    }}
                    onChange={handleRecaptcha}
                  />
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
                    type="submit"
                    sx={{
                      ...commonStyles.buttonCommonStyles,
                      ...commonStyles.disabledButton,
                      color: "white",
                      bgcolor: "black",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "black ",
                      },
                      cursor: "pointer",
                    }}
                    onKeyDown={(e) => onSubmit(getValues, e)}
                    // disabled={}
                    disabled={
                      isSubmitting ||
                      !reCaptchaToken ||
                      Object.keys(errors).length > 0
                    }
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Create free account"
                    )}
                  </Button>
                </Box>
                <Box
                  pt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "black",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "14px",
                    }}
                  >
                    {`Already have an account?`}
                    <Link
                      href="/login"
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontFamily: "var(--font-montserrat)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "rgb(25, 118, 210)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      <b> Sign In</b>
                    </Link>
                  </Typography>
                </Box>
              </form>
            ) : (
              <form onSubmit={handleSubmit(handleBusinessSubmit)}>
                {/* Form Fields */}
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    {...register("businessUsername")}
                    id="businessUsername"
                    name="businessUsername"
                    type="text"
                    margin="normal"
                    fullWidth
                    placeholder="Your Name"
                    // label="Your Name"
                    autoComplete="name"
                    autoFocus
                    inputRef={businessNameRef}
                  />
                  {errors.businessUsername && (
                    <CustomErrorMessage
                      errorMessage={errors.businessUsername.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    {...register("businessEmail")}
                    name="businessEmail"
                    id="businessEmail"
                    type="businessEmail"
                    margin="normal"
                    fullWidth
                    placeholder="Email Address"
                    // label="Email Address"
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.businessEmail && (
                    <CustomErrorMessage
                      errorMessage={errors.businessEmail.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    {...register("businessPassword")}
                    name="businessPassword"
                    id="businessPassword"
                    type={businessPasswordVisible ? "text" : "password"}
                    margin="normal"
                    fullWidth
                    // label="Password"
                    placeholder="Password"
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setBusinessPasswordVisible(
                                !businessPasswordVisible
                              )
                            }
                            edge="end"
                          >
                            {businessPasswordVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChangeCapture={(e) => {
                      const trimmedValue = e.currentTarget.value
                        ?.trimStart()
                        ?.trimEnd()
                        ?.replace(/ +(?= )/g, "");

                      if (trimmedValue !== undefined) {
                        setValue("password", trimmedValue);
                      }
                    }}
                  />
                  {errors.businessPassword && (
                    <CustomErrorMessage
                      errorMessage={errors.businessPassword.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    {...register("businessConfirmPassword")}
                    id="businessConfirmPassword"
                    name="businessConfirmPassword"
                    type={confirmBusinessPasswordVisible ? "text" : "password"}
                    margin="normal"
                    fullWidth
                    placeholder="Confirm Password"
                    // label="Confirm Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setConfirmBusinessPasswordVisible(
                                !confirmBusinessPasswordVisible
                              )
                            }
                            edge="end"
                          >
                            {confirmBusinessPasswordVisible ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.businessConfirmPassword && (
                    <CustomErrorMessage
                      errorMessage={errors.businessConfirmPassword.message}
                    />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,

                      color: " black",
                      mb: 2,
                    }}
                  >
                    Country
                  </Typography>
                  <FormControl fullWidth>
                    {/* <InputLabel id="country-label">Country</InputLabel> */}
                    <Select
                      labelId="country-label"
                      id="country"
                      name="country"
                      {...register("country")}
                      defaultValue=""
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Country
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.country && (
                    <CustomErrorMessage errorMessage={errors.country.message} />
                  )}
                </Box>
                <Box
                  pt={2}
                  sx={{
                    paddingLeft: { xs: "5%", md: "0%" },
                    marginLeft: "0% !important",
                  }}
                >
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,

                      color: " black",
                      mb: 2,
                    }}
                  >
                    Brands
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      labelId="brands-label"
                      id="brands"
                      name="brands"
                      {...register("brands")}
                      displayEmpty
                      multiple={true}
                      value={selectedBrands}
                      onChange={handleChange}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: 200, sm: 300 },
                            width: { xs: "80%", sm: "300px" },
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return "Brands";
                        }
                        return brandsData
                          ?.filter((brand) => selected.includes(brand.brand))
                          .map((brand) => brand.brand)
                          .join(", ");
                      }}
                    >
                      {brandsData?.map((brands) => (
                        <MenuItem key={brands.brand} value={brands.brand}>
                          <Checkbox
                            checked={selectedBrands.includes(brands.brand)}
                          />
                          {brands.brand}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.brands && (
                    <CustomErrorMessage errorMessage={errors.brands.message} />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Website
                  </Typography>
                  <TextField
                    {...register("website")}
                    id="website"
                    name="website"
                    type="url"
                    margin="normal"
                    fullWidth
                    // label="Website"
                    placeholder="Website"
                    autoFocus
                  />
                  {errors.website && (
                    <CustomErrorMessage errorMessage={errors.website.message} />
                  )}
                </Box>
                <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextFieldsLabelStyles,
                      color: " black",
                    }}
                  >
                    Business Name
                  </Typography>
                  <TextField
                    {...register("businessBusiness")}
                    id="businessBusiness"
                    name="businessBusiness"
                    type="text"
                    margin="normal"
                    fullWidth
                    placeholder="Business Name"
                    // label="Business Name"
                    autoComplete="business"
                    autoFocus
                  />

                  {errors.businessBusiness && (
                    <CustomErrorMessage
                      errorMessage={errors.businessBusiness.message}
                    />
                  )}
                </Box>{" "}
                <Box pt={3} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Grid container spacing={1} alignItems="baseline">
                    <Grid item>
                      <Checkbox
                        {...register("businessTerms")}
                        sx={{
                          paddingRight: "0px",
                          marginTop: "0px",
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography
                        id="businessTerms"
                        name="businessTerms"
                        variant="caption"
                        sx={{
                          fontSize: "12px",
                          color: "black",
                          ...commonStyles.applyFontFamily,
                          underline: "none",
                        }}
                      >
                        By Signing Up, you accept the{" "}
                        <Link
                          href="/terms-of-service"
                          underline="none"
                          color="#1976d2"
                          style={{ cursor: "pointer", textDecoration: "none" }}
                        >
                          <span style={{ color: "#1976d2", cursor: "pointer" }}>
                            Terms of Service
                          </span>{" "}
                        </Link>
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          underline="none"
                          color="#1976d2"
                          style={{ cursor: "pointer", textDecoration: "none" }}
                        >
                          <span style={{ color: "#1976d2", cursor: "pointer" }}>
                            Privacy Policy
                          </span>
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                  {errors.businessTerms && (
                    <CustomErrorMessage
                      errorMessage={errors.businessTerms.message}
                    />
                  )}
                </Box>
                <Box
                  className="captcha"
                  mt={5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: "100%",
                    transition: "margin-left 0.3s ease",
                  }}
                >
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                    asyncScriptOnLoad={() => {
                      setRecaptchaLoaded(true);
                    }}
                    onChange={handleRecaptcha}
                  />
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
                    type="submit"
                    id="businessButton"
                    sx={{
                      ...commonStyles.buttonCommonStyles,
                      ...commonStyles.disabledButton,
                      color: "white",
                      bgcolor: "black",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "black ",
                      },
                      cursor: "pointer",
                    }}
                    // onKeyDown={(e) => onSubmit(getValues, e)}
                    disabled={
                      isSubmitting ||
                      !reCaptchaToken ||
                      Object.keys(errors).length > 0
                    }
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Create free account"
                    )}
                  </Button>
                </Box>
                <Box
                  pt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "black",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: { xs: "12px", md: "14px" },
                      underline: "none",
                    }}
                  >
                    {`Already have an account?`}
                    <Link
                      href="/login"
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontFamily: "var(--font-montserrat)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "rgb(25, 118, 210)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      <b> Sign In</b>
                    </Link>
                  </Typography>
                </Box>
              </form>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUpComponent;
