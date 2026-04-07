import {
  Box,
  Card,
  Grid,
  Modal,
  Button,
  Tooltip,
  Dialog,
  Checkbox,
  Container,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { commonStyles } from "@/commonStyles";
import axiosInstance from "../../../utils/api/axios-client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  CANCEL_SUBSCRIPTION,
  CREATE_SUBSCRIPTION,
  GET_ALL_PLANS,
  GET_SUBSCRIPTION,
} from "../../../utils/api/constants";
import { currentUserInformation } from "@/store/slice/userData";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PremiumBrandsModal from "@/common-components/premium-brands-modal";
export default function SubscriptionsPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const userInfo = useSelector(currentUserInformation);
  const handleCloseForLoader = () => {};
  const [plansData, setPlansData] = useState();
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Checkbox state
  const [selectedPlanID, setSelectedPlanID] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [upgradeSubscriptionState, setUpgradeSubscriptionState] =
    useState(false);
  const [premiumBrandsInfo, setPremiumBrandsInfo] = useState(false);
  const [modalSubmitButtonLoader, setModalSubmitButtonLoader] = useState(false);

  const handleClosePremiumBrandsInfoModal = () => {
    setPremiumBrandsInfo(false);
  };
  const handleOpenPremiumBrandsInfoModal = () => {
    setPremiumBrandsInfo(true);
  };
  const isUserLoggedIn = Object.keys(userInfo)?.length > 0;

  const handleCloseModalConfirmation = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (router.isReady && router?.query?.success) {
      notifySuccess(router.query.success);
    } else if (router.isReady && router?.query?.error) {
      notifyError(router?.query?.error);
    }
  }, [router.isReady, router.query.success]);

  // useEffect(() => {
  //   if (Object.keys(userInfo)?.length > 0) {
  //     getSubscriptionData();
  //   }
  // }, []);

  const getSubscriptionData = async () => {
    try {
      const response = await axiosInstance.get(GET_SUBSCRIPTION);

      if (response?.data?.data) {
        setSubscriptionData(response?.data?.data);
        await getPlansData();
      } else if (!response?.data?.data) {
        await getPlansData();
      }
    } catch (error) {
      notifyError(error.toString());
    }
    setLoader(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return formattedDate.toLocaleDateString("en-GB", options);
  };

  const formatDateWithoutDate = (dateString) => {
    if (!dateString) return "";

    const [year, month] = dateString.split("-").map(Number);

    // Create a new date object with the provided year and month
    const formattedDate = new Date(year, month - 1); // Day is not required

    // Updated options to only show the month and year
    const options = { month: "long", year: "numeric" };

    // Return the formatted date in "Month Year" format
    return formattedDate.toLocaleDateString("en-GB", options);
  };

  console.log("subscriptionData", subscriptionData);

  const getPlansData = async () => {
    try {
      const __url_get_plans = GET_ALL_PLANS + '?old_inclusive=web_yes_next';
      const response = await axiosInstance.get(__url_get_plans);
      const responseData = response?.data?.data.reverse();
      setPlansData(responseData);
    } catch (error) {
      notifyError(error.toString());
    }
    setLoader(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isUserLoggedIn) {
        await getSubscriptionData();
      } else {
        await getPlansData();
      }
    };
    fetchData();

    // if (!subscriptionData) {
    //   getPlansData();
    // }
  }, []);

  const handleOpenModal = (planID) => {
    setSelectedPlanID(planID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCheckboxChecked(false);
  };

  const handleCheckboxChange = (event) =>
    setIsCheckboxChecked(event.target.checked);

  const handleSubmit = async () => {
    if (Object.keys(userInfo)?.length > 0) {
      setModalSubmitButtonLoader(true);
      setLoader(true);
      const data = { plan_id: selectedPlanID };

      try {
        const response = await axiosInstance.post(CREATE_SUBSCRIPTION, data);

        if (response?.data) {
          if (response?.data?.msg) {
            notifySuccess(response?.data?.msg);
            window.location.href = response?.data?.data?.url;
          }
        } else if (
          response?.data?.status_code === "401" ||
          response?.data?.status === false
        ) {
          notifyError(response?.data?.msg);
        }
      } catch (error) {
        notifyError(
          error?.code === "ERR_NETWORK"
            ? "Please connect to the internet first."
            : error.toString()
        );
      }
      setModalSubmitButtonLoader(false);
      setLoader(false);
      handleCloseModal();
    } else {
      notifyError("Please Login First to subscribe");
      router.push("/login");
    }
  };

  const CancelSubscription = async () => {
    try {
      const response = await axiosInstance.post(CANCEL_SUBSCRIPTION);

      if (response?.data) {
        notifySuccess(response?.data?.msg);
        setUpgradeSubscriptionState(false);
        setSubscriptionData(null);
        handleCloseModalConfirmation();
      } else if (
        response?.data?.status_code == "401" ||
        response?.data?.status == false
      ) {
        // notifyError("User already exists");
        notifyError(response?.data?.msg);
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect  internet first ");
      } else {
        notifyError(error.toString());
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#FAF9F6", minHeight: "90vh", py: 5 }}>
      <Container maxWidth="lg">
        {upgradeSubscriptionState && (
          <KeyboardBackspaceIcon
            sx={{
              width: "40px",
              height: "30px",
              cursor: "pointer",

              mt: -3,
            }}
            onClick={() => setUpgradeSubscriptionState(false)}
          />
        )}
        <Typography
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4,
            ...commonStyles.commonHeadingStyles,
          }}
        >
          Subscriptions
        </Typography>
        <Typography
          textAlign={{ xs: "left", sm: "center" }}
          sx={{ mb: 2, ...commonStyles.commonTextStyles }}
        >
          {`Enjoy up to 15% off authentication requests with our subscriptions!`}
        </Typography>

        <Grid container mb={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: { xs: "left", sm: "center" },
                ...commonStyles.commonTextStyles,
              }}
            >
              <Typography sx={{ ...commonStyles.commonTextStyles, mb: 2 }}>
                Our subscription plans{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  do not
                </Box>{" "}
                include premium{" "}
                <Box
                  component="span"
                  sx={{ display: "inline-flex", alignItems: "center" }}
                >
                  brands
                  <Tooltip
                    title="More information about the model"
                    sx={{ bgcolor: "red" }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleOpenPremiumBrandsInfoModal}
                      sx={{
                        ml: 0.5,
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
                      <HelpOutlineIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                , valuations, or jewelry.
              </Typography>
              <Typography
                sx={{ ...commonStyles.commonTextStyles, fontWeight: "bold", marginTop: "15px"}}
              >
                Note: Any leftover credits do not roll over. Please choose the lower tier
                if you are between two tiers.
              </Typography>
              <Typography
                sx={{ ...commonStyles.commonTextStyles, mt: 1, fontWeight: "bold" }}
              >
                {`You will be able to purchase additional requests at a discounted price if you run out of credits.`}
              </Typography>
              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  mt: 1,

                  fontWeight: "bold",
                }}
              >
                {`If you plan to upgrade your subscription please make sure that all of the credits in your old subscription are used. Credits do not transfer.`}
              </Typography>
              <PremiumBrandsModal
                open={premiumBrandsInfo}
                handleClosePremiumBrandsInfoModal={
                  handleClosePremiumBrandsInfoModal
                }
              />
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 6 }}
        >
          {subscriptionData && !upgradeSubscriptionState ? (
            <>
              {plansData?.map((plan) => (
                <>
                  {plan?.plan_id === subscriptionData?.package?.plan_id && (
                    <Grid item xs={12} sm={6} md={4} key={plan.title}>
                      <Card
                        sx={{
                          maxWidth: { xs: 320, sm: 350 },
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "visible",
                          height: "100%",
                          mt: 1,
                          mx: "auto",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: plan.color_code,
                            color: "white",
                            pb: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            borderRadius: "10px",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "end" }}>
                            <Box
                              sx={{
                                backgroundColor: "blue",
                                pl: 1,
                                pr: 1,
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontSize: {
                                    xs: "10px",
                                    sm: "12px",
                                    md: "12px",
                                    lg: "12px",
                                    xl: "16px",
                                  },
                                  py: "2px",
                                }}
                              >
                                ACTIVE
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: -0.9,
                            }}
                          >
                            <Typography
                              sx={{
                                ...commonStyles.commonTextFieldsLabelStyles,
                                color: "black",
                              }}
                            >
                              {plan.name}
                            </Typography>
                          </Box>
                        </Box>

                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: 300,
                          }}
                        >
                          <Box>
                            {plan.additional_features.map((feature, index) => {
                              const tooltipId = `${plan.plan_id}-${index}`;
                              return (
                                <Box
                                  key={index}
                                  display="flex"
                                  alignItems="center"
                                  mb={1}
                                >
                                  <CheckCircleIcon
                                    sx={{ color: "#044FB0", mr: 1 }}
                                  />
                                  <Typography
                                    sx={{
                                      ...commonStyles.applyFontFamily,
                                      // fontSize: { xs: "14px", sm: "16px" },
                                    }}
                                  >
                                    {feature?.title}
                                    {(feature?.title.includes("Concierge") ||
                                      feature?.title.includes("Priority")) && (
                                      <Tooltip
                                        title={
                                          feature?.title.includes("Concierge")
                                            ? "You will receive your own support email where you can speak with an authentication specialist at any time."
                                            : "Receive quicker turnaround times with priority authentication! We will complete all of your authentications on average within 6 hours. Exceptions may apply."
                                        }
                                        open={tooltipOpen === tooltipId}
                                        onClose={() => setTooltipOpen(null)}
                                        disableHoverListener
                                        arrow
                                        sx={{
                                          ...commonStyles.fontFamilyProject,
                                          maxWidth: 200,
                                          padding: 1,
                                          whiteSpace: "normal",
                                          textAlign: "center",
                                        }}
                                      >
                                        <HelpOutlineIcon
                                          sx={{
                                            ml: 1,
                                            fontSize: 24,
                                            color: "text.secondary",
                                            ...commonStyles.commonTextStyles,
                                            height: { xs: 18, md: 22 },
                                            width: { xs: 18, md: 22 },
                                          }}
                                          onMouseEnter={() =>
                                            setTooltipOpen(tooltipId)
                                          }
                                          onMouseLeave={() =>
                                            setTooltipOpen(null)
                                          }
                                          onClick={() =>
                                            setTooltipOpen(
                                              tooltipOpen === tooltipId
                                                ? null
                                                : tooltipId
                                            )
                                          }
                                          onTouchEnd={(e) => {
                                            e.preventDefault();
                                            setTooltipOpen(
                                              tooltipOpen === tooltipId
                                                ? null
                                                : tooltipId
                                            );
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>

                          {/* <Box display="flex" alignItems="center" mb={1}>
                            <CheckCircleIcon sx={{ color: "#044FB0", mr: 1 }} />
                            <Typography
                              sx={{
                                ...commonStyles.applyFontFamily,
                              }}
                            >
                              Starting Date{" "}
                              <strong>
                                {subscriptionData?.subscription.starting_date}
                              </strong>
                            </Typography>
                          </Box> */}

                          <Box display="flex" alignItems="center" mb={1}>
                            {/* <CheckCircleIcon sx={{ color: "#044FB0", mr: 1 }} /> */}
                            <Typography
                              sx={{
                                ...commonStyles.applyFontFamily,
                              }}
                            >
                              Next Payment :{" "}
                              <strong>
                                {formatDate(
                                  subscriptionData?.subscription.ending_date
                                )}
                              </strong>
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" mb={1}>
                            {/* <CheckCircleIcon sx={{ color: "#044FB0", mr: 1 }} /> */}
                            <Typography
                              sx={{
                                ...commonStyles.applyFontFamily,
                              }}
                            >
                              Remaining Requests :{" "}
                              <strong>
                                {
                                  subscriptionData?.subscription
                                    .remaining_certificates
                                }
                              </strong>
                            </Typography>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            mb={1}
                            sx={{
                              backgroundColor: "#044fb0",
                              ml: "-16px",
                              py: 1,
                              borderRadius: "0px 16px 16px 0px",
                              justifyContent: "left",
                            }}
                          >
                            {/* <CheckCircleIcon sx={{ color: "#044FB0", mr: 1 }} /> */}
                            <Typography
                              sx={{
                                ...commonStyles.applyFontFamily,
                                color: "white",
                                ml: "16px",
                                fontSize: "0.9rem",
                              }}
                            >
                              {/* <strong> */}
                              Member since{" "}
                              {formatDateWithoutDate(
                                subscriptionData?.subscription.starting_date
                              )}
                              {/* </strong> */}
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                              variant="contained"
                              sx={{
                                ...commonStyles.buttonWithBlackColor,
                                backgroundColor: "darkred",
                                color: "white",
                              }}
                              onClick={() => setOpenModal(true)}
                            >
                              Cancel
                            </Button>
                            <Button
                              sx={{
                                ...commonStyles.buttonWithBlackColor,
                                backgroundColor: "#044FB0",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#044FB0",
                                  color: "white",
                                },
                              }}
                              variant="contained"
                              color="primary"
                              // disabled={!isCheckboxChecked}
                              onClick={() => setUpgradeSubscriptionState(true)}
                            >
                              Upgrade
                            </Button>
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              ...commonStyles.fontFamilyProject,
                              mt: 2,
                              color: "text.secondary",
                              textAlign: "center",
                              fontSize: { xs: "9px", fontWeight: "bold" },
                            }}
                          >
                            {plan.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              ))}
            </>
          ) : (
            <>
              {plansData?.filter(plan => plan.show == true)?.map((plan) => (
                <>
                  {upgradeSubscriptionState ? (
                    <>
                      {/* {plan?.plan_id != subscriptionData?.package?.plan_id && ( */}
                      <Grid item xs={12} sm={6} md={3} key={plan.title}>
                        <Card
                          sx={{
                            maxWidth: 320,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            overflow: "visible",
                            height: "100%",
                            mt: 1,
                            mx: "auto",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: plan.color_code,
                              color: "white",
                              py: 1.5,
                              textAlign: "center",
                              borderTopLeftRadius: 4,
                              borderTopRightRadius: 4,
                              borderRadius: "10px",
                            }}
                          >
                            <Typography
                              sx={{
                                ...commonStyles.commonTextFieldsLabelStyles,
                                color: "black",
                              }}
                            >
                              {plan.name}
                            </Typography>
                          </Box>

                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              minHeight: 300,
                            }}
                          >
                            <Box>
                              {plan.additional_features.map(
                                (feature, index) => {
                                  const tooltipId = `${plan.plan_id}-${index}`;
                                  return (
                                    <Box
                                      key={index}
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                    >
                                      <CheckCircleIcon
                                        sx={{ color: "#044FB0", mr: 1 }}
                                      />
                                      <Typography
                                        sx={{
                                          ...commonStyles.applyFontFamily,
                                          // fontSize: { xs: "14px", sm: "16px" },
                                        }}
                                      >
                                        {feature?.title}
                                        {(feature?.title.includes(
                                          "Concierge"
                                        ) ||
                                          feature?.title.includes(
                                            "Priority"
                                          )) && (
                                          <Tooltip
                                            title={
                                              feature?.title.includes(
                                                "Concierge"
                                              )
                                                ? "You will receive your own support email where you can speak with an authentication specialist at any time."
                                                : "Receive quicker turnaround times with priority authentication! We will complete all of your authentications on average within 6 hours. Exceptions may apply."
                                            }
                                            open={tooltipOpen === tooltipId}
                                            onClose={() => setTooltipOpen(null)}
                                            disableHoverListener
                                            arrow
                                            sx={{
                                              ...commonStyles.fontFamilyProject,
                                              maxWidth: 200,
                                              padding: 1,
                                              whiteSpace: "normal",
                                              textAlign: "center",
                                            }}
                                          >
                                            <HelpOutlineIcon
                                              sx={{
                                                ml: 1,
                                                fontSize: 24,
                                                color: "text.secondary",
                                                ...commonStyles.commonTextStyles,
                                                height: { xs: 18, md: 22 },
                                                width: { xs: 18, md: 22 },
                                              }}
                                              onMouseEnter={() =>
                                                setTooltipOpen(tooltipId)
                                              }
                                              onMouseLeave={() =>
                                                setTooltipOpen(null)
                                              }
                                              onClick={() =>
                                                setTooltipOpen(
                                                  tooltipOpen === tooltipId
                                                    ? null
                                                    : tooltipId
                                                )
                                              }
                                              onTouchEnd={(e) => {
                                                e.preventDefault();
                                                setTooltipOpen(
                                                  tooltipOpen === tooltipId
                                                    ? null
                                                    : tooltipId
                                                );
                                              }}
                                            />
                                          </Tooltip>
                                        )}
                                      </Typography>
                                    </Box>
                                  );
                                }
                              )}
                            </Box>

                            <Button
                              variant="contained"
                              color="primary"
                              sx={{
                                ...commonStyles.buttonCommonStyles,
                                mt: "auto",
                                color: "white",
                                textTransform: "none",
                                backgroundColor: "#044FB0 ",
                                ":hover": { backgroundColor: "#133E87" },
                              }}
                              onClick={() => handleOpenModal(plan?.plan_id)}
                            >
                              <Typography
                                sx={{
                                  fontSize: {
                                    xs: "14px",
                                    sm: "14px",
                                    md: "16px",
                                    lg: "18",
                                    xl: "20px",
                                  },
                                  fontWeight: "bold",
                                  ...commonStyles.fontFamilyProject,
                                }}
                              >
                                {`$${plan.price}`}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: "12px", md: "14px" },
                                  ...commonStyles.fontFamilyProject,
                                }}
                              >
                                /month*
                              </Typography>
                            </Button>

                            <Typography
                              variant="caption"
                              sx={{
                                ...commonStyles.fontFamilyProject,
                                mt: 2,
                                color: "text.secondary",
                                textAlign: "center",
                                fontSize: { xs: "9px", fontWeight: "bold" },
                              }}
                            >
                              {plan.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      {/* )} */}
                    </>
                  ) : (
                    <Grid item xs={12} sm={6} md={3} key={plan.title}>
                      <Card
                        sx={{
                          maxWidth: 320,
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "visible",
                          height: "100%",
                          mt: 1,
                          mx: "auto",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: plan.color_code,
                            color: "white",
                            py: 1.5,
                            textAlign: "center",
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            borderRadius: "10px",
                          }}
                        >
                          <Typography
                            sx={{
                              ...commonStyles.commonTextFieldsLabelStyles,
                              color: "black",
                            }}
                          >
                            {plan.name}
                          </Typography>
                        </Box>

                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: 300,
                          }}
                        >
                          <Box>
                            {plan.additional_features.map((feature, index) => {
                              const tooltipId = `${plan.plan_id}-${index}`;
                              return (
                                <Box
                                  key={index}
                                  display="flex"
                                  alignItems="center"
                                  mb={1}
                                >
                                  <CheckCircleIcon
                                    sx={{ color: "#044FB0", mr: 1 }}
                                  />
                                  <Typography
                                    sx={{
                                      ...commonStyles.applyFontFamily,
                                      // fontSize: { xs: "14px", sm: "16px" },
                                    }}
                                  >
                                    {feature?.title}
                                    {(feature?.title.includes("Concierge") ||
                                      feature?.title.includes("Priority")) && (
                                      <Tooltip
                                        title={
                                          feature?.title.includes("Concierge")
                                            ? "You will receive your own support email where you can speak with an authentication specialist at any time."
                                            : "Receive quicker turnaround times with priority authentication! We will complete all of your authentications on average within 6 hours. Exceptions may apply."
                                        }
                                        open={tooltipOpen === tooltipId}
                                        onClose={() => setTooltipOpen(null)}
                                        disableHoverListener
                                        arrow
                                        sx={{
                                          ...commonStyles.fontFamilyProject,
                                          maxWidth: 200,
                                          padding: 1,
                                          whiteSpace: "normal",
                                          textAlign: "center",
                                        }}
                                      >
                                        <HelpOutlineIcon
                                          sx={{
                                            ml: 1,
                                            fontSize: 24,
                                            color: "text.secondary",
                                            ...commonStyles.commonTextStyles,
                                            height: { xs: 18, md: 22 },
                                            width: { xs: 18, md: 22 },
                                          }}
                                          onMouseEnter={() =>
                                            setTooltipOpen(tooltipId)
                                          }
                                          onMouseLeave={() =>
                                            setTooltipOpen(null)
                                          }
                                          onClick={() =>
                                            setTooltipOpen(
                                              tooltipOpen === tooltipId
                                                ? null
                                                : tooltipId
                                            )
                                          }
                                          onTouchEnd={(e) => {
                                            e.preventDefault();
                                            setTooltipOpen(
                                              tooltipOpen === tooltipId
                                                ? null
                                                : tooltipId
                                            );
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>

                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              ...commonStyles.buttonCommonStyles,
                              mt: "auto",
                              color: "white",
                              textTransform: "none",
                              backgroundColor: "#044FB0 ",
                              ":hover": { backgroundColor: "#133E87" },
                            }}
                            onClick={() => handleOpenModal(plan?.plan_id)}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "14px",
                                  sm: "14px",
                                  md: "16px",
                                  lg: "18",
                                  xl: "20px",
                                },
                                fontWeight: "bold",
                                ...commonStyles.fontFamilyProject,
                              }}
                            >
                              {`$${plan.price}`}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "12px", md: "14px" },
                                ...commonStyles.fontFamilyProject,
                              }}
                            >
                              /month*
                            </Typography>
                          </Button>

                          <Typography
                            variant="caption"
                            sx={{
                              ...commonStyles.fontFamilyProject,
                              mt: 2,
                              color: "text.secondary",
                              textAlign: "center",
                              fontSize: { xs: "9px", fontWeight: "bold" },
                            }}
                          >
                            {plan.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </>
              ))}
            </>
          )}
        </Grid>

        {/*<Box
          sx={{
            textAlign: { xs: "left", sm: "center" },
            ...commonStyles.commonTextStyles,
          }}
        >

        </Box>*/}

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              mx: "auto",
              mt: 10,
              borderRadius: 2,
              boxShadow: 24,
              width: { xs: 300, sm: 350, md: 550 },
            }}
          >
            <Typography
              align="center"
              sx={{
                mb: 2,
                ...commonStyles.modalHeading,
                fontWeight: "bold",
              }}
            >
              Important Information
            </Typography>
            <Typography
              sx={{
                mb: 3,
                ...commonStyles.modalText,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              {`  Our subscription plans do not include premium brands (Chanel,
              Hermes, Tiffany & Co), valuations, or jewelry. Any leftover
              credits do not roll over. Please choose the lower tier if you are
              in between two tiers, as you may add additional requests at the
              discounted price`}
              .
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCheckboxChecked}
                  onChange={handleCheckboxChange}
                />
              }
              label={
                <Typography component="span" sx={{ ...commonStyles.modalText }}>
                  I acknowledge the{" "}
                  <Link
                    href="/privacy-policy"
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      component="span"
                      color="primary"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                        ...commonStyles.fontFamilyProject,
                      }}
                    >
                      Privacy Policy
                    </Typography>
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms-of-service"
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      component="span"
                      color="primary"
                      style={{
                        textDecoration: "none",
                        cursor: "pointer",
                        ...commonStyles.fontFamilyProject,
                      }}
                    >
                      Terms of Service
                    </Typography>
                  </Link>{" "}
                  of the subscription plans.
                </Typography>
              }
              sx={{ display: "block", textAlign: "center", mb: 2 }}
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                sx={{ ...commonStyles.buttonWithBlackColor }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  ...commonStyles.buttonWithBlackColor,
                  "&:hover": {
                    backgroundColor: "#044FB0",
                    color: "white",
                  },
                }}
                variant="contained"
                // color="primary"
                disabled={!isCheckboxChecked || modalSubmitButtonLoader}
                onClick={handleSubmit}
              >
                {modalSubmitButtonLoader ? (
                  <CircularProgress
                    size={24}
                    // sx={{ color: "white" }}
                    thickness={5}
                  />
                ) : (
                  "Continue"
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>

      <Dialog
        open={openModal}
        onClose={handleCloseModalConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          borderRadius: "20px",
          minWidth: "320px",
          boxShadow: 24,
          p: 2,
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Are you sure you want to cancel?
        </DialogTitle>

        <DialogActions
          sx={{
            justifyContent: "space-around",
            gap: 0,
            p: 1,
            // border: "1px solid red",
          }}
        >
          <Button
            onClick={handleCloseModalConfirmation}
            sx={{
              width: "40%",
              "&:hover": {
                backgroundColor: "black",
              },
              ...commonStyles.buttonWithBlackColor,
            }}
            variant="contained"
          >
            No
          </Button>

          <Button
            onClick={CancelSubscription}
            sx={{
              width: "40%",
              ...commonStyles.buttonWithBlackColor,
              "&:hover": {
                backgroundColor: "#044FB0",
                color: "white",
              },
            }}
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <CustomLoaderWithBackdrop
        open={loader}
        handleClose={handleCloseForLoader}
      />
    </Box>
  );
}
