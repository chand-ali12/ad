import React, { useEffect, useState } from "react";
// React Hook Form Imports
import { Controller, useForm } from "react-hook-form";
// MUI Component Imports
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
// Custom Components and Styles
import { commonStyles } from "@/commonStyles";
import CustomErrorMessage from "@/common-commponent/error-message";
// Hook Form Resolver Imports
import { yupResolver } from "@hookform/resolvers/yup";
// validation Schema
import { ValuationSchema } from "../../../utils/validationSchemas/contactsUsValidationSchema";
import {
  GET_ALL_BRANDS_WITH_CATEGORIES,
  SUBMIT_VALUATION_API,
} from "../../../utils/api/constants";
// SUBMIT_VALUATION_API
import axiosInstance from "../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useRouter } from "next/router";
import { COMMON_VALUE_FOR_VALUATION } from "../../../utils/commonData";

function Valuation() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [brandsData, setBrandsData] = useState();

  const getBrandsData = async () => {
    try {
      const response = await axiosInstance.get(GET_ALL_BRANDS_WITH_CATEGORIES);
      // setCategories(response?.data?.data?.category);
      setBrandsData(response?.data?.data?.brands);
    } catch (error) {
      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBrandsData();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
    trigger,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(ValuationSchema),
  });

  const onSubmit = async (data) => {
    const valuationFormData = {
      name: data?.name,
      email: data?.email,
      coa_number: data?.certificateNumber,
      ...(data?.condition && { description: data?.condition }),
      ...(data?.selectBrand && { brand: data?.selectBrand?.id }),
    };

    try {
      const response = await axiosInstance.post(
        `${SUBMIT_VALUATION_API}`,
        valuationFormData
      );

      if (response?.data?.data) {
        notifySuccess(response.data.msg);
        const encodedData = encodeURIComponent(
          JSON.stringify(response.data.data)
        );
        router.push({
          pathname: "/checkout",
          query: { data: encodedData, page: "valuation-page" },
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedBrand(value);
    setValue("selectBrand", value);
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "85vh" }}>
      <Grid>
        <Box
          sx={{ textAlign: "center", mt: { xs: "22%", sm: "14%", md: "12%" } }}
        >
          <Typography sx={{ ...commonStyles.commonHeadingStyles }} gutterBottom>
            {` What’s it worth?!`}
          </Typography>
          <Typography
            gutterBottom
            sx={{
              ...commonStyles.commonTextStyles,
              textAlign: "start",
              mt: "4%",
            }}
          >
            {` Our valuation service provides an expert assessment of your item's
            market value. Ideal for buyers and sellers, it ensures fair
            transactions and informed pricing. Our experts analyze market
            trends, comparable sales, and condition to deliver an accurate
            valuation.`}
          </Typography>
          <Typography
            gutterBottom
            sx={{
              ...commonStyles.commonTextStyles,
              textAlign: "start",
              mt: "3%",
            }}
          >
            In order to purchase this add on, a previous certificate of
            authenticity from Authentic Detective is required.
          </Typography>
          <Typography
            sx={{
              mt: 3,
              ...commonStyles.commonSubHeadingStyles,
              textAlign: "start",
              mt: "3%",
            }}
          >
            Price - ${COMMON_VALUE_FOR_VALUATION}
          </Typography>
        </Box>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{ ...commonStyles.commonTextFieldsLabelStyles, mb: 1 }}
            >
              Name
            </Typography>
            <TextField placeholder="Name" fullWidth {...register("name")} />
            {errors.name && (
              <CustomErrorMessage errorMessage={errors.name.message} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              sx={{ ...commonStyles.commonTextFieldsLabelStyles, mb: 1 }}
            >
              Email
            </Typography>
            <TextField placeholder="Email" fullWidth {...register("email")} />
            {errors.email && (
              <CustomErrorMessage errorMessage={errors.email.message} />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              sx={{ ...commonStyles.commonTextFieldsLabelStyles, mb: 1 }}
            >
              Certificate Number
            </Typography>
            <TextField
              placeholder="Certificate Number"
              fullWidth
              {...register("certificateNumber")}
            />
            {errors.certificateNumber && (
              <CustomErrorMessage
                errorMessage={errors.certificateNumber.message}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{ ...commonStyles.commonTextFieldsLabelStyles, mb: 1 }}
            >
              Select Brand
            </Typography>

            <FormControl
              fullWidth
              variant="outlined"
              // size="small"
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
                    // sx={{
                    //   height: "1.4375em",
                    //   padding: "16.5px 16px",
                    // }}
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
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid item xs={12} md={5.9}>
              <Typography
                sx={{ ...commonStyles.commonTextFieldsLabelStyles, mb: 1 }}
              >
                Condition
              </Typography>
              <TextField
                placeholder="Condition"
                fullWidth
                {...register("condition")}
                rows={3}
                multiline
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || Object.keys(errors).length > 0}
            // sx={{
            // ...commonStyles.buttonCommonStyles,
            // backgroundColor: "black",
            // color: "white",
            // mt: 3,
            // mb: 6,

            // "&:hover": {
            //   backgroundColor: "black",
            //   color: "white",
            // },
            // color: "white",
            // bgcolor: "black",
            // }}
            sx={{
              ...commonStyles.buttonWithBlackColor,
              ...commonStyles.commonHover,
              backgroundColor: "black",
              color: "white",
              marginBottom: "2%",
              marginTop: "6%",
            }}
          >
            {isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </Grid>
      </form>
    </Container>
  );
}
export default Valuation;
