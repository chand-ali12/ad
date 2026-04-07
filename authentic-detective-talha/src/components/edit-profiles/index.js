import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Modal,
  Select,
  Button,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  useMediaQuery,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import countries from "../../../utils/countries";
import axios from "../../../utils/api/axios-client";
import CustomLoader from "@/common-components/custom-loader";
import { defaultCountries } from "react-international-phone";
import { currentUserInformation } from "@/store/slice/userData";
import CustomErrorMessage from "@/common-commponent/error-message";
import CoverPic from "../../../public/assets/images/profile.png";
import ProfilePic from "../../../public/assets/images/cover.png";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { UploadMediaToS3 } from "../../../utils/common-functions/uploadMedia";
import {
  UPDATE_BUSINESS_PROFILE,
  GET_BUSINESS_PROFILE,
  GET_USER_PROFILE,
} from "../../../utils/api/constants";
import {
  editBusinessProfileSchema,
  editUserProfileSchema,
} from "../../../utils/validationSchemas/contactsUsValidationSchema";
import CropperDemo from "@/common-commponent/cropper";

const EditProfiles = () => {
  const userInfo = useSelector(currentUserInformation);
  const role = userInfo?.apiRole;

  const [countryData, setCountryData] = useState({
    country: "",
    phoneCode: "",
  });
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(ProfilePic.src);
  const [localProfileUrl, setLocalProfileUrl] = useState(null);
  const [localCoverUrl, setLocalCoverUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(CoverPic.src);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [cropperSrc, setCropperSrc] = useState("");
  const [openCropper, setOpenCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState();
  const [userProfiles, setUserProfiles] = useState();

  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (event) => {
    const selectedCountryName = event.target.value;
    const selectedCountryData = countries.find(
      (country) => country.name === selectedCountryName
    );

    if (selectedCountryData) {
      setCountryData({
        country: selectedCountryName,
        phoneCode: selectedCountryData.phoneCode || "",
      });

      // Update form values together
      setValue("country", selectedCountryName);
      setValue("phoneCode", selectedCountryData.phoneCode || "");
    }
  };

  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const {
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    resolver: yupResolver(
      role === "business-user"
        ? editBusinessProfileSchema
        : editUserProfileSchema
    ),
    mode: "onChange",
  });

  const coverImageType =
    role === "business-user" ? "businessCover" : "usersCover";
  const profileImageType =
    role === "business-user" ? "businessProfile" : "usersProfile";
  const coverImageEndPoint =
    role === "business-user" ? "business_cover_picture" : "cover_picture";
  const profileImageEndPoint =
    role === "business-user" ? "business_profile_picture" : "profile_picture";

  const getBusinessProfile = async () => {
    try {
      setLoading(true);
      const apiDataCall =
        role === "business-user" ? GET_BUSINESS_PROFILE : GET_USER_PROFILE;
      const response = await (role === "business-user"
        ? axios.get(`${apiDataCall}?id=${userInfo?.user?.user_business[0]?.id}`)
        : axios.get(`${apiDataCall}?id=${userInfo?.user?.id}`));

      if (response?.data) {
        const businessData = response?.data?.additional_data?.business;
        const userData = businessData?.user;

        setBusinessProfiles(businessData);
        setUserProfiles(userData);
        setProfileImage(businessData?.[profileImageEndPoint] || "");
        setCoverImage(businessData?.[coverImageEndPoint] || "");

        if (userData?.[profileImageEndPoint]) {
          setLocalProfileUrl(
            `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${profileImageType}/${userData?.[profileImageEndPoint]}`
          );
        }
        if (userData?.[coverImageEndPoint]) {
          setLocalCoverUrl(
            `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${coverImageType}/${userData?.[coverImageEndPoint]}`
          );
        }

        setBusinessProfiles({
          profilePicture: businessData?.profileImageEndPoint || "",
          coverPicture: businessData?.coverImageEndPoint || "",
        });

        if (businessData.business_country) {
          const selectedCountryData = countries.find(
            (country) => country.name === businessData.business_country
          );

          if (selectedCountryData) {
            setCountryData({
              country: businessData.business_country,
              phoneCode: selectedCountryData.phoneCode || "",
            });
          }
        }

        if (userData) {
          setEmail(userData?.email);
          setBusinessProfiles(businessData);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBusinessProfile();
  }, []);

  useEffect(() => {
    if (businessProfiles) {
      setProfileImage(businessProfiles?.business_profile_picture || "");
      setCoverImage(businessProfiles?.business_cover_picture || "");
      setValue("name", businessProfiles?.business_name || "");
      setValue("email", email || "");
      setValue("about", businessProfiles?.about_business || "");
      setValue("address", businessProfiles?.business_address || "");
      setValue("website", businessProfiles?.website || "");
      setValue("country", businessProfiles?.business_country || "");
      setValue("phoneNumber", businessProfiles?.business_phone || "");
      setValue("instagram", businessProfiles?.business_instagram || "");
      setValue("facebook", businessProfiles?.business_facebook || "");
      setValue("linkedin", businessProfiles?.business_linkedin || "");
      setValue("marketPlace", businessProfiles?.business_twitter || "");
    }
  }, [businessProfiles, setValue]);

  useEffect(() => {
    if (businessProfiles) {
      setProfileImage(businessProfiles?.business_profile_picture || "");
      setCoverImage(businessProfiles?.business_cover_picture || "");
      setValue("name", businessProfiles?.business_name || "");
      setValue("email", email || "");
      setValue("about", businessProfiles?.about_business || "");
      setValue("address", businessProfiles?.business_address || "");
      setValue("website", businessProfiles?.website || "");
      setValue("country", businessProfiles?.business_country || "");
      setValue("phoneNumber", businessProfiles?.business_phone || "");
    }
  }, [businessProfiles, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    if (!profileImage == businessProfiles?.business_profile_picture) {
      const response = await UploadMediaToS3(profileImage, "businessProfile");
      formData.append("business_profile_picture", response);
    } else {
      formData.append(
        "business_profile_picture",
        businessProfiles?.profilePicture
      );
    }

    if (!coverImage == businessProfiles?.business_cover_picture) {
      const response = await UploadMediaToS3(coverImage, "businessCover");
      formData.append("business_cover_picture", response);
    } else {
      formData.append("business_cover_picture", businessProfiles?.coverPicture);
    }
    const businessProfilesUpdate = {
      business_profile_picture: profileImage,
      business_cover_picture: coverImage,
      business_id: userInfo?.user?.user_business[0].id,
      id: userInfo?.user?.user_business[0].user_id,
      business_name: data?.name,
      email: data?.email,
      about_business: data?.about,
      business_address: data?.address,
      website: data?.website,
      business_country: data?.country,
      country_code: countryData.phoneCode,
      business_phone: data?.phoneNumber,
      business_instagram: data?.instagram,
      business_facebook: data?.facebook,
      business_linkedin: data?.linkedin,
      business_twitter: data?.marketPlace,
    };

    try {
      const response = await axios.post(
        `${UPDATE_BUSINESS_PROFILE}`,
        businessProfilesUpdate
      );
      setLoading(false);

      if (response?.data?.data) {
        notifySuccess(response.data.msg);
        router.push("/profile");
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        notifyError(response.data.msg);
      }
    } catch (error) {
      setLoading(false);

      if (error?.code === "ERR_NETWORK") {
        notifyError("please connect to the internet first");
      } else {
        notifyError(error.toString());
      }
    }
  };

  const textFieldStyles = {
    ...commonStyles.textFieldStyles,
    width: "100%",
    mb: 1,
    "& .MuiInputBase-root": {
      height: "50px",
    },
  };

  const handleImageError = (imageType) => {
    if (imageType === "profile") {
      setLocalProfileUrl(null);
      setProfileImage(ProfilePic.src);
    } else if (imageType === "cover") {
      setLocalCoverUrl(null);
      setCoverImage(CoverPic.src);
    }
  };
  const getImageSource = (localUrl, apiUrl, defaultImage) => {
    if (localUrl) return localUrl;
    if (apiUrl) return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${apiUrl}`;
    return defaultImage;
  };

  // with out cropper
  // const handleImageUpload = (e, imageType) => {
  //   const file = e.target.files[0];

  //   if (file && file.type.startsWith("image/")) {
  //     if (imageType === "profile") {
  //       setLocalProfileUrl(URL.createObjectURL(file));
  //       setProfileImage(file);
  //     } else if (imageType === "cover") {
  //       setLocalCoverUrl(URL.createObjectURL(file));
  //       setCoverImage(file);
  //     }
  //   } else {
  //     alert("Please select a valid image file.");
  //   }
  //   e.target.value = "";
  // };

  // with cropper
  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    const maxFileSize = 20 * 1024 * 1024;

    if (file) {
      if (!file.type.startsWith("image/")) {
        notifyError("Please select a valid image file.");
      } else if (file.size > maxFileSize) {
        notifyError(
          "Your file is too large! Please reduce to a maximum of 20MB and try again."
        );
      } else {
        if (imageType === "profile") {
          setLocalProfileUrl(URL.createObjectURL(file)); // Store the local URL for preview
          setProfileImage(file);
          setOpenCropper(true);
          setCurrentImage("profile");
          setCropperSrc(URL.createObjectURL(file));
        } else if (imageType === "cover") {
          setLocalCoverUrl(URL.createObjectURL(file));
          setCoverImage(file);
        }
      }
    }

    e.target.value = "";
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (currentImage === "profile") {
      // Convert blob URL to a File object
      fetch(croppedImageUrl)
        .then((r) => r.blob())
        .then((blob) => {
          const file = new File([blob], "cropped-image.jpg", {
            type: blob.type,
          });
          setProfileImage(file);
          setLocalProfileUrl(croppedImageUrl);
        });
    }
    setCrop(null);
    setOpenCropper(false);
  };

  return (
    <Box
      pb={3}
      sx={{
        bgcolor: "#F6F3EE",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Box
          mt={4}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            width: "80%",
            height: "auto",
          }}
        >
          <Typography
            sx={{
              color: "black",
              ...commonStyles.commonHeadingStyles,
              textAlign: "start",
            }}
          >
            Profile Settings
          </Typography>
        </Box>
        {loading ? (
          <Box
            sx={{
              height: "50vh",
            }}
          >
            <CustomLoader />
          </Box>
        ) : (
          <Box
            mt={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: { xs: "96%", md: "60%" },
              bgcolor: "#F6F3EE",
            }}
          >
            <Grid
              container
              spacing={{ xs: 0, sm: 1, md: 2 }}
              sx={{ bgcolor: "#F6F3EE" }}
            >
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: "1",
                    pt: { xs: "-15px", lg: "2px" },
                    height: { xs: "auto", lg: "auto" },
                    width: { xs: "100%", lg: "auto" },
                    margin: "auto",
                  }}
                >
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      width={isMobile ? 124 : isMedium ? 214 : 243}
                      height={isMobile ? 100 : isMedium ? 174 : 173}
                      animation="wave"
                    />
                  ) : (
                    <AdImage
                      src={
                        localCoverUrl
                          ? localCoverUrl
                          : businessProfiles &&
                            businessProfiles.business_cover_picture // Safely check if businessProfiles exists and use the cover picture
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessCover/${businessProfiles.business_cover_picture}` // Construct the URL
                          : CoverPic.src
                      }
                      alt="Cover Picture"
                      width={isMobile ? 124 : isMedium ? 214 : 243}
                      height={isMobile ? 100 : isMedium ? 174 : 173}
                      onError={handleImageError}
                      style={{
                        display: "block",
                        margin: "0 auto",
                        cursor: "pointer",
                      }}
                      fill={false}
                      onClick={() => coverInputRef.current.click()}
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "cover")}
                    style={{ display: "none" }}
                    ref={coverInputRef}
                  />
                  <Button
                    onClick={() => coverInputRef.current.click()}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      ...commonStyles.buttonCommonStyles,
                      fontSize: {
                        xs: "11px",
                        sm: "14px",
                        md: "16px",
                        lg: "18px",
                        xl: "20px",
                      },
                      marginTop: "25px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                    }}
                  >
                    Update Cover Photo
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: "1",
                    pt: { xs: "-15px", lg: "2px" },
                    height: { xs: "auto", lg: "auto" },
                    width: { xs: "100%", lg: "auto" },
                    margin: "auto",
                  }}
                >
                  {loading ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={isMobile ? 100 : isMedium ? 170 : 175}
                      height={isMobile ? 100 : isMedium ? 170 : 175}
                    />
                  ) : (
                    <AdImage
                      src={
                        localProfileUrl
                          ? localProfileUrl
                          : businessProfiles?.business_profile_picture
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessProfile/${businessProfiles.business_profile_picture}`
                          : ProfilePic.src
                      }
                      onError={handleImageError}
                      alt="Profile Picture"
                      width={isMobile ? 100 : isMedium ? 170 : 175}
                      height={isMobile ? 100 : isMedium ? 170 : 175}
                      style={{
                        display: "block",
                        margin: "0 auto",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      fill={false}
                      onClick={() => profileInputRef.current.click()}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                    style={{ display: "none" }}
                    ref={profileInputRef}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Button
                    onClick={() => profileInputRef.current.click()}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      ...commonStyles.buttonCommonStyles,
                      fontSize: {
                        xs: "11px",
                        sm: "14px",
                        md: "16px",
                        lg: "18px",
                        xl: "20px",
                      },
                      marginTop: "25px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                    }}
                  >
                    Update Profile Photo
                  </Button>
                </Box>
              </Grid>
              {/* <Modal
              open={openCropper}
              onClose={() => setOpenCropper(false)}
              aria-labelledby="cropper-modal"
              aria-describedby="cropper-for-image"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: "60%", sm: "80%", md: "60%" },
                  height: { xs: "60%", sm: "70%", md: "70%" },
                  maxWidth: "600px",
                  maxHeight: "700px",
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  // p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cropperSrc && (
                  <CropperDemo
                    src={cropperSrc}
                    onCropComplete={handleCropComplete}
                    crop={crop} 
                    

                  />
                )}
              </Box>
            </Modal> */}

              <Modal
                open={openCropper}
                onClose={() => setOpenCropper(false)} // Ensure closing behavior
                aria-labelledby="cropper-modal"
                aria-describedby="cropper-for-image"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "60%", md: "50%" },
                    maxWidth: "500px",
                    height: { xs: "90%", sm: "60%", md: "70%", lg: "80%" },
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "auto",
                  }}
                >
                  {cropperSrc && (
                    <CropperDemo
                      src={cropperSrc}
                      onCropComplete={handleCropComplete}
                      onCancel={() => setOpenCropper(false)}
                    />
                  )}
                </Box>
              </Modal>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Grid container spacing={3} sx={{ bgcolor: "#F6F3EE" }}>
                  <Grid item xs={12} mt={5}>
                    {" "}
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                      }}
                    >
                      Business Name
                    </Typography>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      {...register("name")}
                      InputProps={{
                        sx: { ...commonStyles.muiTextFieldINputProps },
                        disableUnderline: true,
                      }}
                      sx={textFieldStyles}
                    />
                    {errors.name && (
                      <CustomErrorMessage errorMessage={errors.name.message} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                        mt: -1,
                        ml: 1,
                      }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      disabled
                      id="email"
                      name="email"
                      {...register("email")}
                      InputProps={{
                        sx: {
                          ...commonStyles.muiTextFieldINputProps,
                          backgroundColor: "white",
                        },
                        disableUnderline: true,
                      }}
                      sx={{
                        ...textFieldStyles,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover fieldset": {
                            border: "none",
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                    {errors.email && (
                      <CustomErrorMessage errorMessage={errors.email.message} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                        mt: -1,
                      }}
                    >
                      About Your Business
                    </Typography>

                    <TextField
                      fullWidth
                      id="about"
                      name="about"
                      {...register("about")}
                      InputProps={{
                        sx: { ...commonStyles.muiTextFieldINputProps },
                        disableUnderline: true,
                      }}
                      sx={textFieldStyles}
                    />
                    {errors.about && (
                      <CustomErrorMessage errorMessage={errors.about.message} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                        mt: -1,
                      }}
                    >
                      Company Address
                    </Typography>

                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      {...register("address")}
                      InputProps={{
                        sx: { ...commonStyles.muiTextFieldINputProps },
                        disableUnderline: true,
                      }}
                      sx={textFieldStyles}
                    />
                    {errors.address && (
                      <CustomErrorMessage
                        errorMessage={errors.address.message}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                        mt: -1,
                      }}
                    >
                      Company Website
                    </Typography>

                    <TextField
                      fullWidth
                      id="website"
                      name="website"
                      {...register("website")}
                      InputProps={{
                        sx: { ...commonStyles.muiTextFieldINputProps },
                        disableUnderline: true,
                      }}
                      sx={textFieldStyles}
                    />
                    {errors.website && (
                      <CustomErrorMessage
                        errorMessage={errors.website.message}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      color="initial"
                      sx={{
                        ...commonStyles.commonTextFieldsLabelStyles,
                        textTransform: "Capitalize",
                        color: "black",
                        textDecoration: "underline",
                        mb: 1,
                        mt: -1,
                      }}
                    >
                      Country
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        fullWidth
                        id="country"
                        name="country"
                        {...register("country")}
                        label="Country"
                        InputProps={{
                          sx: {
                            ...commonStyles.muiTextFieldINputProps,
                            backgroundColor: "white",
                          },
                          disableUnderline: true,
                        }}
                        sx={{
                          ...textFieldStyles,
                          borderRadius: "23px",
                          "& .MuiSelect-select": {
                            border: "none",
                            backgroundColor: "white",
                            "&:focus": {
                              outline: "none",
                            },
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        onChange={(event) => {
                          handleCountryChange(event);
                          // clearErrors("country");
                        }}
                        value={countryData.country}
                      >
                        <MenuItem value="" disabled>
                          Select Country
                        </MenuItem>
                        {countries.map(({ code, name }) => (
                          <MenuItem key={code} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* {errors.country && (
                      <CustomErrorMessage
                        errorMessage={errors.country.message}
                      />
                    )} */}
                  </Grid>
                  <Grid item xs={12} container spacing={2}>
                    <Grid item xs={5} sm={4}>
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonTextFieldsLabelStyles,
                          textTransform: "Capitalize",
                          color: "black",

                          textDecoration: "underline",
                          mb: 1,
                          mt: -1,
                        }}
                      >
                        Country Code
                      </Typography>

                      <TextField
                        id="phoneCode"
                        name="phoneCode"
                        {...register("phoneCode")}
                        fullWidth
                        select
                        disabled
                        value={countryData.phoneCode}
                        variant="outlined"
                        placeholder="Country Code"
                        InputProps={{
                          sx: {
                            backgroundColor: "white",
                            borderRadius: "23px",
                            height: "50px",
                            fontWeight: "500",
                          },
                          disableUnderline: true,
                        }}
                        sx={{
                          mt: { xs: 1, sm: 0 },
                          ...textFieldStyles,
                          borderRadius: "23px",
                          "& .MuiSelect-select": {
                            border: "none",
                            backgroundColor: "white",
                            "&:focus": {
                              outline: "none",
                            },
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        SelectProps={{
                          renderValue: (selected) => selected,
                        }}
                      >
                        {Object.entries(defaultCountries).map(
                          ([key, value]) => (
                            <MenuItem key={key} value={`+${value[2]}`}>
                              <Box
                                sx={{
                                  display: "flex",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography>{value[0]}</Typography>
                                <Typography>{`+${value[2]}`}</Typography>
                              </Box>
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    </Grid>

                    <Grid item xs={7} sm={8}>
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonTextFieldsLabelStyles,
                          textTransform: "Capitalize",
                          color: "black",
                          textDecoration: "underline",
                          mb: 1,
                          mt: -1,
                        }}
                      >
                        Phone Number
                      </Typography>
                      <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        {...register("phoneNumber")}
                        fullWidth
                        InputProps={{
                          sx: { ...commonStyles.muiTextFieldINputProps },
                          disableUnderline: true,
                        }}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        sx={textFieldStyles}
                      />
                      {errors.phoneNumber && (
                        <CustomErrorMessage
                          errorMessage={errors.phoneNumber.message}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} container spacing={0}>
                    <Grid xs="12" mt={1}>
                      <Typography
                        color="initial"
                        sx={{
                          ...commonStyles.commonTextFieldsLabelStyles,
                          textTransform: "Capitalize",
                          color: "black",
                          textDecoration: "underline",
                          mb: 1,
                          mt: -1,
                        }}
                      >
                        Links
                      </Typography>
                    </Grid>

                    <Grid xs="12" mt={{ xs: 1, sm: 2 }}>
                      <TextField
                        id="facebook"
                        name="facebook"
                        placeholder="facebook"
                        {...register("facebook")}
                        fullWidth
                        InputProps={{
                          sx: { ...commonStyles.muiTextFieldINputProps },
                          disableUnderline: true,
                        }}
                        sx={textFieldStyles}
                      />
                      {errors.facebook && (
                        <CustomErrorMessage
                          errorMessage={errors.facebook.message}
                        />
                      )}
                    </Grid>
                    <Grid xs="12" mt={{ xs: 1, sm: 2 }}>
                      <TextField
                        id="instagram"
                        name="instagram"
                        placeholder="instagram"
                        {...register("instagram")}
                        fullWidth
                        InputProps={{
                          sx: { ...commonStyles.muiTextFieldINputProps },
                          disableUnderline: true,
                        }}
                        sx={textFieldStyles}
                      />
                      {errors.instagram && (
                        <CustomErrorMessage
                          errorMessage={errors.instagram.message}
                        />
                      )}
                    </Grid>

                    <Grid xs="12" mt={{ xs: 1, sm: 2 }}>
                      <TextField
                        id="linkedin"
                        name="linkedin"
                        placeholder="linkedin"
                        {...register("linkedin")}
                        fullWidth
                        InputProps={{
                          sx: { ...commonStyles.muiTextFieldINputProps },
                          disableUnderline: true,
                        }}
                        sx={textFieldStyles}
                      />
                      {errors.linkedin && (
                        <CustomErrorMessage
                          errorMessage={errors.linkedin.message}
                        />
                      )}
                    </Grid>

                    <Grid xs="12" mt={{ xs: 1, sm: 2 }}>
                      <TextField
                        id="marketPlace"
                        name="marketPlace"
                        placeholder="marketPlace"
                        {...register("marketPlace")}
                        fullWidth
                        InputProps={{
                          sx: { ...commonStyles.muiTextFieldINputProps },
                          disableUnderline: true,
                        }}
                        sx={textFieldStyles}
                      />
                      {errors.marketPlace && (
                        <CustomErrorMessage
                          errorMessage={errors.marketPlace.message}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  marginTop={2}
                >
                  <Button
                    type="submit"
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      fontWeight: "600",
                      fontSize: { xs: "12px", md: "16px" },
                      ...commonStyles.borderRadius,
                      padding: { xs: "4px 55px", lg: "9px 80px" },
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                      cursor: "pointer",
                    }}
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                </Box>
              </form>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditProfiles;
