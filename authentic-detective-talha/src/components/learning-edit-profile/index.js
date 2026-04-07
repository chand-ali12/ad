import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Modal,
  Select,
  Button,
  Skeleton,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  useMediaQuery,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import countries from "../../../utils/countries";
import axios from "../../../utils/api/axios-client";
import CropperDemo from "@/common-commponent/cropper";
import CustomLoader from "@/common-components/custom-loader";
import { defaultCountries } from "react-international-phone";
import { currentUserInformation } from "@/store/slice/userData";
import ProfilePic from "../../../public/assets/images/cover.png";
import CoverPic from "../../../public/assets/images/profile.png";
import { notifyError, notifySuccess } from "../../../utils/toast";
import CustomErrorMessage from "@/common-commponent/error-message";
import { UploadMediaToS3 } from "../../../utils/common-functions/uploadMedia";
import {
  UPDATE_BUSINESS_PROFILE,
  GET_BUSINESS_PROFILE,
  GET_USER_PROFILE,
  USER_UPDATE_PROFILE,
  GET_ALL_BRANDS_WITH_CATEGORIES,
} from "../../../utils/api/constants";
import {
  editBusinessProfileSchema,
  editUserProfileSchema,
} from "../../../utils/validationSchemas/contactsUsValidationSchema";
import { persistUserData } from "@/store/slice/userData";

const Learning = () => {
  const userInfo = useSelector(currentUserInformation);
  const role = userInfo?.apiRole;

  const [countryData, setCountryData] = useState({
    country: "",
    phoneCode: "",
  });

  const dispatch = useDispatch();

  const router = useRouter();
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brandsData, setBrandsData] = useState();
  const [cropperSrc, setCropperSrc] = useState("");
  const [profileData, setProfileData] = useState();
  const [openCropper, setOpenCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [localCoverUrl, setLocalCoverUrl] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [coverImage, setCoverImage] = useState(CoverPic.src);
  const [localProfileUrl, setLocalProfileUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(ProfilePic.src);
  const [profilePictureFileState, setprofilePictureFileState] = useState();
  const [coverPictureFileState, setcoverPictureFileState] = useState();

  const handleCountryChange = (event) => {
    const selectedCountryName = event.target.value;
    const selectedCountryData = countries.find(
      (country) => country.code === selectedCountryName
    );

    if (selectedCountryData) {
      setCountryData({
        country: selectedCountryName,
        phoneCode: selectedCountryData.phoneCode || "",
      });

      setValue("country", selectedCountryName);
      setValue("phoneCode", selectedCountryData.phoneCode || "");
    }
  };

  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedBrands(typeof value === "string" ? value.split(",") : value);
  };

  const {
    setValue,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      role === "business-user"
        ? editBusinessProfileSchema
        : editUserProfileSchema
    ),
    mode: "onChange",
    defaultValues: {
      brands: [],
    },
  });

  console.log("getValues", getValues());

  useEffect(() => {
    if (selectedBrands?.length > 0) {
      setValue("brands", selectedBrands, { shouldValidate: true });
    }
  }, [selectedBrands, setValue]);

  const getBrandsData = async () => {
    try {
      const response = await axios.get(GET_ALL_BRANDS_WITH_CATEGORIES);
      // console.log("fjhudfhjfdb ", response);

      setBrandsData(response?.data?.data?.brands);
    } catch (error) {
      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBrandsData();
  }, []);

  const coverImageType =
    role === "business-user" ? "businessCover" : "usersCover";
  const profileImageType =
    role === "business-user" ? "businessProfile" : "usersProfile";
  const coverImageEndPoint =
    role === "business-user" ? "business_cover_picture" : "cover_picture";
  const profileImageEndPoint =
    role === "business-user" ? "business_profile_picture" : "profile_picture";

  const getProfile = async () => {
    try {
      setLoading(true);

      const apiEndpoint =
        role === "business-user" ? GET_BUSINESS_PROFILE : GET_USER_PROFILE;
      const userId =
        role === "business-user"
          ? userInfo?.user?.user_business?.[0]?.id
          : userInfo?.user?.id;

      const response = await axios.get(`${apiEndpoint}?id=${userId}`);

      const data =
        role === "business-user"
          ? response?.data?.additional_data?.business
          : response?.data?.additional_data?.user;

      setProfileData(data);
      setProfileImage(data.profileImageEndPoint || "");
      setCoverImage(data.coverImageEndPoint || "");

      if (data?.[profileImageEndPoint]) {
        setLocalProfileUrl(
          `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${profileImageType}/${data?.[profileImageEndPoint]}`
        );
      }
      if (data?.[coverImageEndPoint]) {
        setLocalCoverUrl(
          `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${coverImageType}/${data?.[coverImageEndPoint]}`
        );
      }

      const selectedCountryName =
        role === "business-user" ? data.business_country : data.country;
      if (selectedCountryName) {
        const selectedCountryData = countries.find(
          (country) =>
            country.code === selectedCountryName ||
            country.name === selectedCountryName
        );

        if (selectedCountryData) {
          setCountryData({
            country: selectedCountryData.code,
            phoneCode: selectedCountryData.phoneCode || "",
          });
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError(error.message || "Failed to fetch profile data.");
    }
  };

  useEffect(() => {
    if (role) {
      getProfile();
    }
  }, []);

  // useEffect(() => {

  //   if(profileData  && brandsData) {

  //   }

  // }, [profileData , brandsData])

  useEffect(() => {
    if (role === "business-user" && profileData && brandsData) {
      function hasNumbers(arr) {
        if (!Array.isArray(arr)) return false;

        return arr.some((item) => {
          if (typeof item === "number" && !Number.isNaN(item)) {
            return true;
          }
          if (typeof item === "string") {
            const trimmed = item.trim();
            if (trimmed === "") {
              return false;
            }
            const num = Number(trimmed);
            return !Number.isNaN(num);
          }
          return false;
        });
      }

      const filterSelectedBrands = (value) => {
        const idArray = Array.isArray(value) ? value : [value];
        const normalizedIds = idArray
          .filter((v) => v != null)
          .map((v) => String(v).trim());

        return (
          brandsData?.filter((brand) => {
            if (brand.id == null) return false;
            const brandIdStr = String(brand.id).trim();
            return normalizedIds.includes(brandIdStr);
          }) ?? []
        );
      };

      setProfileImage(profileData?.business_profile_picture || "");
      setCoverImage(profileData?.business_cover_picture || "");
      setValue("name", profileData?.business_name || "");
      setValue("email", userInfo?.user?.email || "");
      setValue("about", profileData?.about_business || "");
      setValue("address", profileData?.business_address || "");
      setValue("website", profileData?.website || "");
      setValue("country", profileData?.business_country || "");
      console.log(
        "hasNumbers(profileData?.business_brands)",
        profileData?.business_brands?.split(",")
      );

      if (hasNumbers(profileData?.business_brands?.split(","))) {
        const filteredBrands = filterSelectedBrands(
          profileData?.business_brands?.split(",")
        );
        const filteredBrandsNames = filteredBrands?.map((item) => item?.brand);
        console.log("filteredBrandsNames", filteredBrandsNames);

        setValue("brands", filteredBrandsNames || []);
        setSelectedBrands(
          profileData?.business_brands ? filteredBrandsNames : []
        );
      } else {
        setValue("brands", profileData?.business_brands?.split(",") || []);
        setSelectedBrands(
          profileData?.business_brands
            ? profileData?.business_brands?.split(",")
            : []
        );
      }

      // const selectedCountryData = countries.find(
      //   (country) =>
      //     country.code === profileData?.business_country ||
      //     country.name === profileData?.business_country
      // );
      // setCountryData({
      //   country: profileData?.business_country,
      //   phoneCode: selectedCountryData?.phoneCode || "",
      // });
      setValue("phoneNumber", profileData?.business_phone || "");
      setValue("instagram", profileData?.business_instagram || "");
      setValue("facebook", profileData?.business_facebook || "");
      setValue("linkedin", profileData?.business_linkedin || "");
      setValue("marketPlace", profileData?.business_twitter || "");
    } else if (profileData) {
      setProfileImage(profileData?.profile_picture || "");
      setCoverImage(profileData?.cover_picture || "");
      setValue("name", profileData?.name || "");
      setValue("email", profileData?.email || "");
      setValue("country", profileData?.country || "");
      // if (profileData?.country) {
      //   const selectedCountryData = countries.find(
      //     (country) =>
      //       country.code === profileData?.business_country ||
      //       country.name === profileData?.business_country
      //   );

      //   setCountryData({
      //     country: profileData?.business_country,
      //     phoneCode: selectedCountryData?.phoneCode || "",
      //   });
      // }
      setValue("about_us", profileData?.about_us || "");
      setValue("phoneNumber", profileData?.phone || "");
    }
  }, [profileData, role, setValue, brandsData]);

  const onSubmit = async (data) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setLoading(true);
    console.log("Form data", data);

    const formData = new FormData();

    let profileImageUUID;
    if (profilePictureFileState) {
      const response = await UploadMediaToS3(profileImage, profileImageType);
      profileImageUUID = response;
      formData.append(profileImageEndPoint, response);
    } else {
      formData.append(profileImageEndPoint, profileData?.profilePicture);
    }

    if (coverPictureFileState) {
      const response = await UploadMediaToS3(coverImage, coverImageType);
      formData.append("coverImageEndPoint", response);
    } else {
      formData.append("coverImageEndPoint", profileData?.coverPicture);
    }

    const profileUpdateData =
      role === "business-user"
        ? {
            business_profile_picture: profileImage,
            business_cover_picture: coverImage,
            business_id: userInfo?.user?.user_business?.[0]?.id,
            id: userInfo?.user?.user_business?.[0]?.user_id,
            business_name: data?.name,
            email: data?.email,
            about_business: data?.about,
            business_address: data?.address,
            website: data?.website,
            business_country: data?.country,
            country_code: countryData.phoneCode,
            business_brands: selectedBrands.join(","),

            business_phone: data?.phoneNumber,
            business_instagram: data?.instagram,
            business_facebook: data?.facebook,
            business_linkedin: data?.linkedin,
            business_twitter: data?.marketPlace,
          }
        : {
            profile_picture: profileImage,
            cover_picture: coverImage,
            id: userInfo?.user?.id,
            name: data?.name,
            email: data?.email,
            about_us: data?.about_us,
            country: data?.country,
            country_code: countryData.phoneCode,
            phone: data?.phoneNumber,
          };

    try {
      const updateApiCall =
        role == "business-user" ? UPDATE_BUSINESS_PROFILE : USER_UPDATE_PROFILE;
      const response = await axios.post(updateApiCall, profileUpdateData);

      setLoading(false);

      if (response?.data?.data) {
        notifySuccess(response.data.msg);

        if (profileImageUUID) {
          const userObject = {
            ...userInfo,
            user: {
              ...userInfo.user,
              user_business: userInfo.user.user_business
                ? [...userInfo.user.user_business]
                : [],
            },
          };

          const apiRole = {
            apiRole: role === "business-user" ? "business-user" : "user",
          };

          if (role === "user") {
            userObject.user = {
              ...userObject.user,
              profile_picture: profileImageUUID,
            };
          } else if (role === "business-user") {
            userObject.user.user_business[0] = {
              ...userObject.user.user_business[0],
              business_profile_picture: profileImageUUID,
            };
          }

          // Dispatch the updated userObject
          dispatch(persistUserData({ ...userObject, ...apiRole }));
        }

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
        const fileUrl = URL.createObjectURL(file);
        if (imageType === "profile") {
          setprofilePictureFileState(file);
          setCropperSrc(fileUrl); // Temporarily set the cropper source
          setCurrentImage("profile");
          setOpenCropper(true);
        } else if (imageType === "cover") {
          setLocalCoverUrl(fileUrl);
          setCoverImage(file);
          setcoverPictureFileState(file);
        }
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
    setCropperSrc(null); // Clear the temporary cropper source
    setOpenCropper(false);
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
              height: "80vh",
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
                          : profileData && profileData.coverImageEndPoint
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${coverImageType}/${profileData.coverImageEndPoint}`
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
                          : profileData?.profileImageEndPoint
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/${profileImageType}/${profileData.profileImageEndPoint}`
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

              <Modal
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
                        ml: 1,
                      }}
                    >
                      {role === "business-user" ? "Business Name" : "Name"}
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
                  {role === "business-user" ? (
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
                        <CustomErrorMessage
                          errorMessage={errors.about.message}
                        />
                      )}
                    </Grid>
                  ) : (
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
                  )}

                  {role === "business-user" ? (
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
                  ) : null}

                  {role === "business-user" ? (
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
                  ) : null}
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
                        }}
                        value={countryData.country}
                      >
                        <MenuItem value="" disabled>
                          Select Country
                        </MenuItem>
                        {countries.map(({ code, name }) => (
                          <MenuItem key={code} value={code}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {role === "business-user" && (
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
                          renderValue={(selected) => {
                            if (selected?.length === 0) {
                              return "Brands";
                            }
                            return brandsData
                              ?.filter((brand) =>
                                selected?.includes(brand.brand)
                              )
                              .map((brand) => brand.brand)
                              .join(", ");
                          }}
                        >
                          {brandsData?.map((brands) => (
                            <MenuItem key={brands.brand} value={brands?.brand}>
                              <Checkbox
                                checked={selectedBrands?.includes(
                                  brands?.brand
                                )}
                              />
                              {brands.brand}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors.brands && (
                        <CustomErrorMessage
                          errorMessage={errors.brands.message}
                        />
                      )}
                    </Grid>
                  )}

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
                  {role === "business-user" ? (
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
                            ml: 1,
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
                  ) : null}
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
                      // "&:hover": {
                      //   backgroundColor: "black",
                      //   color: "white",
                      // },
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        // Only apply hover effect when button is not disabled
                        "&:not(:disabled)": {
                          backgroundColor: "#000", // or any color you want for hover
                        },
                      },
                      "&:disabled": {
                        backgroundColor: "gray", // or your desired disabled color
                        cursor: "not-allowed",
                        opacity: 0.7,
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

export default Learning;
