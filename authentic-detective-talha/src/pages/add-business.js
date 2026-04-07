import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";
import CustomErrorMessage from "@/common-commponent/error-message";

import { commonStyles } from "@/commonStyles";
import axiosInstance from "../../utils/api/axios-client";
import {
  ADD_A_BUSINESS,
  GET_ALL_BRANDS_WITH_CATEGORIES,
} from "../../utils/api/constants";
import { notifyError, notifySuccess } from "../../utils/toast";

import Layout from "@/components/layout";
import { countries } from "../../utils/countries";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddBusinessSchema } from "../../utils/validationSchemas/contactsUsValidationSchema";
import { useDispatch, useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import { persistUserData } from "@/store/slice/userData";

const seo = {
  title: "Add Business",
  description: "User can add his business over here ",
};
export default function Checkout() {
  const userInfo = useSelector(currentUserInformation);
  const dispatch = useDispatch();

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandsData, setBrandsData] = useState();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    mode: "onChange",

    defaultValues: {
      brands: [],
    },
    resolver: yupResolver(AddBusinessSchema),
  });

  console.log("getValues", getValues());

  useEffect(() => {
    if (selectedBrands.length > 0) {
      setValue("brands", selectedBrands, { shouldValidate: true });
    }
  }, [selectedBrands, setValue]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedBrands(typeof value === "string" ? value.split(",") : value);
  };

  const getBrandsData = async () => {
    try {
      const response = await axiosInstance.get(GET_ALL_BRANDS_WITH_CATEGORIES);

      setBrandsData(response?.data?.data?.brands);
    } catch (error) {
      notifyError(error.toString());
    }
  };
  useEffect(() => {
    getBrandsData();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    const userObject = { ...userInfo };

    try {
      const bodydata = {
        business_name: data?.businessBusiness,
        website: data?.website,
        country: data?.country,
        business_brands: selectedBrands.join(","),
      };

      const endpoint = ADD_A_BUSINESS;

      const response = await axiosInstance.post(endpoint, bodydata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      debugger;

      if (response.data.status_code != 401 && response.data.data) {
        notifySuccess(response.data.msg);
        router.push("/");
        const apiRole = { apiRole: "business-user" };

        userObject.user = { ...response.data.data };
        dispatch(persistUserData({ ...userObject, ...apiRole }));
      } else {
        notifyError(response.data.msg || "Something Went Wrong");
      }
    } catch (error) {
      notifyError(`${error.message}` || "Something Went Wrong");
    }
  };

  return (
    <>
      <Layout seo={seo}>
        <Grid
          container
          pt={{ xs: 2, sm: 5, md: 10 }}
          sx={{
            pl: { xs: 1, sm: 3 },
            pr: { xs: 1, sm: 3 },
          }}
        >
          <Grid pb={1} item xs={12} md={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "start" },
              }}
            ></Box>
            <Box pt={4} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  color: "black",
                  ...commonStyles.commonHeadingStyles,
                }}
              >
                Add a Business
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                <Typography
                  sx={{
                    ...commonStyles.commonTextFieldsLabelStyles,
                    color: " black",
                  }}
                >
                  Business Name
                </Typography>
                <TextField
                  {...register("businessBusiness")}
                  id="businessBusiness"
                  name="businessBusiness"
                  type="text"
                  margin="normal"
                  fullWidth
                  placeholder="Business Name"
                  // label="Business Name"
                  autoComplete="business"
                  autoFocus
                />

                {errors.businessBusiness && (
                  <CustomErrorMessage
                    errorMessage={errors.businessBusiness.message}
                  />
                )}
              </Box>
              <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                <Typography
                  sx={{
                    ...commonStyles.commonTextFieldsLabelStyles,
                    color: " black",
                  }}
                >
                  Website
                </Typography>
                <TextField
                  {...register("website")}
                  id="website"
                  name="website"
                  type="url"
                  margin="normal"
                  fullWidth
                  // label="Website"
                  placeholder="Website"
                />
                {errors.website && (
                  <CustomErrorMessage errorMessage={errors.website.message} />
                )}
              </Box>
              <Box pt={2} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
                <Typography
                  sx={{
                    ...commonStyles.commonTextFieldsLabelStyles,

                    color: " black",
                    mb: 2,
                  }}
                >
                  Country
                </Typography>
                <FormControl fullWidth>
                  <Select
                    labelId="country-label"
                    id="country"
                    name="country"
                    {...register("country")}
                    defaultValue=""
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Country
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.country && (
                  <CustomErrorMessage errorMessage={errors.country.message} />
                )}
              </Box>
              <Box
                pt={2}
                sx={{
                  paddingLeft: { xs: "5%", md: "0%" },
                  marginLeft: "0% !important",
                }}
              >
                <Typography
                  sx={{
                    ...commonStyles.commonTextFieldsLabelStyles,

                    color: " black",
                    mb: 2,
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
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: { xs: 200, sm: 300 },
                          width: { xs: "80%", sm: "300px" },
                        },
                      },
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return "Brands";
                      }
                      return brandsData
                        ?.filter((brand) => selected.includes(brand.brand))
                        .map((brand) => brand.brand)
                        .join(", ");
                    }}
                  >
                    {brandsData?.map((brands) => (
                      <MenuItem key={brands.brand} value={brands.brand}>
                        <Checkbox
                          checked={selectedBrands.includes(brands.brand)}
                        />
                        {brands.brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.brands && (
                  <CustomErrorMessage errorMessage={errors.brands.message} />
                )}
              </Box>

              <Box
                pt={3}
                pb={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  id="businessButton"
                  sx={{
                    ...commonStyles.buttonCommonStyles,
                    ...commonStyles.disabledButton,
                    color: "white",
                    bgcolor: "black",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "black ",
                    },
                    cursor: "pointer",
                  }}
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "white" }}
                      thickness={5}
                    />
                  ) : (
                    "Add a Business"
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
