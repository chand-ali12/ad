import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import checkoutPage from "../../public/checkoutPage.jpeg";
import { commonStyles } from "@/commonStyles";
import axiosInstance from "../../utils/api/axios-client";
import {
  AUTHENTICITY_CARDS_CHNAGE_STATUS,
  BRAINTREE_FOR_VALUATION,
  CHECKOUT_BRAINTREE,
  GET_PRICE_BULK_CASE,
} from "../../utils/api/constants";
import { notifyError, notifySuccess } from "../../utils/toast";

import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import Layout from "@/components/layout";

export default function Checkout() {
  const seo = {
    title: "Checkout",
    description: "products payment details",
  };

  const userInfo = useSelector(currentUserInformation);

  const router = useRouter();
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [pageRequestedName, setPageRequestedName] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { firstName: "", lastName: "" },
  });

  useEffect(() => {
    if (router.isReady) {
      const { data: encodedData, page } = router.query;
      setPageRequestedName(page);
      // debugger;
      if (encodedData) {
        const parsedData = JSON.parse(decodeURIComponent(encodedData));
        setData(parsedData);
        console.log("Received Data:", parsedData);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (data) {
      loadScript(
        "https://js.braintreegateway.com/web/dropin/1.36.0/js/dropin.min.js"
      )
        .then(() => {
          braintree.dropin.create(
            {
              authorization: data.token,
              container: "#braintree-container",
              card: { cardholderName: false },
              paypal: {
                flow: "vault",
              },
            },
            (err, instance) => {
              if (err) {
                console.error("Braintree initialization error:", err);
                return;
              }
              setBraintreeInstance(instance);
            }
          );
        })
        .catch((err) => console.error("Failed to load Braintree script:", err));
    }
  }, [data]);

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  console.log("dataaaa", data);

  // Handle form submission
  const onSubmit = async (formData) => {
    setLoader(true);
    if (braintreeInstance) {
      try {
        const { nonce: payment_method_nonce } =
          await braintreeInstance.requestPaymentMethod();

        const bodydata = {
          _token: data.token,
          first_name: formData.firstName,
          last_name: formData.lastName,
          id: data.id,
          query_type: data?.query_type,
          payment_method_nonce,
          amount: data?.amount,
          order_number: data?.order_number,
          queries_count: data?.queries_count,
          ...(Object.keys(userInfo).length > 0 && {
            user_id: userInfo?.user?.id,
          }),
          encrypt_amount: data?.encryptedAmount,
          ...(data?.coupon_code && { coupon_code: data?.coupon_code }),
        };

        const endpoint =
          pageRequestedName === "auth-cards"
            ? AUTHENTICITY_CARDS_CHNAGE_STATUS
            : pageRequestedName === "valuation-page"
            ? BRAINTREE_FOR_VALUATION
            : CHECKOUT_BRAINTREE;

        const response = await axiosInstance.post(endpoint, bodydata, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.status_code != 401) {
          notifySuccess(response.data.msg);
          router.push("/");
        } else {
          notifyError(response.data.msg || "Payment failed");
        }
      } catch (error) {
        notifyError(`Payment Error:${error.message}`);
      }
    } else {
      notifyError("Braintree instance not initialized.");
    }
    setLoader(false);
  };

  // if (!data) return <p>Loading...</p>;

  return (
    <>
      <Layout seo={seo}>
        <Grid container spacing={2} sx={{ padding: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Checkout
              {/* <span>{`(${data?.amount} $)`}</span> */}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />

              <Box id="braintree-container" sx={{ marginY: 2 }}></Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "start" },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    ...commonStyles.buttonCommonStyles,
                    padding: {
                      xs: "12px 30px",
                      sm: "8px 15px",
                      md: "8px 22px",
                      lg: "10px 28px",
                      xl: "10px 33px",
                    },
                    fontSize: {
                      xs: "14px",
                      sm: "14px",
                      md: "16px",
                      lg: "18",
                      xl: "20px",
                    },
                    fontWeight: "600",
                    width: { xs: "auto", sm: "30%" },
                  }}
                  disabled={Object.keys(errors).length > 0}
                  color="success"
                >
                  {loader ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "white" }}
                      thickness={5}
                    />
                  ) : (
                    `Pay $${data?.amount}`
                  )}
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}
