import React, { useEffect, useState } from "react";
// React Hook Form Imports
import { useForm } from "react-hook-form";
// MUI Component Imports
import {
  Box,
  Grid,
  Select,
  Button,
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
// Hook Form Resolver Imports
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
// Custom Components and Styles
import { commonStyles } from "@/commonStyles";
import CustomErrorMessage from "@/common-commponent/error-message";
//utility imports
import { countries } from "../../../utils/countries";
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  AUTHENTICITY_CARDS_SUBMIT,
  AUTHENTICITY_CARDS_PRICING,
} from "../../../utils/api/constants";

//validation \schema import
import { AuthenticityCardsValidationSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";

const FormComponent = () => {
  const [coaFields, setCoaFields] = useState(0);
  const [coaCount, setCoaCount] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [pricingData, setPricingData] = useState([]);
  const [amount, setAmount] = useState("");

  const router = useRouter();

  const {
    handleSubmit,
    register,
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(AuthenticityCardsValidationSchema),
    defaultValues: {
      country: "US",
    },
  });

  const handleCoaCountChange = (event) => {
    const count = Number(event.target.value);
    setCoaFields(count);
    setCoaCount(count);
    updateAmount(count, selectedCountry);
  };

  const updateAmount = (count, country) => {
    const isUSA = country === "US";
    const price = calculatePrice(count, isUSA);
    setAmount(price.toFixed(2));
  };

  const calculatePrice = (count, isUSA) => {
    const type = isUSA ? 1 : 2;

    const lastQtyUSA = Math.max(
      ...pricingData.filter((item) => item.type === 1).map((item) => item.qty)
    );
    const lastQtyNonUSA = Math.max(
      ...pricingData.filter((item) => item.type === 2).map((item) => item.qty)
    );

    const lastPriceUSA = pricingData.find(
      (item) => item.type === 1 && item.qty === lastQtyUSA
    )?.amount;
    const lastPriceNonUSA = pricingData.find(
      (item) => item.type === 2 && item.qty === lastQtyNonUSA
    )?.amount;

    if (isUSA && count >= lastQtyUSA) {
      return count * lastPriceUSA;
    } else if (!isUSA && count >= lastQtyNonUSA) {
      return count * lastPriceNonUSA;
    }

    const matchingPriceData = pricingData.find(
      (item) => item.type === type && item.qty === count
    );

    if (matchingPriceData) {
      return matchingPriceData.amount;
    }

    return 0;
  };

  useEffect(() => {
    if (coaCount && coaCount > 0) {
      clearErrors("coaCount");
    }
  }, [coaCount, clearErrors]);

  useEffect(() => {
    setCoaCount("");
    setCoaFields(0);
    setAmount("");
  }, [selectedCountry]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await axiosInstance.post(AUTHENTICITY_CARDS_PRICING);
        if (response?.data?.data) {
          setPricingData(response.data.data);
        } else {
          notifyError(response?.data?.msg);
        }
      } catch (error) {
        notifyError(error.toString());
      }
    };

    fetchPricingData();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    const coaNumbers = [];

    for (let i = 0; i < data?.coaCount; i++) {
      coaNumbers.push(data[`coa_number_${i + 1}`]);
    }

    const coa_number = coaNumbers.join(",");

    const AuthenticityCardsFormData = {
      first_name: data?.firstName,
      last_name: data?.lastName,
      email: data?.email,
      state: data?.state,
      phone: data?.phone,
      street_1: data?.street1,
      street_2: data?.street2,
      country: data?.country,
      city: data?.city,
      postal_code: data?.postalCode,
      coa_count: data?.coaCount,
      // amt: data?.amount,
      amount: data?.amount,

      coa_number: coa_number,
    };
    // coaNumbers.forEach((coaNumber, index) => {
    //   AuthenticityCardsFormData[`coa_number_${index + 1}`] = coaNumber;
    // });

    try {
      const response = await axiosInstance.post(
        `${AUTHENTICITY_CARDS_SUBMIT}`,
        AuthenticityCardsFormData
      );

      if (response?.data?.data) {
        notifySuccess(response.data.msg);
        const encodedData = encodeURIComponent(
          JSON.stringify(response.data.data)
        );
        router.push({
          pathname: "/checkout",
          query: { data: encodedData, page: "auth-cards" },
        });
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
  };

  console.log("getValues", getValues());

  return (
    <Container
      sx={{
        width: "100%",
        marginTop: { xs: "22%", sm: "16%", md: "10%" },
        marginBottom: { xs: "8%", sm: "6%", md: "4%" },
      }}
    >
      <Box sx={{ mt: "5%", mb: "5%" }}>
        <Typography
          align="center"
          gutterBottom
          sx={{ ...commonStyles.commonHeadingStyles }}
        >
          Enter Detail
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              First Name
            </Typography>
            <TextField
              name="firstName"
              {...register("firstName")}
              placeholder="First Name"
              variant="outlined"
              fullWidth
            />
            {errors.firstName && (
              <CustomErrorMessage errorMessage={errors.firstName.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Last Name
            </Typography>
            <TextField
              name="lastName"
              {...register("lastName")}
              // label="Last Name"
              placeholder="Last Name"
              variant="outlined"
              fullWidth
            />
            {errors.lastName && (
              <CustomErrorMessage errorMessage={errors.lastName.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              {...register("email")}
              // label="Email"
              placeholder="Email"
              id="email"
            />
            {errors.email && (
              <CustomErrorMessage errorMessage={errors.email.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Phone
            </Typography>
            <TextField
              name="phone"
              type="text"
              {...register("phone")}
              // label="Phone"
              placeholder="Phone"
              variant="outlined"
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />

            {errors.phone && (
              <CustomErrorMessage errorMessage={errors.phone.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Street # 1
            </Typography>
            <TextField
              name="street1"
              {...register("street1")}
              // label="Street 1"
              placeholder="Street 1"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />
            {errors.street1 && (
              <CustomErrorMessage errorMessage={errors.street1.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Street # 2
            </Typography>
            <TextField
              name="street2"
              {...register("street2")}
              // label="Street 2"
              placeholder="Street 2"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />
            {/* {errors.street2 && (
              <CustomErrorMessage errorMessage={errors.street2.message} />
            )} */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Select Country
            </Typography>
            <FormControl fullWidth variant="outlined">
              {/* <InputLabel>Country</InputLabel> */}
              <Select
                name="country"
                {...register("country")}
                // label="Country"
                placeholder="Country"
                defaultValue="US"
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                }}
                value={selectedCountry}
                disabled
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
            {errors.country && (
              <CustomErrorMessage errorMessage={errors.country.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              City
            </Typography>
            <TextField
              name="city"
              {...register("city")}
              // label="City"
              placeholder="City"
              variant="outlined"
              fullWidth
            />
            {errors.city && (
              <CustomErrorMessage errorMessage={errors.city.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              State
            </Typography>
            <TextField
              name="state"
              {...register("state")}
              // label="State "
              placeholder="State"
              variant="outlined"
              fullWidth
            />
            {errors.state && (
              <CustomErrorMessage errorMessage={errors.state.message} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              color="initial"
              sx={{
                ...commonStyles.commonTextFieldsLabelStyles,
                color: "black",
                mb: 1,
              }}
            >
              Postal Code
            </Typography>
            <TextField
              name="postalCode"
              {...register("postalCode")}
              // label="Postal Code"
              placeholder="Postal Code"
              variant="outlined"
              fullWidth
            />
            {errors.postalCode && (
              <CustomErrorMessage errorMessage={errors.postalCode.message} />
            )}
          </Grid>

          <Grid
            sx={{
              width: "96%",
              marginTop: "13px",
              marginLeft: { xs: "3.5%", md: "1.5%" },
            }}
          >
            <Grid item xs={12} sm={6}>
              <Typography
                color="initial"
                sx={{
                  ...commonStyles.commonTextFieldsLabelStyles,
                  color: "black",
                  mb: 1,
                  mt: 1,
                }}
              >
                Select COA Count
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="coaCount"
                  {...register("coaCount")}
                  value={coaCount || ""}
                  onChange={(e) => {
                    handleCoaCountChange(e);
                    setCoaCount(e.target.value);
                  }}
                  displayEmpty
                  defaultValue=""
                >
                  <MenuItem value="" disabled>
                    Select COA Count
                  </MenuItem>

                  {[...Array(20)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {errors.coaCount && (
                <CustomErrorMessage errorMessage={errors.coaCount.message} />
              )}
            </Grid>
            {coaCount > 0 && (
              <Grid item xs={12} sm={6} sx={{ marginTop: "16px" }}>
                <Typography
                  color="initial"
                  sx={{
                    ...commonStyles.commonTextFieldsLabelStyles,
                    color: "black",
                    mb: 1,
                    mt: 2,
                  }}
                >
                  Amount $
                </Typography>
                <TextField
                  name="amount"
                  {...register("amount")}
                  variant="outlined"
                  fullWidth
                  // label="Amount"
                  placeholder="Amount"
                  type="text"
                  value={amount}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              {Array.from({ length: coaCount }).map((_, index) => (
                <Grid key={index} style={{ marginTop: "16px" }}>
                  <Typography
                    variant="caption"
                    color="initial"
                    sx={{ mb: 0.5 }}
                  >
                    Enter COA Number {index + 1}
                  </Typography>

                  <TextField
                    name={`coa_number_${index + 1}`}
                    {...register(`coa_number_${index + 1}`)}
                    variant="outlined"
                    fullWidth
                    placeholder={`Enter COA Number ${index + 1}`}
                    sx={{ marginTop: "0.5rem" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            sx={{
              ...commonStyles.buttonWithBlackColor,
              ...commonStyles.commonHover,
              backgroundColor: "black",
              color: "white",
              marginBottom: "2%",
              marginTop: "6%",
            }}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            variant="contained"
            type="submit"
            fullWidth
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
      </form>
    </Container>
  );
};

export default FormComponent;
