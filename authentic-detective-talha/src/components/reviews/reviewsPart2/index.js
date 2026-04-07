import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Rating,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";
import { UploadMediaToS3 } from "../../../../utils/common-functions/uploadMedia";
import axiosInstance from "../../../../utils/api/axios-client";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";

import { notifyError, notifySuccess } from "../../../../utils/toast";
import { GET_USER_PROFILE, SUBMIT_REVIEW } from "../../../../utils/api/constants";

export default function ShareExperience({ userInfo, getBusinessProfile, apiRole = "", refresh }) {
  console.log("APIROLE in form: ", apiRole);
  console.log("userInfo in form: ", userInfo);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const currentUserInfo = useSelector(currentUserInformation);

  const rows = isXs ? 2.5 : isLg ? 6 : 4;

  const [s3ImageName, setS3ImageName] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [userInfoCurrent, setUserInfoCurrent] = useState();
  const [reviewsData, setReviewsData] = useState();
  const [imageUUID, setImageUUID] = useState("");
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `${GET_USER_PROFILE}?id=${currentUserInfo.user.id}`
      );
      console.log("USER_PROFILE response: ", response);
      setUserInfoCurrent(response?.data?.additional_data || {});
      setReviewsData(response?.data?.data);
      // setRatingValue(response?.data?.data[0]?.rating);
    } catch (error) {
      notifyError(error.toString());
    }
    // setLoader(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageName(
        file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name
      );
    }
  };


  const clearAllFields = () => {
    // Reset form fields
    reset();
    setValue("review", "");

    // Reset states
    setRatingValue(0);
    setImage(null);
    setImageName("");
    setS3ImageName(null);

    // Reset file input if it exists
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (image) {
      if (image != imageUUID) {
        const response = await UploadMediaToS3(image, "reviewImage");
        formData.append("image", response);
      }
      else {
        formData.append("image", image);
      }
    }

    formData.append("id", userInfo?.id);
    formData.append("review", data.review);
    formData.append("rating", ratingValue);

    try {
      const response = await axiosInstance.post(SUBMIT_REVIEW, formData);
      if (response?.data?.data) {
        notifySuccess(response.data.msg);
        reset();
        setRatingValue(0);
        setValue("review", "");
        getBusinessProfile();
        getUserProfile();
      } else if (
        response?.data?.status_code === "401" ||
        response?.data?.status === false
      ) {
        notifyError(response.data.msg);
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect to the internet first.");
      } else {
        notifyError(error.toString());
      }
    }
  };

  useEffect(() => {
    console.log("REVIEWS in form: ", reviewsData)
    if (reviewsData) {
      // Loop through reviewsData and find matching business_id
      reviewsData.forEach((review, index) => {
        if (review.business_id == userInfo?.id) {
          setValue("review", review?.review || "");
          setRatingValue(review?.rating || 0); // Set the value for the form
          setImage(review?.image);
          setImageUUID(review?.image);
        }
      });
    }
  }, [reviewsData, userInfo?.id, setValue]);

  useEffect(() => {
    {
      apiRole == "user" &&
        getUserProfile();
    }
  }, []);
  useEffect(() => {
    clearAllFields();
  }, [refresh]);
  return (
    <Box
      sx={{
        mt: { xs: 2, md: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {console.log("form REVIEW userInfoCurrent: ", userInfoCurrent)}
      <Box
        sx={{
          width: { xs: "85%", sm: "59%", lg: "34%" },
          // padding: "2px",
          backgroundColor: "#fff",
          color: "black",
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        {/* Review TextField */}
        <TextField
          {...register("review", { required: "Please write a review" })}  // Validation rule
          fullWidth
          multiline
          name="review"
          rows={5}
          placeholder="Share your experience..."
          variant="outlined"
          inputProps={{ maxLength: 200 }}
          error={!!errors.review}
          helperText={errors.review?.message}
          sx={{
            width: "100%",
            mb: { xs: 3, md: 2, xl: 0 },
            // mt: "-20px", pt: "-20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              border: "none",
              color: "black",
              fontSize: {
                xs: "9px",
                sm: "14px",
                lg: "16px",
              },
              // minHeight: { xs: 100, sm: 120, md: 150 },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "black",
              opacity: 1,
              fontSize: {
                xs: "9px",
                sm: "14px",
                lg: "16px",
              },
            },
            "& fieldset": {
              border: "none",
            },
          }}
        />


        {/* Rating and Actions */}
        <Box
          sx={{

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "9px", sm: "13px", md: "16px", lg: "20px" },
                color: "#000",
              }}
            >
              {ratingValue}  {/* Only use ratingValue */}
            </Typography>

            {/* Rating Component */}
            <Rating
              value={ratingValue}
              onChange={(event, newValue) => setRatingValue(newValue)}
              sx={{
                ml: 0,
                fontSize: { xs: "12px", sm: "14px", md: "18px", lg: "20px" },
                color: "#f5a623",
              }}
            />
          </Box>

          {/* Image Upload and Send */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <IconButton
                component="span"
                sx={{ color: "#000", padding: "8px" }}
              >
                <PhotoCameraIcon
                  sx={{ fontSize: { xs: "10px", lg: "20px" } }}
                />
              </IconButton>
            </label>

            {/* Display selected image name */}
            {imageName && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  fontSize: { xs: "9px", sm: "13px", md: "16px", lg: "20px" },
                  color: "#000",
                }}
              >
                {imageName}
              </Typography>
            )}

            {/* Send button */}
            <IconButton
              sx={{ color: "#000", padding: "8px" }}
              onClick={handleSubmit(onSubmit)}
              disabled={!ratingValue || errors.review}
            >
              <SendIcon sx={{ fontSize: { xs: "10px", lg: "20px" } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
