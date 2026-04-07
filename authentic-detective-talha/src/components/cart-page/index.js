import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
} from "@mui/material";
import GucciBag from "../../../public/assets/images/gucci-bag.jpeg";
import { styles } from "./styles";
import { commonStyles } from "@/commonStyles";
import AdImage from "../zingImage";
import { styled } from "@mui/material/styles";
import DeleteIcon from "../../../public/assets/svgs/deleteIcon";
import {
  persistBulkData,
  selectBulkFormData,
} from "@/store/slice/bulkFormData";
import ForwardIcon from "../../../public/assets/svgs/forwardIcon";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useRouter } from "next/router";
import {
  GET_PRICE_BULK_CASE,
  GET_SUBSCRIPTION,
  SUBMIT_BULK_AUTHENTICATION,
  SUBMIT_BULK_FORM_FREE,
  VERIFY_COUPON,
} from "../../../utils/api/constants";
import axiosInstance from "../../../utils/api/axios-client";
import CustomLoader from "@/common-components/custom-loader";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import { currentUserInformation } from "@/store/slice/userData";
import CertificateCountText from "@/common-commponent/certificate-count-text";
import CertificateCountTextCartScreen from "@/common-commponent/certificate-count-text-cart";

// import { COMMON_VALUE_FOR_ADD_ON } from "../../../utils/commonData";

const StyledImage = styled("img")({
  width: "24px",
  height: "24px",
  objectFit: "contain",
});

const staticValueOfValuation = 7;
let COMMON_VALUE_FOR_ADD_ON = 10;

const CartPage = ({ realTimeUserInfo }) => {
  const router = useRouter();
  const bulkFormsDataFromRedux = useSelector(selectBulkFormData);
  const userInfo = useSelector(currentUserInformation);
  const isUserLoggedIn = Object.keys(userInfo)?.length > 0;

  const dispatch = useDispatch();
  const [totalCertificates, setTotalCertificates] = useState(0);

  const [ip, setIP] = useState("");
  const [bulkFormsData, setBulkFormsData] = useState([]);
  const [coupanCodeValue, setCoupanCodeValue] = useState();
  const [loader, setLoader] = useState(true);
  const [priceValues, setPriceValues] = useState([]);
  const [totalAmount, seTtotalAmount] = useState();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [queryCount, setQueryCount] = useState(0);
  const [certificatesConsumed, setCertificatesConsumed] = useState(0);
  const [QueryAmountState, setQueryAmountState] = useState();
  const [coupanCodeApplied, setCoupanCodeApplied] = useState(false);
  const [isSubscriptionArray, setisSubscriptionArray] = useState([]);

  console.log("bulkFormsData", bulkFormsData);
  console.log("priceValues", priceValues);
  console.log("coupanCodeValue", coupanCodeValue);

  console.log("certificatesConsumed", certificatesConsumed);

  const handleCloseForLoader = () => {
    // setLoader(false);
  };

  useEffect(() => {
    if (!isUserLoggedIn) {
      setLoader(false);
    }
  }, [isUserLoggedIn]);

  const getSubscriptionData = async () => {
    try {
      const response = await axiosInstance.get(GET_SUBSCRIPTION);
      setSubscriptionData(response?.data?.data);
    } catch (error) {
      notifyError(error.toString());
    }
    setLoader(false);
  };

  useEffect(() => {
    if (bulkFormsDataFromRedux) {
      setBulkFormsData(bulkFormsDataFromRedux);
    }
  }, []);

  useEffect(() => {
    if (subscriptionData) {
      setTotalCertificates(
        subscriptionData?.subscription?.remaining_certificates
      );
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (Object.keys(userInfo)?.length > 0) {
      getSubscriptionData();
    }
  }, []);

  const handleDelete = (index) => {
    // setLoader(true);

    // setPriceValues([]);
    setQueryCount(0);
    setCertificatesConsumed(0);
    const updatedData = bulkFormsData.filter((_, i) => i !== index);
    setBulkFormsData(updatedData);
  };

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIP(data.ip); // Set the IP address to state
      } catch (error) {}
    };

    fetchIP();
  }, []);

  console.log("bulkFormsData", bulkFormsData);

  const submitBulkQuery = async () => {
    setLoader(true);
    const endPoint =
      totalAmount == 0 ? SUBMIT_BULK_FORM_FREE : SUBMIT_BULK_AUTHENTICATION;

    const formData = bulkFormsData.map((item, index) => ({
      ...item,
      uploadedImages: item?.images.join(","),
      brand_name: item?.selectBrand?.id,
      selectCategory: item?.selectCategory?.id,
      category: item?.selectCategory?.id,
      selectBrand: "",
      images: "",
      description: item?.additionalInformation,
      valuation: item?.marketValuationCheckBox ? 1 : 0,
      ip: ip,
      query_amount:
        QueryAmountState?.length > 0
          ? QueryAmountState[index]
          : item?.marketValuationCheckBox
          ? item?.selectCategory?.price + staticValueOfValuation
          : item?.selectCategory?.price,
      is_user_paid:
        priceValues?.length > 0
          ? priceValues[index] > 0
            ? 1
            : 0
          : item?.marketValuationCheckBox
          ? item?.selectCategory?.price + staticValueOfValuation > 0
            ? 1
            : 0
          : item?.selectCategory?.price > 0
          ? 1
          : 0,
      paid_amount:
        priceValues?.length > 0
          ? priceValues[index]
          : item?.marketValuationCheckBox
          ? item?.selectCategory?.price + staticValueOfValuation
          : item?.selectCategory?.price,
      is_subscription: isSubscriptionArray[index],
      add_on: item?.add_on_checkbox ? 1 : 0,
    }));

    const jsonFormat = JSON.stringify(formData);

    const mainBodyData = {
      user_email: bulkFormsData[0]?.email,
      total_price: totalAmount,
      queries_count: queryCount,
      total_queries_count: bulkFormsData?.length,
      ...(coupanCodeApplied && { coupon_code: coupanCodeValue }),
      queries: jsonFormat,
    };

    try {
      const response = await axiosInstance.post(`${endPoint}`, mainBodyData);

      if (response.data.status_code === 200) {
        // notifySuccess(response.data.msg);

        if (totalAmount == 0) {
          router.push("/");
          notifySuccess(response.data.msg);
        } else {
          const encodedData = encodeURIComponent(
            JSON.stringify(response.data.data)
          );
          router.push({
            pathname: "/checkout",
            query: { data: encodedData, page: "bulk" },
          });
        }
        // dispatch(persistBulkData([]));
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

  const handleCheckboxChange = (index) => {
    // setPriceValues([]);

    setQueryCount(0);
    setCertificatesConsumed(0);

    const updatedData = bulkFormsData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          marketValuationCheckBox: !item.marketValuationCheckBox,
        };
      }
      return item;
    });
    // setLoader(true);

    setBulkFormsData(updatedData);
  };

  const handleAddOnCheckboxChange = (index) => {
    setQueryCount(0);
    setCertificatesConsumed(0);

    const updatedData = bulkFormsData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          add_on_checkbox: !item.add_on_checkbox,
        };
      }
      return item;
    });

    setBulkFormsData(updatedData);
  };

  // const getPrice = async (id, evaluation, index) => {
  //   const bodyData = {
  //     category_id: id,
  //     valuation: evaluation == true ? 1 : 0,
  //   };

  //   try {
  //     const response = await axiosInstance.post(GET_PRICE_BULK_CASE, bodyData);

  //     if (response?.data?.data) {
  //       setPriceValues((prev) => {
  //         const newArray = [...prev]; // Create a copy of the previous array
  //         newArray[index] = response?.data?.data; // Set the new value at the specified index
  //         return newArray; // Return the new array
  //       });
  //     } else {
  //       notifyError(response?.data?.msg);
  //     }
  //   } catch (error) {
  //     notifyError(error.toString());
  //   }
  // };

  useEffect(() => {
    // const fetchPrices = async () => {
    //   if (bulkFormsData) {
    //     setLoader(true);

    //     const promises = bulkFormsData.map((item, index) =>
    //       getPrice(
    //         item?.selectCategory?.id,
    //         item?.marketValuationCheckBox,
    //         index
    //       )
    //     );

    //     await Promise.all(promises);

    //     setLoader(false);
    //   }
    // };
    if (bulkFormsData && bulkFormsData.length > 0) {
      // ← Check for actual data
      dispatch(persistBulkData(bulkFormsData));
    }

    let isPriceFromSubscription = [];

    if (!subscriptionData) {
      isPriceFromSubscription = bulkFormsData.map(() => 0);
      setisSubscriptionArray(isPriceFromSubscription);

      // const t_amount = bulkFormsData.reduce((acc, item) => {
      //   return (
      //     acc +
      //     (item?.marketValuationCheckBox
      //       ? item?.selectCategory?.price + staticValueOfValuation
      //       : item?.selectCategory?.price)
      //   );
      // }, 0);

      const t_amount = bulkFormsData.reduce((acc, item) => {
        const basePrice = item?.marketValuationCheckBox
          ? item?.selectCategory?.price + staticValueOfValuation
          : item?.selectCategory?.price;

        if (
          item?.selectBrand?.brand == "Chanel" ||
          item?.selectBrand?.brand == "Hermès"
        ) {
          COMMON_VALUE_FOR_ADD_ON = 20;
        } else {
          COMMON_VALUE_FOR_ADD_ON = 10;
        }

        const addOnPrice = item?.add_on_checkbox ? COMMON_VALUE_FOR_ADD_ON : 0;

        return acc + basePrice + addOnPrice;
      }, 0);

      seTtotalAmount(t_amount);

      if (coupanCodeValue && coupanCodeApplied) {
        applyCoupanCodeMethod(t_amount);
      }
    } else {
      if (subscriptionData) {
        let queryCount = 0;
        let consumedCertificates = 0;

        const allPriceValues = bulkFormsData?.map((item, index) => {
          let basePrice = 0;

          if (
            subscriptionData?.subscription?.active_status === 1 &&
            item?.selectCategory?.is_special === 0 &&
            subscriptionData?.subscription?.remaining_certificates > 0 &&
            consumedCertificates <
              subscriptionData?.subscription?.remaining_certificates
          ) {
            queryCount += 1;
            consumedCertificates += 1;
            isPriceFromSubscription[index] = 1;

            if (item?.marketValuationCheckBox === true) {
              basePrice = staticValueOfValuation;
            } else {
              basePrice = 0;
            }
          } else if (
            subscriptionData?.subscription?.active_status === 1 &&
            item?.selectCategory?.is_special === 0 &&
            consumedCertificates ===
              subscriptionData?.subscription?.remaining_certificates
          ) {
            isPriceFromSubscription[index] = 0;

            if (item?.marketValuationCheckBox === true) {
              basePrice =
                staticValueOfValuation +
                subscriptionData?.package?.price_per_request;
            } else {
              basePrice = subscriptionData?.package?.price_per_request;
            }
          } else {
            isPriceFromSubscription[index] = 0;
            basePrice =
              item?.marketValuationCheckBox === true
                ? item?.selectCategory?.price + staticValueOfValuation
                : item?.selectCategory?.price;
          }
          if (
            item?.selectBrand?.brand == "Chanel" ||
            item?.selectBrand?.brand == "Hermès"
          ) {
            COMMON_VALUE_FOR_ADD_ON = 20;
          } else {
            COMMON_VALUE_FOR_ADD_ON = 10;
          }

          const addOnPrice = item?.add_on_checkbox
            ? COMMON_VALUE_FOR_ADD_ON
            : 0;
          return basePrice + addOnPrice;
        });
        setisSubscriptionArray(isPriceFromSubscription);

        // Update state after the loop
        setQueryCount((prevCount) => prevCount + queryCount);
        setCertificatesConsumed(consumedCertificates);

        const allQueryAmountPrice = bulkFormsData?.map((item) => {
          let price_per_request = 0;

          if (
            subscriptionData?.subscription?.active_status === 1 &&
            item?.selectCategory?.is_special === 0 &&
            subscriptionData?.subscription?.remaining_certificates > 0 &&
            certificatesConsumed !=
              subscriptionData?.subscription?.remaining_certificates
          ) {
            price_per_request = subscriptionData?.package?.price_per_request;
          } else if (
            subscriptionData?.subscription?.active_status === 1 &&
            item?.selectCategory?.is_special === 0 &&
            certificatesConsumed ===
              subscriptionData?.subscription?.remaining_certificates
          ) {
            price_per_request = subscriptionData?.package?.price_per_request;
          } else if (
            subscriptionData?.subscription?.active_status === 1 &&
            item?.selectCategory?.is_special != 0
          ) {
            price_per_request = item?.selectCategory?.price;
          }

          if (
            price_per_request != 0 &&
            item?.marketValuationCheckBox === true
          ) {
            price_per_request = price_per_request + staticValueOfValuation;
          }

          if (item?.add_on_checkbox) {
            if (
              item?.selectBrand?.brand == "Chanel" ||
              item?.selectBrand?.brand == "Hermès"
            ) {
              COMMON_VALUE_FOR_ADD_ON = 20;
            } else {
              COMMON_VALUE_FOR_ADD_ON = 10;
            }
            price_per_request += COMMON_VALUE_FOR_ADD_ON;
          }

          return price_per_request;
        });

        setQueryAmountState(allQueryAmountPrice);

        setPriceValues(allPriceValues);

        const t_amount = allPriceValues.reduce((acc, item) => {
          return acc + item;
        }, 0);

        seTtotalAmount(t_amount);
        if (coupanCodeValue && coupanCodeApplied) {
          applyCoupanCodeMethod(t_amount);
        }
      }
    }

    // fetchPrices();
  }, [bulkFormsData, subscriptionData]);

  console.log("bulkFormsData", bulkFormsData);

  // useEffect(() => {
  //   if (priceValues?.length > 0) {
  //     const t_amount = priceValues.reduce((acc, item) => {
  //       return acc + item;
  //     }, 0);

  //     seTtotalAmount(t_amount);
  //   }
  // }, [priceValues]);

  // useEffect(() => {
  //   if (totalAmount > 0 && coupanCodeValue && coupanCodeApplied) {

  //     applyCoupanCodeMethod();
  //   }
  // }, [bulkFormsData]);

  const handleTotalAmount = (value) => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      console.error("Invalid value:", value);
      return 0;
    }

    if (numericValue === 0) {
      return 0;
    }

    const formattedValue = numericValue.toFixed(2);

    return parseFloat(formattedValue);
  };

  const applyCoupanCodeMethod = async (amountValue) => {
    setLoader(true);

    try {
      const response = await axiosInstance.post(`${VERIFY_COUPON}`, {
        coupon_code: coupanCodeValue,
        amount: amountValue ? amountValue : totalAmount,
      });

      if (response.data.status_code === 200) {
        notifySuccess(response.data.msg);

        const amount = handleTotalAmount(response.data.data);
        seTtotalAmount(amount);
        setCoupanCodeApplied(true);
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

  console.log("priceValues", priceValues);

  return (
    <Box sx={{ ...styles.container, overflowX: "clip", minHeight: "85vh" }}>
      <Typography
        sx={{
          ...commonStyles.commonHeadingStyles,
          textAlign: "center",
          width: "100%",
          mt: 2,
          ml: {
            xs: 1,
            sm: 2,
            md: "-23px",
            lg: -3,
          },
        }}
      >
        Cart
      </Typography>

      <Box
        sx={{
          height: "2px",
          backgroundColor: "#cfc5b3",
          zIndex: 1,
          width: "100%",
          mt: 2,
        }}
      ></Box>

      <Grid container spacing={0} alignItems="center" mt={4} pl={4} pr={4}>
        {bulkFormsData.map((item, index) => (
          <Grid
            container
            item
            xs={12}
            key={index}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Grid item xs={10}>
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    ...styles.image,
                    objectFit: "contain",
                    marginRight: "10px",
                    width: "115px",
                    height: "115px",
                    overflow: "hidden",
                    borderRadius: "10px",
                  }}
                >
                  <AdImage
                    src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/authenticateImage/${item.images[0]}`}
                    layout="default"
                    fill={false}
                    width={80}
                    height={80}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                    }}
                  />
                </Box>

                <Box sx={styles.infoContainer}>
                  <Typography sx={styles.brand}>
                    <span style={{ fontWeight: "bold" }}>Brand</span>:{" "}
                    {item.selectBrand.brand}
                  </Typography>
                  <Typography sx={styles.model}>
                    <span style={{ fontWeight: "bold" }}>Model</span>:{" "}
                    {item.model}
                  </Typography>
                  {/* <Typography sx={styles.price}>
                    <span style={{ fontWeight: "bold" }}>Price</span>:{" "}
                    {priceValues?.length > 0
                      ? priceValues[index]
                      : item?.marketValuationCheckBox
                      ? item?.selectCategory?.price + staticValueOfValuation
                      : item?.selectCategory?.price}
                  </Typography> */}
                  <Typography sx={styles.price}>
                    <span style={{ fontWeight: "bold" }}>Price</span>: $
                    {priceValues?.length > 0
                      ? priceValues[index]
                      : (item?.marketValuationCheckBox
                          ? item?.selectCategory?.price + staticValueOfValuation
                          : item?.selectCategory?.price) +
                        (item?.add_on_checkbox
                          ? item?.selectBrand?.brand == "Chanel" ||
                            item?.selectBrand?.brand == "Hermès"
                            ? 20
                            : 10
                          : 0)}
                  </Typography>

                  <Typography sx={styles.valuation}>
                    <span style={{ fontWeight: "bold" }}>Valuation</span>:{" "}
                    <input
                      type="checkbox"
                      checked={item.marketValuationCheckBox}
                      onChange={() => handleCheckboxChange(index)}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Typography>
                  {realTimeUserInfo?.add_ons &&
                    Object.keys(realTimeUserInfo?.add_ons).length > 0 && (
                      <Typography sx={styles.valuation}>
                        <span style={{ fontWeight: "bold" }}>Add On</span>:{" "}
                        <input
                          type="checkbox"
                          checked={item.add_on_checkbox}
                          onChange={() => handleAddOnCheckboxChange(index)}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Typography>
                    )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2} textAlign="right">
              <IconButton
                aria-label="delete"
                sx={styles.deleteIcon}
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          height: "2px",
          backgroundColor: "#cfc5b3",
          zIndex: 1,
          width: "100%",
          mt: 2,
        }}
      ></Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          padding: "16px",
          flexDirection: "column",
        }}
      >
        <Box sx={{ ml: 4 }}>
          <Typography sx={commonStyles.commonHeadingStyles}>
            Coupon Code
          </Typography>
          <Box pt={1}>
            <TextField
              id="coupon"
              name="coupon"
              type="text"
              margin="normal"
              onChange={(e) => setCoupanCodeValue(e.target.value)}
              disabled={coupanCodeApplied}
              fullWidth
              autoComplete="coupon"
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#555555",
                  borderRadius: "50px",
                  color: "white",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      coupanCodeValue && !coupanCodeApplied
                        ? "Apply Coupon Code"
                        : "Coupon Code Already Applied"
                    }
                  >
                    <Box
                      sx={{
                        cursor:
                          coupanCodeValue && !coupanCodeApplied
                            ? "pointer"
                            : "not-allowed", // Change cursor style
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: coupanCodeValue ? "auto" : "none", // Disable clicks when no value
                      }}
                      onClick={
                        coupanCodeValue && !coupanCodeApplied
                          ? () => applyCoupanCodeMethod()
                          : undefined
                      }
                    >
                      <ForwardIcon />
                    </Box>
                  </Tooltip>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          // width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          width: { xs: "auto", sm: "100%" },
          ml: { xs: 2, sm: 10 },
          mr: { xs: 2, sm: 10 },
          pl: { xs: "0%", sm: "4%" },
        }}
      >
        {isUserLoggedIn &&
          subscriptionData?.subscription?.active_status === 1 && (
            <CertificateCountTextCartScreen
              totalCertificates={totalCertificates}
              subscriptionData={subscriptionData}
              queryCount={queryCount}
            />
          )}
      </Box>

      <Box
        sx={{
          border: "2px solid black",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          mt: 2,
          mb: 2,
          width: {
            xs: "40%",
            sm: "30%",
            md: "30%",
            lg: "25%",
          },
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography
          sx={{
            ...commonStyles.commonTextFieldsLabelStyles,
            marginBottom: "16px",
            fontWeight: "bold",
          }}
        >
          Total: $
          {bulkFormsData?.length > 0
            ? loader
              ? "Calculating"
              : totalAmount
            : 0}
        </Typography>
        <Button
          sx={{
            ...commonStyles.buttonCommonStyles,
            color: "white",
            bgcolor: "#555550",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "black",
            },
            cursor: "pointer",
            borderRadius: "40px",
          }}
          onClick={submitBulkQuery}
          disabled={bulkFormsData?.length === 0}
        >
          Checkout
        </Button>
      </Box>
      <CustomLoaderWithBackdrop
        open={loader}
        handleClose={handleCloseForLoader}
      />
    </Box>
  );
};

export default CartPage;
