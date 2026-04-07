// packages
import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  Box,
  Grid,
  Radio,
  Modal,
  Select,
  Button,
  Tooltip,
  Checkbox,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  useMediaQuery,
  InfoOutlinedIco,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, get, useForm } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// components
import ImageGrid from "@/common-components/display-images";
import TickAnimation from "@/common-commponent/animations";
import { notifyError, notifySuccess } from "../../../../../utils/toast";
import CustomErrorMessage from "@/common-commponent/error-message";
import { UploadMediaToS3 } from "../../../../../utils/common-functions/uploadMedia";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AuthenticationFormSingleValidation,
  AuthenticationFormBulkValidation,
} from "../../../../../utils/validationSchemas/contactsUsValidationSchema";

// assets
import AdImage from "@/components/zingImage";
import DPFORM from "../../../../../public/assets/images/home1.png";
import OthersPic from "../../../../../public/assets/images/others.png";
// styles
import { commonStyles } from "@/commonStyles";
// API and utils
import axiosInstance from "../../../../../utils/api/axios-client";
import {
  AUTHENTICATE_NOW_SUBMIT,
  GET_BUSINESS_PROFILE,
  GET_SUBSCRIPTION,
  GET_USER_PROFILE,
  SINGLE_FREE_SUBSCRIPTION,
  SUBMIT_SINGLE_AUTHENTICATION,
} from "../../../../../utils/api/constants";
import { GET_ALL_BRANDS_WITH_CATEGORIES } from "../../../../../utils/api/constants";
// store
import { useDispatch, useSelector } from "react-redux";
import bulkFormData, { persistBulkData } from "@/store/slice/bulkFormData";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import {
  currentUserInformation,
  userInformation,
} from "@/store/slice/userData";
import { faL } from "@fortawesome/free-solid-svg-icons";
import CertificateCountText from "@/common-commponent/certificate-count-text";
import { COMMON_VALUE_FOR_VALUATION } from "../../../../../utils/commonData";

import AddOnModalPrivacyPolicy from "./add_onn_modal";
import { styled } from "@mui/material/styles";
const style = {
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translateX(-50%)",
  width: {
    xs: "90%",
    sm: "80%",
    md: "60%",
    lg: "50%",
  },
  maxWidth: "600px",
  bgcolor: "#333",
  boxShadow: 24,
  p: 1,
  fontFamily: "var(--font-montserrat)",
};

// const COMMON_VALUE_FOR_VALUATION = 7;

let COMMON_VALUE_FOR_ADD_ON = 10;

const AdFormSection = ({
  getUploadedFile,
  bulkPage,
  setBulkPage,
  quantity,
  setQuantity,
  scrollToSection,
  sectionRef,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const recaptchaRef = useRef(null);
  const userInfo = useSelector(currentUserInformation);
  const isUserLoggedIn = Object.keys(userInfo)?.length > 0;
  const role = userInfo?.apiRole;

  const userEmail =
    Object.keys(userInfo)?.length > 0 ? userInfo?.user?.email : null;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const [loader, setLoader] = useState();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState();
  const [brandsData, setBrandsData] = useState();
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const [currentAuthForm, setCurrentAuthForm] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isModelModalOpen, setModelModalOpen] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [addOnModalState, setAddOnModalState] = useState(false);
  const [uploadingModalOpen, setUploadingModalOpen] = useState(false);
  const [addOnCheckBoxState, setAddOnCheckBoxState] = useState(false);
  const [realTimeUserInfo, setRealTimeUserIfo] = useState();

  const [subscriptionData, setSubscriptionData] = useState(null);

  const [bulkFormDataWithImages, setBulkFormDataWithImages] = useState([]);
  const [totalCertificates, setTotalCertificates] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openModelModal = () => setModelModalOpen(true);
  const closeModelModal = () => setModelModalOpen(false);
  const handleCloseAddOnCheckBox = (shouldCheck = false) => {
    setAddOnModalState(false);
    if (shouldCheck) {
      setValue("add_on_checkbox", true);
    }
  };

  const getRealTimeUserInfo = async () => {
    try {
      const apiEndPoint =
        role === "business-user" ? GET_BUSINESS_PROFILE : GET_USER_PROFILE;
      setLoader(true);
      const response = await (role === "business-user"
        ? axiosInstance.get(
            `${apiEndPoint}?id=${userInfo?.user?.user_business[0]?.id}`
          )
        : axiosInstance.get(`${apiEndPoint}?id=${userInfo?.user?.id}`));

      if (response?.data) {
        setRealTimeUserIfo(response?.data?.additional_data);
      }
    } catch (error) {}
    setLoader(false);
  };

  useEffect(() => {
    if (userInfo && isUserLoggedIn) {
      getRealTimeUserInfo();
    }
  }, [userInfo, isUserLoggedIn]);

  const getSubscriptionData = async () => {
    try {
      const response = await axiosInstance.get(GET_SUBSCRIPTION);
      setSubscriptionData(response?.data?.data);
    } catch (error) {
      notifyError(error.toString());
    }
  };

  const getBrandsData = async () => {
    try {
      const response = await axiosInstance.get(GET_ALL_BRANDS_WITH_CATEGORIES);
      setCategories(response?.data?.data?.category);
      setBrandsData(response?.data?.data?.brands);
    } catch (error) {
      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBrandsData();
  }, []);

  useEffect(() => {
    if (Object.keys(userInfo)?.length > 0) {
      getSubscriptionData();
    }
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
    getValues,
    clearErrors,
    setError,
    trigger,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(
      !bulkPage
        ? AuthenticationFormSingleValidation
        : AuthenticationFormBulkValidation
    ),
  });

  const ref = useRef();

  useEffect(() => {
    if (!ref) {
      if (images?.length > 0) {
        clearErrors("image");
      }
      if (images?.length === 0) {
        setError("image", {
          type: "manual",
          message: "Please select at least one  image",
        });
      }
    }
    ref.current = true;
  }, [images, clearErrors, setError]);

  useEffect(() => {
    if (images?.length > 0) {
      clearErrors("image");
    }
  }, [images, clearErrors, setError]);

  useEffect(() => {
    if (subscriptionData) {
      setTotalCertificates(
        subscriptionData?.subscription?.remaining_certificates
      );
    }
  }, [subscriptionData]);

  const handleCurrentAuthForm = () => {
    setCurrentAuthForm(currentAuthForm + 1);
    if (currentAuthForm > quantity) {
      setCurrentAuthForm(1);
    }
  };

  const onSubmit = async (data, e) => {
    setLoader(true);
    if (images?.length === 0) {
      setError("image", {
        type: "manual",
        message: "Please select at least one  image",
      });
      if (bulkPage && currentAuthForm == quantity) {
        if (!data.reCaptchaToken) {
          setError("reCaptchaToken", {
            type: "manual",
            message: "reCaptcha is required",
          });
        }
      }
      setLoader(false);
      return;
    }

    if (bulkPage && currentAuthForm == quantity) {
      if (!data.reCaptchaToken) {
        setError("reCaptchaToken", {
          type: "manual",
          message: "reCaptcha is required",
        });
        setLoader(false);
        return;
      }
    }
    const formData = new FormData();
    e.preventDefault();
    if (Array.isArray(formData)) {
      setFormData((prevData) => [...prevData, data]);
    } else if (formData) {
      setFormData([formData, data]);
    } else {
      setFormData(data);
    }
    if (!bulkPage) {
      // const allImages = images.slice(0, -1);

      let price;
      let query_count = 0;
      let price_per_request = 0;

      if (
        subscriptionData?.subscription?.active_status === 1 &&
        data?.selectCategory?.is_special === 0 &&
        subscriptionData?.subscription?.remaining_certificates > 0
      ) {
        query_count = 1;
        price = 0;
        price_per_request = subscriptionData?.package?.price_per_request;
      } else if (
        subscriptionData?.subscription?.active_status === 1 &&
        data?.selectCategory?.is_special === 0 &&
        subscriptionData?.subscription?.remaining_certificates === 0
      ) {
        price = subscriptionData?.package?.price_per_request;
        price_per_request = subscriptionData?.package?.price_per_request;
      } else {
        price = data?.selectCategory?.price;
      }

      if (price_per_request != 0 && data?.marketValuationCheckBox === true) {
        price_per_request = price_per_request + COMMON_VALUE_FOR_VALUATION;
      }

      price =
        data?.marketValuationCheckBox === true
          ? price + COMMON_VALUE_FOR_VALUATION
          : price;

      price =
        data?.add_on_checkbox === true
          ? price + COMMON_VALUE_FOR_ADD_ON
          : price;

      const singleFormData = {
        brand_name: data?.selectBrand?.id,

        category_id: data?.selectCategory?.id,
        model: data?.model,

        description: data?.additionalInformation,
        sku: data?.sku,
        email: data?.email,
        emailc: data?.confirmEmail,
        valuation: data?.marketValuationCheckBox === true ? 1 : 0,
        uploadedImages: images?.join(","),
        terms_and_condition_privacy_policy:
          data?.termsAndCondition === true ? true : false,
        amount: price,
        query_amount: price_per_request != 0 ? price_per_request : price,
        queries_count: query_count,
        is_user_paid: price === 0 ? 0 : 1,
        add_on: data?.add_on_checkbox ? 1 : 0,
      };

      if (price === 0) {
        // Free subscription - call API directly
        try {
          const response = await axiosInstance.post(
            SINGLE_FREE_SUBSCRIPTION,
            singleFormData
          );
          if (response.data.status_code === 200) {
            router.push("/");
            notifySuccess(response.data.msg);
          }
        } catch (error) {
          // console.error("Error during form submission", error);
        } finally {
          setLoader(false);
        }
      } else {
        // Paid case - save to Redux and redirect to cart
        const singleFormDataForCart = {
          ...data,
          images: images,
          price: price,
          price_per_request: price_per_request,
          query_count: query_count,
          is_user_paid: 1,
          add_on: data?.add_on_checkbox ? 1 : 0,
          valuation: data?.marketValuationCheckBox === true ? 1 : 0,
        };

        dispatch(persistBulkData([singleFormDataForCart]));
        router.push("/cart");
        setLoader(false);
      }
    } else {
      // const allImages = images.slice(0, -1);

      const allFormData = {
        ...data,
        images: images,
      };

      if (currentAuthForm == quantity) {
        dispatch(persistBulkData([...bulkFormDataWithImages, allFormData]));

        router.push("/cart");
      } else {
        setBulkFormDataWithImages((prevData) => [...prevData, allFormData]);

        clearAllFields();
        setFormSubmitted(true);
      }
      setLoader(false);
    }
    handleCurrentAuthForm();

    clearAllFields();
  };

  const handleRecaptcha = (value) => {
    setReCaptchaToken(value);
  };

  const handleCheckboxChangeAddOn = (event, field) => {
    // Only prevent default and open modal if checkbox is not already checked
    if (!field.value) {
      event.preventDefault();
      event.stopPropagation();
      setAddOnModalState(true);
    }
    // If already checked, let the normal onChange handler handle unchecking
  };

  const handleCheckboxChange = (event, field) => {
    // Only prevent default and open modal if checkbox is not already checked
    if (!field.value) {
      event.preventDefault();
      event.stopPropagation();
      handleOpen();
    }
    // If already checked, let the normal onChange handler handle unchecking
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    if (files.length > validFiles.length) {
      notifyError(
        `Your file is too large! Please reduce to a maximum of 20MB and try again.`
      );
    }
    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }
    {
      console.log("valid files: ", validFiles);
    }
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
          // Filter out undefined values from the results array
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

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // if (images.every((file) => file.size <= 10 * 1024 * 1024)) {
    //   clearErrors("image");
    // }
  };

  const clearAllFields = () => {
    reset();
    setSelectedCategory();
    setSelectedBrand();
    // setImages(Array(1).fill(OthersPic));
    setImages([]);

    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setReCaptchaToken("");
    }
  };

  useEffect(() => {
    if (formSubmitted && router.pathname === "/authentication") {
      scrollToSection();
      setFormSubmitted(false);
    }
  }, [formSubmitted, router.pathname]);

  useEffect(() => {
    clearAllFields();
  }, [bulkPage]);

  useEffect(() => {
    const adjustRecaptcha = () => {
      const recaptchaWrapper = document.querySelector(".captcha");
      if (recaptchaWrapper && recaptchaLoaded) {
        const screenWidth = window.innerWidth;
        let marginLeft;

        if (screenWidth <= 320) {
          marginLeft = "1.3%";
        } else if (screenWidth <= 375) {
          marginLeft = "-10%";
        } else if (screenWidth <= 390) {
          marginLeft = "-12%";
        } else if (screenWidth <= 414) {
          marginLeft = "-13%";
        } else if (screenWidth <= 430) {
          marginLeft = "-14%";
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

  useEffect(() => {
    if (!selectedBrand || !categories?.length) return;

    const result = categories?.filter(
      (category) => category.brand_id === selectedBrand?.id
    );

    if (selectedBrand?.brand == "Chanel" || selectedBrand?.brand == "Hermès") {
      COMMON_VALUE_FOR_ADD_ON = 20;
    } else {
      COMMON_VALUE_FOR_ADD_ON = 10;
    }

    const specialId = 565;

    const reordered = [
      ...result.filter((c) => c.id === specialId),
      ...result.filter((c) => c.id !== specialId),
    ];

    setCategoriesData(reordered);
    return () => {
      COMMON_VALUE_FOR_ADD_ON = 10;
    };
  }, [selectedBrand, categories]);

  console.log("selectedBrand", selectedBrand);

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedCategory(value);
    setValue("selectCategory", value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedBrand(value);
    setValue("selectBrand", value);
  };

  const handleCloseForLoader = () => {
    // setLoader(false);
  };
  const handleEmailChange = async (e) => {
    // Update email and re-validate confirmEmail
    setValue("email", e.target.value, { shouldValidate: true });
    await trigger("confirmEmail");
  };

  const handleConfirmEmailChange = async (e) => {
    // Update confirmEmail and re-validate email
    setValue("confirmEmail", e.target.value, { shouldValidate: true });
    await trigger("email");
  };

  useEffect(() => {
    if (userEmail) {
      setValue("email", userEmail);
      setValue("confirmEmail", userEmail);
    }
  }, [userEmail, bulkPage, currentAuthForm]);

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "white",
    color: "black",
    fontWeight: "600",
    padding: "8px 22px", // Default padding
    fontSize: "16px", // Default font size
    borderRadius: "11px", // Default border radius
    fontFamily: "var(--font-montserrat)",
    textTransform: "capitalize",
    // Responsive styles
    [theme.breakpoints.up("xs")]: {
      padding: "6px 14px",
      fontSize: "12px",
      borderRadius: "7px",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "7px 15px",
      fontSize: "14px",
      borderRadius: "9px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "8px 22px",
      fontSize: "16px",
      borderRadius: "11px",
    },
    [theme.breakpoints.up("lg")]: {
      padding: "10px 28px",
      fontSize: "18px",
      borderRadius: "13px",
    },
    [theme.breakpoints.up("xl")]: {
      padding: "10px 33px",
      fontSize: "20px",
      borderRadius: "13px",
    },
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  }));

  return (
    <>
      <Box
        pb={5}
        ref={sectionRef}
        sx={{
          display: "flex",
          bgcolor: "#F6F3EE",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "contents" }}
          >
            {bulkPage ? (
              <>
                <Grid
                  item
                  xs={12}
                  md={7.8}
                  sx={{ display: bulkPage ? "" : "none" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      color="black"
                      sx={{
                        ...commonStyles.commonHeadingStyles,
                      }}
                    >
                      {currentAuthForm <= quantity
                        ? `Bulk Authentication ${currentAuthForm} / ${quantity}`
                        : `Bulk Authentication ${quantity} / ${quantity}`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={0} md={4.2}></Grid>
              </>
            ) : null}{" "}
            <Grid item mt={{ md: -6 }} xs={10} md={4}>
              <Typography mb={0.4} color="initial" mt={{ xs: 1, sm: 2, md: 5 }}>
                Select Brand
                <Box component="span" sx={{ color: "red" }}>
                  *
                </Box>
              </Typography>
              <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ bgcolor: "white" }}
              >
                <Controller
                  name="selectBrand"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select
                      labelId="brands-label"
                      id="selectBrand"
                      name="selectBrand"
                      value={field.value || ""} // Empty string for placeholder visibility
                      onChange={(e) => {
                        field.onChange(e);
                        trigger("selectBrand");
                        handleChange(e);
                      }}
                      displayEmpty // Allows placeholder to show
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: { xs: 400, sm: 500 },
                            width: { xs: "80%", sm: "300px" },
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                              width: "10px",
                            },
                            "&::-webkit-scrollbar-track": {
                              backgroundColor: "#f1f1f1",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "#888",
                              borderRadius: "10px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              backgroundColor: "#555",
                            },
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected?.brand) {
                          return "Select Brand"; // Placeholder text
                        }
                        return selected.brand;
                      }}
                    >
                      {/* Mapping through the brandsData */}
                      {brandsData?.map((brand) => (
                        <MenuItem key={brand.id} value={brand}>
                          {brand.brand}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              {errors.selectBrand && (
                <CustomErrorMessage errorMessage={errors.selectBrand.message} />
              )}
              <Typography mt={0.4} color="gray">
                Brand not available?&nbsp;&nbsp;
                <Link
                  href="/contact-us"
                  underline="hover"
                  rel="noopener noreferrer"
                  sx={{ ml: "7px" }}
                >
                  Contact us here
                </Link>
              </Typography>

              <Box display="" mx="" my="" pt={2}>
                <Typography mb={0.4} color="initial">
                  Select Category
                  <Box component="span" sx={{ color: "red" }}>
                    *
                  </Box>
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: "white" }}
                >
                  <Controller
                    name="selectCategory"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select
                        labelId="select-label"
                        placeholder="Select Category"
                        IconComponent={KeyboardArrowDownIcon}
                        id="selectCategory"
                        name="selectCategory"
                        value={field.value || ""}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: { xs: 200, sm: 300 },
                              width: { xs: "80%", sm: "300px" },
                              overflowY: "auto",
                              "&::-webkit-scrollbar": {
                                width: "6px",
                              },
                              "&::-webkit-scrollbar-track": {
                                backgroundColor: "#f1f1f1",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#888",
                                borderRadius: "10px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#555",
                              },
                            },
                          },
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("selectCategory");
                          handleCategoryChange(e);
                        }}
                        renderValue={(selected) => {
                          // If no category is selected, show the placeholder
                          if (!selected?.name) {
                            return "Select Category"; // Placeholder text
                          }
                          return selected.name;
                        }}
                      >
                        {/* Placeholder MenuItem */}
                        {/* <MenuItem value="" disabled>
                          Select Category
                        </MenuItem> */}

                        {/* Mapping through categoriesData */}
                        {categoriesData?.map((category) => (
                          <MenuItem key={category.id} value={category}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                {errors.selectCategory && (
                  <CustomErrorMessage
                    errorMessage={errors.selectCategory.message}
                  />
                )}
              </Box>

              <Box pt={2}>
                <Box display="flex" alignItems="center">
                  <Typography mb={0.4} color="initial">
                    Model
                    <Box component="span" sx={{ color: "red" }}>
                      *
                    </Box>
                  </Typography>
                  <Tooltip title="More information about the model" arrow>
                    <IconButton
                      size="small"
                      onClick={openModelModal}
                      sx={{
                        mt: "-0.5px",
                        marginLeft: 0.5,
                        width: 24,
                        height: 24,
                        padding: 0,
                        bgcolor: "#e0e0e0",
                        "&:hover": {
                          bgcolor: "#1976d2",
                          color: "white",
                        },
                      }}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: "16px" }} />{" "}
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  {...register("model")}
                  name="model"
                  id="model"
                  placeholder="Model"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "white", marginTop: 1 }}
                />

                {/* Model Modal */}
                <Modal
                  open={isModelModalOpen}
                  onClose={closeModelModal}
                  aria-labelledby="model-modal-title"
                  aria-describedby="model-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: { xs: "65%", sm: "50%", md: "50%", lg: "80%" },
                      maxWidth: "400px",
                      borderRadius: "10px",
                      bgcolor: "#333333",
                      py: 2,
                      px: 3,
                    }}
                  >
                    <Typography
                      id="model-modal-title"
                      sx={{
                        color: "white",
                        ...commonStyles.modalHeading,
                        fontWeight: "bold",
                      }}
                    >
                      Model
                    </Typography>

                    <Typography
                      id="model-modal-description"
                      sx={{
                        mt: 2,
                        color: "white",
                        // textAlign: "center",
                        textAlign: { xs: "center", sm: "left" },
                        ...commonStyles.modalText,
                        lineHeight: {
                          xs: "18px",
                          sm: "22px",
                          md: "24px",
                          lg: "26px",
                          xl: "28px",
                        },
                      }}
                    >
                      If you do not know the model name please add your own
                      identifier so you can reference this request if we require
                      more photos.
                    </Typography>

                    <hr
                      style={{
                        border: "none",
                        height: "0.5px",
                        backgroundColor: "#d3d3d3",
                        margin: "10px 0",
                        width: "100%",
                        maxWidth: "100%",
                      }}
                    />

                    <Typography
                      onClick={closeModelModal}
                      sx={{
                        width: "100%",
                        color: "#1976d2",
                        cursor: "pointer",
                        textAlign: "center",
                        ...commonStyles.modalHeading,
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      Ok
                    </Typography>
                  </Box>
                </Modal>
              </Box>
              {errors.model && (
                <CustomErrorMessage errorMessage={errors.model.message} />
              )}

              <Box display="" mx="" my="" pt={2}>
                <Typography mb={0.4} color="initial">
                  SKU
                </Typography>
                <TextField
                  {...register("sku")}
                  id="sku"
                  name="sku"
                  placeholder="Enter  SKU"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "white" }}
                />
              </Box>

              <Box display="" mx="" my="" pt={2}>
                <Typography mb={0.4} color="initial">
                  Additional Information
                </Typography>
                <TextField
                  {...register("additionalInformation")}
                  id="additionalInformation"
                  name="additionalInformation"
                  // label="Please type here..."
                  placeholder="Please type here..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 350 }}
                  sx={{ bgcolor: "white" }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    {watch("additionalInformation")?.length || 0}/350
                  </Typography>
                </Box>
              </Box>
              {console.log(
                "conditionss",
                bulkPage && currentAuthForm == quantity
              )}

              <Box display="" mx="" my="" pt={2}>
                <Typography mb={0.4} color="initial">
                  Email Address
                  <Box component="span" sx={{ color: "red" }}>
                    *
                  </Box>
                </Typography>
                <TextField
                  {...register("email")}
                  id="email"
                  name="email"
                  // label="Email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "white" }}
                  disabled={userEmail ? true : false}
                  onChange={handleEmailChange} // Call handleEmailChange on change
                />
              </Box>
              {errors.email && (
                <CustomErrorMessage errorMessage={errors.email.message} />
              )}

              <Box display="" mx="" my="" pt={2}>
                <Typography mb={0.4} color="initial">
                  Confirm Email
                  <Box component="span" sx={{ color: "red" }}>
                    *
                  </Box>
                </Typography>
                <TextField
                  {...register("confirmEmail")}
                  id="confirmEmail"
                  name="confirmEmail"
                  // label="Confirm Email"
                  placeholder="Confirm Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "white" }}
                  disabled={userEmail ? true : false}
                  onChange={handleConfirmEmailChange} // Call handleConfirmEmailChange on change
                />
              </Box>
              {errors.confirmEmail && (
                <CustomErrorMessage
                  errorMessage={errors.confirmEmail.message}
                />
              )}

              {realTimeUserInfo?.add_ons &&
                Object.keys(realTimeUserInfo?.add_ons).length > 0 && (
                  <Controller
                    name="add_on_checkbox"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onClick={(e) => handleCheckboxChangeAddOn(e, field)}
                            onChange={(e) => {
                              // Only allow unchecking directly, checking requires Accept button
                              if (!e.target.checked) {
                                field.onChange(e);
                              }
                            }}
                            id="add_on_checkbox"
                            name="add_on_checkbox"
                          />
                        }
                        label={
                          <span
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "1rem",
                            }}
                          >
                            Insurance: ${COMMON_VALUE_FOR_ADD_ON}
                            <a
                              href="/add-on-terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#667eea",
                                textDecoration: "none",
                                marginLeft: "4px",
                                fontWeight: "500",
                              }}
                            >
                              {/* Please read Add On Terms */}?
                            </a>
                          </span>
                        }
                        sx={{
                          mt: "5px",
                          "& .MuiFormControlLabel-label": {
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "1rem",
                          },
                        }}
                      />
                    )}
                  />
                )}

              <Box>
                <Controller
                  name="marketValuationCheckBox"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onClick={(e) => handleCheckboxChange(e, field)}
                          onChange={(e) => {
                            // Only allow unchecking directly, checking requires Ok button
                            if (!e.target.checked) {
                              field.onChange(e);
                            }
                          }}
                          id="marketValuationCheckBox"
                          name="marketValuationCheckBox"
                        />
                      }
                      label={`Market Valuation: $${COMMON_VALUE_FOR_VALUATION}`}
                      sx={{
                        mt: "5px",
                        "& .MuiFormControlLabel-label": {
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "1rem",
                        },
                      }}
                    />
                  )}
                />

                <AddOnModalPrivacyPolicy
                  open={addOnModalState}
                  handleCloseAddOnCheckBox={handleCloseAddOnCheckBox}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      ...style,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: {
                        xs: "65%",
                        sm: "50%",
                        md: "50%",
                        lg: "80%",
                      },
                      maxWidth: "400px",
                      borderRadius: "10px",
                      // height: "auto",
                      py: 2,
                      px: 3,
                    }}
                  >
                    <Typography
                      id="modal-modal-title"
                      sx={{
                        color: "white",
                        ...commonStyles.modalHeading,
                        fontWeight: "bold",
                      }}
                    >
                      Alert
                    </Typography>

                    <Typography
                      id="modal-modal-description"
                      sx={{
                        mt: 2,
                        color: "white",
                        // textAlign: "center",
                        textAlign: { xs: "center", sm: "left" },
                        ...commonStyles.modalText,
                        lineHeight: {
                          xs: "18px",
                          sm: "22px",
                          md: "24px",
                          lg: "26px",
                          xl: "28px",
                        },
                      }}
                    >
                      You are adding a ${COMMON_VALUE_FOR_VALUATION} market
                      valuation to your order. Our team will include a current
                      market value, which is how much your item is currently
                      worth, if you select this add-on.
                    </Typography>
                    <hr
                      style={{
                        border: "none",
                        height: "0.5px",
                        backgroundColor: "#d3d3d3",
                        margin: "10px 0",
                        fontFamily: "var(--font-montserrat)",
                        width: "100%",
                        maxWidth: "100%",
                      }}
                    />
                    <Button
                      onClick={() => {
                        setValue("marketValuationCheckBox", true);
                        handleClose();
                      }}
                      sx={{
                        // mt: 1,
                        // mb: 1,
                        width: "100%",

                        color: "#1976d2",
                        cursor: "pointer",
                        textAlign: "center",

                        ...commonStyles.modalHeading,
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)", // Add a slight hover effect
                        },
                      }}
                    >
                      Ok
                    </Button>
                  </Box>
                </Modal>
              </Box>
            </Grid>
            <Grid item xs={0} md={4} pb={5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: "1",
                  top: "3px",
                }}
              >
                <AdImage
                  src={DPFORM}
                  alt="book a call"
                  style={{
                    width: isMobile ? "0" : "460px",
                    height: isMobile ? "0" : "616px",
                    width: isMedium ? "0" : "460px",
                    height: isMedium ? "0" : "616px",
                  }}
                  fill={false}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  fontStyle: "italic",
                  p: 2,
                  textAlign: "center",
                }}
              >
                To avoid delay please make sure you submit at least 6 images,
                including clear photos of all the logos, heat stamps, hardware,
                and serial numbers.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <Typography sx={{ mb: 1, ml: 0.5 }}>Choose Images</Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #c4c4c4",
                    borderRadius: "10px",
                    overflow: "hidden",
                    width: { xs: "83%", sm: "40%", md: "30%" },
                    mb: 1,
                  }}
                >
                  {/* 'Choose Files' Button */}
                  <label
                    htmlFor="file-input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      color: "#333",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Choose Files
                  </label>

                  {/* 'No file chosen' Text */}
                  <Box
                    sx={{
                      flex: 1,
                      padding: "8px 12px",
                      color: "#666",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    No file chosen
                  </Box>
                </Box>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  id="file-input"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <CustomErrorMessage errorMessage={errors.image.message} />
                )}
              </Box>

              <Box sx={{ display: "flex", p: 1 }}>
                <ImageGrid
                  displayImages={images}
                  handleRemoveImage={handleRemoveImage}
                />
              </Box>
            </Grid>
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
            <Box
              sx={{
                // width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                width: { xs: "auto", sm: "100%" },
                ml: { xs: 2, sm: 10 },
                mr: { xs: 2, sm: 10 },
                pl: { xs: "3%", sm: "4%" },
              }}
            >
              {!bulkPage &&
                isUserLoggedIn &&
                subscriptionData?.subscription?.active_status === 1 && (
                  <CertificateCountText
                    totalCertificates={totalCertificates}
                    subscriptionData={subscriptionData}
                  />
                )}
            </Box>
            <Grid item xs={12} sm={12} md={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {!bulkPage || currentAuthForm == quantity && <Box */}
                {!bulkPage || currentAuthForm == quantity ? (
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
                    <Controller
                      name="reCaptchaToken" // Field name in the form
                      control={control} // Control from useForm
                      defaultValue="" // Default value for the ReCAPTCHA
                      render={({ field }) => (
                        <ReCAPTCHA
                          name="reCaptchaToken"
                          {...register("reCaptchaToken")}
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                          asyncScriptOnLoad={() => {
                            setRecaptchaLoaded(true);
                          }}
                          onChange={(e) => {
                            handleRecaptcha(e);
                            field.onChange(e); // Update form state in react-hook-form
                            // trigger("reCaptchaToken"); // Manually trigger validation on change if needed
                          }}
                        />
                      )}
                    />
                  </Box>
                ) : null}
                {(!bulkPage || currentAuthForm == quantity) &&
                  errors?.reCaptchaToken && (
                    <Box sx={{ marginLeft: "8px" }}>
                      <CustomErrorMessage
                        errorMessage={errors.reCaptchaToken.message}
                      />
                    </Box>
                  )}
                <Box pt={3} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                  <Grid
                    container
                    spacing={1}
                    alignItems={{ xs: "baseline", sm: "center" }}
                  >
                    <Grid item>
                      <Controller
                        id="termsAndCondition"
                        name="termsAndCondition"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}
                                sx={{ mr: -3, ml: 2 }}
                              />
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography
                        id="termsAndCondition"
                        name="termsAndCondition"
                        variant="caption"
                        sx={{
                          color: "black",
                          fontFamily: "var(--font-montserrat)",
                          fontSize: {
                            xs: "12px",
                            sm: "16px",
                            md: "18px",
                            lg: "20px",
                            xl: "22px",
                          },
                          underline: "none",
                        }}
                      >
                        {console.log(
                          "currentAuthForm == quantity: ",
                          !bulkPage || currentAuthForm == quantity
                        )}
                        By clicking checkout, you accept the{" "}
                        <Link
                          href="/terms-of-service"
                          underline="none"
                          color="#1976d2"
                          sx={{ cursor: "pointer" }}
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
                          sx={{ cursor: "pointer" }}
                        >
                          <span style={{ color: "#1976d2", cursor: "pointer" }}>
                            Privacy Policy
                          </span>
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                  {errors.termsAndCondition && (
                    <Box sx={{ ml: 2 }}>
                      <CustomErrorMessage
                        errorMessage={errors.termsAndCondition.message}
                      />
                    </Box>
                  )}
                </Box>

                <Box
                  mt={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {bulkPage ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        ...commonStyles.buttonCommonStyles,
                        // Handle enabled state hover
                        "&:enabled:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                        // Handle disabled state
                        "&.Mui-disabled": {
                          backgroundColor: "D8D5D1",
                          color: "rgba(0, 0, 0, 0.38)",
                          cursor: "not-allowed",
                          opacity: 0.7,
                        },
                      }}
                    >
                      {/* {isSubmitting ? (
                        <CircularProgress size={24} />
                      ) : currentAuthForm == quantity ? (
                        "Proceed to checkout"
                      ) : (
                        "Add to cart"
                      )} */}
                      {loader ? (
                        <CircularProgress size={24} />
                      ) : currentAuthForm == quantity ? (
                        "Proceed to checkout"
                      ) : (
                        "Add to cart"
                      )}
                    </Button>
                  ) : (
                    // <Button
                    //   type="submit"
                    //   variant="contained"
                    //   sx={{
                    //     backgroundColor: "white",
                    //     color: "black",
                    //     ...commonStyles.buttonCommonStyles,
                    //     fontWeight: "600",
                    //     "&:hover": {
                    //       backgroundColor: "black",
                    //       color: "white",
                    //     },
                    //   }}
                    //   disabled={isSubmitting || Object.keys(errors).length > 0}
                    // >
                    <CustomButton
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                    >
                      {isSubmitting && loader ? (
                        <Box
                          sx={{
                            width: {
                              xs: "100px",
                              sm: "140px",
                              md: "160px",
                              lg: "180px",
                              xl: "190px",
                            },
                            height: "auto",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      ) : (
                        "Proceed to checkout"
                      )}
                    </CustomButton>
                  )}
                </Box>
                {console.log("errorserrors", errors)}
              </Box>
            </Grid>
          </form>
        </Grid>
      </Box>
      {console.log("fdffdfdff", getValues())}

      <CustomLoaderWithBackdrop
        open={loader}
        handleClose={handleCloseForLoader}
      />
    </>
  );
};

export default AdFormSection;
