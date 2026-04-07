import React, { useRef, useState, useEffect } from "react";
import Layout from "@/components/layout";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Paper,
  Modal,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Image from "next/image";
import { commonStyles } from "@/commonStyles";
import { notifyError, notifySuccess } from "../../utils/toast";
import { UploadMediaToS3 } from "../../utils/common-functions/uploadMedia";
import requestMoreImagesPic from "../../public/assets/images/cuate.png";
import ImageGrid from "@/common-components/display-images";
import TickAnimation from "@/common-commponent/animations";
import CustomErrorMessage from "@/common-commponent/error-message";
import axiosInstance from "../../utils/api/axios-client";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import {
  REQUEST_MORE_IMAGES_DETAILS,
  SUBMIT_REQUEST_MORE_IMAGES,
} from "../../utils/api/constants";
import { useRouter } from "next/router";

const RequestMoreImages = () => {
  const [uploadingModalOpen, setUploadingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [loader, setLoader] = useState();
  const [extractedPart, setExtractedPart] = useState("");
  const router = useRouter();

  const fileInputRef = useRef(null);

  const [requestDetailsData, setRequestDetailsData] = useState();
  const [requestId, setRequestId] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const getRequestDetails = async () => {
      try {
        setLoader(true);

        const response = await axiosInstance.get(
          `${REQUEST_MORE_IMAGES_DETAILS}/${extractedPart}`
        );
        if (response?.data?.data) {
          setRequestDetailsData(response?.data?.data);
        } else {
          notifyError(response?.data?.msg);
          if (response?.data?.status_code === 201) {
            router.push("/");
          }
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);
        if (error?.code === "ERR_NETWORK") {
          notifyError("Please connect to the internet first.");
        } else {
          notifyError(error.toString());
        }
      } finally {
        setLoader(false);
      }
    };
    if (extractedPart) {
      getRequestDetails();
    }
  }, [extractedPart]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (router.isReady) {
      const { query_id } = router.query;
      const { request_id } = router.query;

      if (query_id) {
        setExtractedPart(query_id);
        setRequestId(request_id);
      }
    }
  }, [router.isReady, router.query]);

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // if (images.every((file) => file.size <= 10 * 1024 * 1024)) {
    //   clearErrors("image");
    // }
  };

  const handleCloseForLoader = () => {
    // setLoader(false);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    // if (files.length > validFiles.length) {s
    //   notifyError(
    //     `Your file is too large! Please reduce to a maximum of 20MB and try again.`
    //   );
    // }
    // if (validFiles.length === 0) {
    //   e.target.value = "";s
    //   return;
    // }
    const newImages = validFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    });
    setUploadingModalOpen(true);
    Promise.all(newImages).then((loadedImages) => {
      const uploadPromises = validFiles.map((file) =>
        UploadMediaToS3(file, "authenticateImage")
      );
      Promise.all(uploadPromises)
        .then((results) => {
          const validResults = results.filter((result) => result !== undefined);
          if (validResults.length > 0) {
            setImages((prevImages) => [...validResults, ...prevImages]);
            setSuccessModalOpen(true);
            setTimeout(() => {
              setSuccessModalOpen(false);
            }, 1000);
          }
          setUploadingModalOpen(false);
        })
        .catch((error) => {
          // console.error("Error uploading images:", error);
        });
    });
    setImageError(false);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      setImageError(true);
      return;
    }
    setLoader(true);

    setImageError(false);

    const bodyData = {
      uploadedImages: images?.join(","),
      queryId: extractedPart,
      request_id: requestId,
      // coa_number: coa_number,
    };

    try {
      const response = await axiosInstance.post(
        `${SUBMIT_REQUEST_MORE_IMAGES}`,
        bodyData
      );

      if (response.data.status_code === 200) {
        notifySuccess(response.data.msg);

        router.push("/");
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

    setLoader(false);
  };

  console.log("imagesimages", images);

  return (
    <Layout>
      <Box
        sx={{
          pl: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
          pr: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            maxWidth: "xl",
            margin: "0 auto",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                sx={{ ...commonStyles.commonLightHeadingStyles, mb: 4 }}
              >
                Looks like we need more photos to authenticate your item
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1, ...commonStyles.commonTextStyles }}>
                  Brand:{" "}
                  <Typography
                    component={"span"}
                    sx={{
                      ...commonStyles.commonTextStyles,
                      fontWeight: "600",
                    }}
                  >
                    {requestDetailsData?.query_detail?.brand}
                  </Typography>
                </Typography>

                <Typography sx={{ mb: 3, ...commonStyles.commonTextStyles }}>
                  Model:{" "}
                  <Typography
                    component={"span"}
                    sx={{
                      ...commonStyles.commonTextStyles,
                      fontWeight: "600",
                    }}
                  >
                    {requestDetailsData?.query_detail?.model}
                  </Typography>
                </Typography>
              </Box>

              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  mb: 2,
                }}
              >
                Requested photos:
              </Typography>
              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  mb: 2,
                  fontWeight: "600",
                }}
              >
                {requestDetailsData?.request_images_detail?.attributes
                  ? JSON.parse(
                      requestDetailsData.request_images_detail.attributes
                    ).join(", ")
                  : "No attributes available"}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Paper
                  onClick={handleImageClick}
                  sx={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #ccc",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  <IconButton color="primary" aria-label="upload photo">
                    <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Paper>
                {imageError && (
                  <CustomErrorMessage errorMessage="Please select at least one image" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="file-input"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Box>
              {/* <Grid container spacing={0}>
                <Grid item xs={12} sm={12}> */}
              <Box sx={{ ml: -2, mb: 1 }}>
                <ImageGrid
                  displayImages={images}
                  handleRemoveImage={handleRemoveImage}
                />
              </Box>
              {/* </Grid>
              </Grid> */}
              <Modal
                open={uploadingModalOpen}
                onClose={handleClose}
                aria-labelledby="uploading-modal-title"
                aria-describedby="uploading-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: 200, sm: 300, md: 350 },
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: { xs: 2, sm: 3, md: 4 },
                    textAlign: "center",
                  }}
                >
                  <Typography
                    id="uploading-modal-title"
                    sx={{
                      mb: 2,
                      ...commonStyles.modalHeading,
                      fontWeight: "bold",
                    }}
                  >
                    Uploading...
                  </Typography>
                  <CircularProgress />
                  <Typography
                    id="uploading-modal-description"
                    sx={{
                      mt: 2,
                      ...commonStyles.modalText,
                    }}
                  >
                    Please wait while your images are being uploaded.
                  </Typography>
                </Box>
              </Modal>
              <Modal
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: 200, sm: 300, md: 350 },
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: { xs: 2, sm: 3, md: 4 },
                    textAlign: "center",
                    fontFamily: "montserrat",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: { xs: 40, md: 50 },
                      color: "green",
                      animation: `${TickAnimation} 0.6s ease-in-out`,
                    }}
                  />
                  <Typography
                    id="success-modal-title"
                    sx={{
                      mb: 2,
                      mt: 2,
                      ...commonStyles.modalHeading,
                      fontWeight: "bold",
                    }}
                  >
                    Upload Successful!
                  </Typography>
                  <Typography
                    id="success-modal-description"
                    sx={{
                      mt: 2,
                      ...commonStyles.modalText,
                    }}
                  >
                    Your images have been uploaded successfully.
                  </Typography>
                </Box>
              </Modal>
              <Typography sx={{ mb: 3, ...commonStyles.commonTextStyles }}>
                To avoid delay please make sure you submit at least 6 images,
                including clear photos of all the logos, heat stamps, hardware,
                and serial numbers.
              </Typography>

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  ...commonStyles.buttonCommonStyles,
                  bgcolor: "black",
                  color: "white",

                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Box
                sx={{ position: "relative", width: "100%", height: "400px" }}
              >
                <Image
                  src={requestMoreImagesPic}
                  alt="Authentication illustration"
                  layout="fill"
                  objectFit="contain"
                />
              </Box> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CustomLoaderWithBackdrop
        open={loader}
        handleClose={handleCloseForLoader}
      />
    </Layout>
  );
};

export default RequestMoreImages;
