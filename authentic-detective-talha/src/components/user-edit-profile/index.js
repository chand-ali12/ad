import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MuiCustomTextField from "@/common-components/muiCustomTextField";
import { defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";
import { commonStyles } from "@/commonStyles";
import { editUserProfileSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";
import CustomErrorMessage from "@/common-commponent/error-message";
import {
  USER_UPDATE_PROFILE,
  GET_USER_PROFILE,
} from "../../../utils/api/constants";
import { UploadMediaToS3 } from "../../../utils/common-functions/uploadMedia";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { countries } from "../../../utils/countries";
import userData, { currentUserInformation } from "@/store/slice/userData";

import AdImage from "../zingImage";
import ProfilePic from "../../../public/assets/images/cover.png";
import CoverPic from "../../../public/assets/images/profile.png";
import CustomLoader from "@/common-components/custom-loader";
import CropperDemo from "@/common-commponent/cropper";
const EditUserProfile = () => {
  const router = useRouter();

  const [countryData, setCountryData] = useState({
    country: "",
    phoneCode: "",
  });
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phone, setPhoneNumber] = useState("");
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

  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const [userProfile, setUserProfile] = useState({
    email: "",
    name: "",
    country: "",
    phone: "",
    about_us: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(editUserProfileSchema),
    mode: "onChange",
  });
  const userInfo = useSelector(currentUserInformation);

  useEffect(() => {
    if (phone?.length > 0) {
      clearErrors("phone");
    }
  }, [phone, clearErrors]);

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

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${GET_USER_PROFILE}?id=${userInfo.user.id}`
      );
      // console.log("response: ", response);
      const userData = response?.data?.additional_data?.user || {};
      const selectedCountryData = countries.find(
        (country) => country.name === userData.country
      );
      setUserProfile(userData);
      setProfileImage(userData.profile_picture || "");
      setCoverImage(userData.cover_picture || "");

      if (userData.profile_picture) {
        setLocalProfileUrl(
          `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersProfile/${userData.profile_picture}`
        );
      }
      if (userData.cover_picture) {
        setLocalCoverUrl(
          `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersCover/${userData.cover_picture}`
        );
      }
      setCountryData({
        country: userData.country || "",
        phoneCode: selectedCountryData?.phoneCode || "",
      });
      setUserProfile({
        email: userData.email || "",
        name: userData.name || "",
        country: userData.country || "",
        phone: userData.phone || "",
        about_us: userData.about_us || "",
        profilePicture: userData.profile_picture || "",
        coverPicture: userData.cover_picture || "",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError(error.toString());
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileImage(userProfile.profile_picture || "");
      setCoverImage(userProfile.cover_picture || "");
      setValue("name", userProfile.name || "");
      setValue("email", userProfile.email || "");
      setValue("country", userProfile.country || "");
      setValue("about_us", userProfile.about_us || "");
      setValue("phone", userProfile.phone || "");
      // setValue("phoneCode", userData.country_code || "");
      //  setValue("phoneCode", selectedCountryData?.phoneCode || "");
    }
  }, [userProfile, setValue]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (profileImage) {
      const profileImageResponse = await UploadMediaToS3(
        profileImage,
        "usersProfile"
      );
      // console.log("Profile Image Upload Response:", profileImageResponse);
      formData.append("profile_picture", profileImageResponse);
    } else {
      formData.append("profile_picture", userProfile?.profilePicture);
    }

    if (coverImage) {
      const coverImageResponse = await UploadMediaToS3(
        coverImage,
        "usersCover"
      );

      formData.append("cover_picture", coverImageResponse);
    } else {
      formData.append("cover_picture", userProfile?.coverPicture);
    }

    formData.append("name", data?.name);
    formData.append("email", data?.email);
    formData.append("about_us", data?.about_us);
    formData.append("country", data?.country);
    formData.append("phone", data?.phone);
    formData.append("country_code", countryData.phoneCode);

    try {
      const response = await axiosInstance.post(
        `${USER_UPDATE_PROFILE}?id=${userInfo?.user?.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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
      } 
      else {
        const fileUrl = URL.createObjectURL(file);
        if (imageType === "profile") {
          setCropperSrc(fileUrl); // Temporarily set the cropper source
          setCurrentImage("profile");
          setOpenCropper(true);
        } else if (imageType === "cover") {
          setLocalCoverUrl(fileUrl);
          setCoverImage(file);
        }
      // else {
      //   if (imageType === "profile") {
      //     setLocalProfileUrl(URL.createObjectURL(file)); // Store the local URL for preview
      //     setProfileImage(file);
      //     setOpenCropper(true);
      //     setCurrentImage("profile");
      //     setCropperSrc(URL.createObjectURL(file));
      //   } 
        // else if (imageType === "cover") {
        //   setLocalCoverUrl(URL.createObjectURL(file));
        //   setCoverImage(file);
        // }
      }
    }

    e.target.value = "";
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (currentImage === "profile") {
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
    // setCrop(null);
    // setOpenCropper(false);
    setCropperSrc(null); // Clear the temporary cropper source
    setOpenCropper(false);
  };
  const handleCancel = () => {
    setCropperSrc(null); // Reset the cropper source
    setOpenCropper(false); // Close the cropper modal
  }

  return (
    <Box
      pb={3}
      sx={{
        bgcolor: "#F6F3EE",
        minHeight: { xs: "75vh", md: "92vh" },
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
            {" "}
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
                          : userProfile.cover_picture
                          ? localCoverUrl
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
                          : userProfile.profile_picture
                          ? localProfileUrl
                          : ProfilePic.src
                      }
                      alt="Profile Picture"
                      width={isMobile ? 100 : isMedium ? 170 : 175}
                      height={isMobile ? 100 : isMedium ? 170 : 175}
                      onError={() => handleImageError("profile")}
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
                      // onCancel={() => setOpenCropper(false)}
                      onCancel={handleCancel}

                    />
                  )}
                </Box>
              </Modal>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Grid
                  container
                  spacing={3}
                  sx={{ bgcolor: "#F6F3EE", marginTop: 3 }}
                >
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
                      Name
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
                        ml: 1,
                      }}
                    >
                      About
                    </Typography>
                    <TextField
                      id="about_us"
                      name="about_us"
                      {...register("about_us")}
                      fullWidth
                      placeholder="Please type here...."
                      type="text"
                      autoComplete="about_us"
                      multiline
                      rows={4}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "transparent",
                          },
                          "&:hover fieldset": {
                            borderColor: "transparent",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "transparent",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          "&:focus": {
                            outline: "none",
                          },
                        },
                      }}
                    />
                    {errors.about_us && (
                      <CustomErrorMessage
                        errorMessage={errors.about_us.message}
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
                        ml: 1,
                      }}
                    >
                      Country
                    </Typography>

                    <FormControl fullWidth variant="outlined">
                      <Select
                        fullWidth
                        id="country"
                        name="country"
                        // {...register("country", {
                        //   required: "Country is required",
                        // })}
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
                          ml: 1,
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
                          ml: 1,
                        }}
                      >
                        Phone Number
                      </Typography>
                      <TextField
                        id="phone"
                        name="phone"
                        type="text"
                        {...register("phone")}
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
                      {errors.phone && (
                        <CustomErrorMessage
                          errorMessage={errors.phone.message}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
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
                        disabled={
                          isSubmitting || Object.keys(errors).length > 0
                        }
                      >
                        {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditUserProfile;
