import * as React from "react";
import {
  Box,
  Grid,
  Menu,
  AppBar,
  Button,
  Avatar,
  Dialog,
  Toolbar,
  Divider,
  Skeleton,
  MenuItem,
  Container,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { blue } from "@mui/material/colors";
import { deleteCookie } from "cookies-next";
import AdImage from "@/components/zingImage";
import { commonStyles } from "@/commonStyles";
import MenuIcon from "@mui/icons-material/Menu";
import { clearPersistedData } from "@/store/store";
import noImage from "../../../../public/noImage.png";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "../../../../public/svgs/logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import logo1 from "../../../../public/assets/images/logo.png";
import axiosInstance from "../../../../utils/api/axios-client";
import MoreDropDown from "../../../../public/svgs/moreDropDown";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import ManageAccountIcon from "../../../../public/svgs/manageAccount";
import ChangePasswordIcon from "../../../../public/svgs/changePassword";
import { currentUserInformation, deleteUserData } from "@/store/slice/userData";
import {
  GET_BUSINESS_PROFILE,
  GET_USER_PROFILE,
} from "../../../../utils/api/constants";
import AuthenticateNowWithoutLoginModal from "@/components/authenticate-now-modal-without-login";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
const pagess = [
  { name: "Home", link: "/" },
  { name: "Authentication", link: "/authentication" },

  // { name: "Authenticity Cards", link: "/authentic-cards" },

  { name: "Our App", link: "/ourApp" },
  { name: "Contact Us", link: "/contact-us" },
  { name: "Verify", link: "/verify-certificate" },
];

const pages = [
  { name: "Home", link: "/" },
  { name: "Authentication", link: "/authentication" },
  { name: "Verify Certificate", link: "/verify-certificate" },
  { name: "Authenticity Cards", link: "/authentic-cards" },
  { name: "Subscriptions", link: "/subscriptions" },
  { name: "Valuations", link: "/valuation-coa" },
  { name: "Our App", link: "/ourApp" },
  { name: "Contact Us", link: "/contact-us" },
  { name: "Blogs", link: "https://authenticdetective.com/blogs/" },

  // { name: "Verify", link: "/verify-certificate" },
];
function ResponsiveAppBar() {
  const userInfo = useSelector(currentUserInformation);

  const userBusinessArray = userInfo?.user?.user_business;
  console.log("userBusinessArray", userBusinessArray);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobileDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [imageData, setImageData] = useState();

  // const [loader, setLoader] = useState(true);

  const router = useRouter();

  console.log("userInfo", userInfo);

  const [
    showAuthenticateModalWithoutLogin,
    setShowAuthenticateModalWithoutLogin,
  ] = useState(false);

  const handleCloseAuthenticateModalWithoutLogin = () => {
    setShowAuthenticateModalWithoutLogin(false);
  };
  const handleAuthenticateNowButtonClick = () => {
    if (Object.keys(userInfo)?.length > 0) {
      router.push("/authentication");
      // setshowAuthenticationModalWithLogin(true);
    } else {
      setShowAuthenticateModalWithoutLogin(true);
    }
  };

  // const getUserProfile = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${GET_USER_PROFILE}?id=${userInfo?.user?.id}`
  //     );
  //     //  console.log("response: ", response);
  //     setImageData(response?.data?.additional_data || {});
  //     if (response?.data?.msg === "Session Does not exist") {
  //       // deleteCookies("noSession");
  //     }
  //   } catch (error) {
  //     notifyError(error.toString());
  //   }
  //   setLoader(false);
  // };

  // const getBusinessProfile = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${GET_BUSINESS_PROFILE}?id=${userInfo?.user?.user_business[0]?.id}`
  //     );
  //     setImageData(response?.data?.additional_data?.business || {});
  //     if (response?.data?.msg === "Session Does not exist") {
  //       // deleteCookies("noSession");
  //     }
  //   } catch (error) {
  //     notifyError(error.toString());
  //   }
  //   setLoader(false);
  // };

  // useEffect(() => {
  //   if (userInfo?.apiRole === "user") {
  //     getUserProfile();
  //   } else if (userInfo?.apiRole === "business-user") {
  //     getBusinessProfile();
  //   }
  // }, []);
  const ProfileMenu = (userInfo) => [
    {
      name: "Profile",
      icon: ManageAccountIcon,
      link: "/profile",
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      // link: userInfo?.apiRole === "user" ? "/user-edit" : "/edit-profile",
      link: "/update-profile",

      isBlue: true,
    },

    {
      name: "Receipts",
      icon: ReceiptIcon,
      link: "/receipt",
      isBlue: true,
    },
    {
      name: "Subscriptions",
      icon: SubscriptionsIcon,
      link: "/subscriptions",
      isBlue: true,
    },
    {
      name: "Add Business",
      icon: AddBusinessIcon,
      link: "/add-business",
      isBlue: true,
    },
    {
      name: "Verify Certificate",
      icon: CardMembershipIcon,
      link: "/verify-certificate",
      isBlue: true,
    },

    {
      name: "Change Password",
      icon: ChangePasswordIcon,
      link: "/update-password",
    },
    {
      name: "Log out",
      icon: LogoutIcon,
      link: "",
    },
  ];

  // const ProfileMenu = [
  //   {
  //     name: "Profile",
  //     icon: ManageAccountIcon,
  //     link: "/profile",
  //   },
  //   {
  //     name: "Settings",
  //     icon: SettingsIcon,
  //     link: "/profile",
  //   },
  //   {
  //     name: "Change Password",
  //     icon: ChangePasswordIcon,
  //     link: "/update-password",
  //   },
  //   {
  //     name: "Log out",
  //     icon: LogoutIcon,
  //     link: "",
  //   },
  // ];
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteCookies = (noSession) => {
    deleteCookie("userInfoAuthenticateDetective");
    if (!noSession?.length > 0) {
      notifySuccess("Successfully logged out");
    }
    dispatch(deleteUserData());
    handleCloseModal();
    handleClose();
    router.push("/login");
    clearPersistedData();
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMenuItemClick = (name, link) => {
    if (name === "Log out") {
      setOpenModal(true);
    } else {
      router.push(link);
    }
    handleClose();
  };

  // useEffect(() => {
  //   {
  //     userInfo?.apiRole
  //       ? userInfo?.apiRole == "user"
  //         ? getUserProfile()
  //         : userInfo?.apiRole == "business-user" && getBusinessProfile()
  //       : null;
  //   }
  // }, []);

  const menu = ProfileMenu(userInfo);

  const clearScrollHistory = (pageLink) => {
    window.history.scrollRestoration = "manual";
    window.history.replaceState(null, "", window.location.href);
    window.scrollTo(0, 0);
    router.push(pageLink).then(() => {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    });
  };

  return (
    <Box mb={{ xs: 7, sm: 10 }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#F6F3EE",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            pl: { xs: 0.5, sm: 2 },
            pr: { xs: 0.5, sm: 2 },
            pt: { xs: 0, sm: 1 },
            pb: { xs: 0, sm: 1 },
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Pages Links Grid */}
            <Grid item xs={2} md={5.5}>
              {isMobile ? (
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{ color: "black" }} // Fixed menu icon color
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: "flex" }}>
                  {pagess.map((page) =>
                    page?.name === "Authentication" &&
                      !router?.route?.includes("authentication") ? (
                      <Button
                        key={page.name}
                        onClick={handleAuthenticateNowButtonClick}
                        sx={{
                          color: "#3D2F2B",
                          textTransform: "capitalize",
                          fontSize: { md: "12px", lg: "14px" },
                        }}
                      >
                        {page.name}
                      </Button>
                    ) : (
                      <Link
                        href={page.link}
                        key={page.name}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Button
                          sx={{
                            color: "#3D2F2B",
                            textTransform: "capitalize",
                            fontSize: { md: "12px", lg: "14px" },
                            fontWeight: page.name === "Verify" ? "bold" : "",
                          }}
                        >
                          {page.name}
                        </Button>
                      </Link>
                    )
                  )}
                </Box>
              )}
            </Grid>

            {/* Logo Grid */}
            <Grid
              item
              xs={5}
              md={2.5}
              sx={{ textAlign: "end", pr: { xs: "5%", sm: "7%", md: "16%" } }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: -0,

                  mb: {
                    xs: -2.5,
                    sm: router?.pathname.includes("receipt") ? -2.5 : -3,
                    // sm: -3,
                  },
                }}
                onClick={() => clearScrollHistory("/")}
              >
                {/* <Link href={"/"}> */}
                <AdImage
                  src={logo1}
                  alt="logo"
                  style={{
                    width: isMobile ? "30px" : "50px",
                    height: isMobile ? "auto" : "64px",
                    cursor: "pointer",
                    // zIndex: "-1",
                  }}
                  fill={false}
                  layout="default"
                />
                {/* </Link> */}
              </Box>
            </Grid>

            {/* Buttons Grid */}
            <Grid
              item
              xs={5}
              md={4}
              sx={{ display: "flex", justifyContent: "end" }}
            >
              <Link
                href="https://authenticdetective.com/blogs/"
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    marginTop: "8px",
                    textTransform: "capitalize",
                    borderRadius: { xs: "5px", sm: "8px", md: "10px" },
                    mr: 1,
                    padding: {
                      xs: "6px 14px",
                      sm: "7px 15px",
                      md: "8px 22px",
                      lg: "10px 28px",
                      xl: "10px 33px",
                    },
                    display: { xs: "none", md: "block" },
                    fontSize: { xs: "9px", sm: "12px", lg: "16px" },
                    "&:hover": {
                      backgroundColor: "#292222",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    "&:active": {
                      backgroundColor: "#292222",
                    },
                  }}
                >
                  Blogs
                </Button>
              </Link>

              {Object.keys(userInfo)?.length > 0 && (
                <Link
                  href={
                    userInfo?.apiRole === "user"
                      ? "/user-edit"
                      : "/edit-profile"
                  }
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {/* <Button
                    sx={{
                      mt: { xs: "8px", lg: "10px" },
                      color: "black",
                      mr: { xs: 0, sm: 1, md: 2 },
                      textTransform: "capitalize",
                      padding: { xs: "2px 2px", sm: "4px 6px", lg: "6px 8px" },
                      textWrap: "nowrap",
                      fontSize: { xs: "9px", sm: "12px", lg: "16px" },
                      ml: { xs: "-11px", sm: 0 },
                    }}
                  >
                    Profile Settings
                  </Button> */}
                </Link>
              )}
              {Object.keys(userInfo)?.length === 0 ? (
                <Link
                  href="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      marginTop: "8px",
                      textTransform: "capitalize",
                      borderRadius: { xs: "5px", sm: "8px", md: "10px" },
                      // padding: {
                      //   xs: "4px 8px",
                      //   sm: "8px 14px",
                      //   lg: "10px 22px",
                      // },
                      padding: {
                        xs: "6px 14px",
                        sm: "7px 15px",
                        md: "8px 22px",
                        lg: "10px 28px",
                        xl: "10px 33px",
                      },
                      fontSize: { xs: "9px", sm: "12px", lg: "16px" },
                      "&:hover": {
                        backgroundColor: "#292222",
                      },
                      "&:focus": {
                        outline: "none",
                      },
                      "&:active": {
                        backgroundColor: "#292222",
                      },
                    }}
                  >
                    Sign in/Sign up
                  </Button>
                </Link>
              ) : (
                <Box
                  sx={{
                    ml: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    // mr: { xs: 0, sm: 4, md: 5, lg: 6 },
                    "&:hover": {
                      cursor: "pointer", // Optional, for visual feedback
                    },
                  }}
                  onMouseEnter={handleClick}
                // onMouseLeave={handleClose}
                >
                  {/* <Box ml={1}>
                    <Typography
                      fontWeight={"bold"}
                      sx={{
                        mt: { xs: "12px", lg: "10px" },
                        color: "black",
                        // mr: { xs: 0, sm: 1, md: 2 },
                        textTransform: "capitalize",
                        fontWeight:"bold",
                        padding: {
                          xs: "2px 2px",
                          sm: "4px 6px",
                          lg: "6px 8px",
                        },
                        textWrap: "nowrap",
                        fontSize: { xs: "6px", sm: "12px", lg: "16px" },
                        // ml: { xs: "-11px", sm: 0 },
                      }}
                    >
                      {userInfo?.user?.name}
                    </Typography>
                  </Box> */}
                  <Box
                    sx={{
                      width: { xs: "30px", sm: "50px" },
                      height: { xs: "30px", sm: "50px" },
                      mt: { xs: "3px", sm: "1px" },
                    }}
                  >
                    {/* {loader ? (
                      <Skeleton
                        variant="circular"
                        width="100%".
                        height="100%"
                        animation="wave"
                      />
                    ) : ( */}
                    <Avatar
                      src={
                        userInfo?.user?.user_business?.[0]
                          ?.business_profile_picture
                          ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessProfile/${userInfo.user.user_business[0].business_profile_picture}`
                          : userInfo?.user?.profile_picture
                            ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersProfile/${userInfo.user.profile_picture}`
                            : noImage?.src
                      }
                      sx={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    />
                  </Box>

                  <Box>
                    <IconButton
                      sx={{
                        pl: "0px !important",
                        mt: "5px",
                      }}
                    >
                      {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>
              )}
              {/* <Link
                href="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
              <Button
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    marginTop: "8px",
                    textTransform: "capitalize",
                    padding: { xs: "2px 2px", sm: "4px 6px", lg: "6px 8px" },
                    fontSize: { xs: "9px", sm: "12px", lg: "16px" },
                    "&:hover": {
                      backgroundColor: "#292222",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                    "&:active": {
                      backgroundColor: "#292222",
                    },
                  }}
                >
                  Get Started
                </Button>
              </Link> */}
            </Grid>
          </Grid>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.name}
              onClick={handleCloseNavMenu}
              sx={{
                textDecoration: "none",
              }}
            >
              {/* <Link
                href={page.link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              > */}
              {page?.name === "Authentication" &&
                !router?.route?.includes("authentication") ? (
                <Box
                  sx={{ width: "100%", cursor: "pointer" }}
                  onClick={handleAuthenticateNowButtonClick}
                >
                  <Typography sx={{ fontFamily: "var(--font-montserrat)" }}>
                    {page.name}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{ width: "100%", cursor: "pointer" }}
                  onClick={() => clearScrollHistory(page.link)}
                >
                  <Typography sx={{ fontFamily: "var(--font-montserrat)" }}>
                    {page.name}
                  </Typography>
                </Box>
              )}
              {/* </Link> */}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 1,
            sx: {
              p: 1,
              mt: 1,
              borderRadius: "10px",
            },
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                ml: 2,
                mr: 2,
                mt: -2,
                maxHeight: 450,
                display: "flex",
                flexFlow: "column wrap",
              }}
            >
              {/* {ProfileMenu.map(({ name, icon: Icon, link }, index) => (
                <Box key={index} mt={1.5} sx={{ width: "100%" }}>
                  <Box
                    p={1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#FBF9F1",
                        borderRadius: "4px",
                      },
                    }}
                    onClick={() => handleMenuItemClick(name, link)}
                  >
                    <Icon
                      sx={{
                        color: Icon === SettingsIcon ? blue[500] : "inherit",
                        fontSize: Icon === SettingsIcon && "17px",
                        ml: Icon === SettingsIcon && "-2px"
                      }}
                    />
                    &nbsp;&nbsp;
                    <Typography>{name}</Typography>
                  </Box>
                  <Divider sx={{ width: "100%" }} />
                </Box>
              ))} */}

              {menu.map(({ name, icon: Icon, link, isBlue }, index) => {
                // Hide "Subscriptions" on mobile
                if (isMobileDevice && name === "Subscriptions") {
                  return null;
                }

                // Hide "Add Business" if user already has a business
                if (name === "Add Business" && userBusinessArray?.length > 0) {
                  return null;
                }

                return (
                  <Box key={index} mt={1.5} sx={{ width: "100%" }}>
                    <Box
                      p={1}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#FBF9F1",
                          borderRadius: "4px",
                        },
                      }}
                      onClick={() => handleMenuItemClick(name, link)}
                    >
                      <Icon
                        sx={{
                          color:
                            Icon === SettingsIcon ||
                              Icon === ReceiptIcon ||
                              Icon === CardMembershipIcon ||
                              Icon === SubscriptionsIcon ||
                              Icon === AddBusinessIcon
                              ? blue[500]
                              : "inherit",
                          fontSize:
                            Icon === SettingsIcon ||
                              Icon === ReceiptIcon ||
                              Icon === CardMembershipIcon ||
                              Icon === SubscriptionsIcon
                              ? "17px"
                              : undefined,
                          ml:
                            Icon === SettingsIcon ||
                              Icon === ReceiptIcon ||
                              Icon === CardMembershipIcon ||
                              Icon === SubscriptionsIcon
                              ? "-2px"
                              : undefined,
                        }}
                      />
                      &nbsp;&nbsp;
                      <Typography sx={{ color: "black" }}>{name}</Typography>
                    </Box>
                    <Divider sx={{ width: "100%" }} />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Menu>
        <Box
          sx={{
            height: "2px",
            backgroundColor: "#cfc5b3",
            zIndex: 1,
            // mt: 10,
          }}
        ></Box>
      </AppBar>

      <React.Fragment>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            borderRadius: "20px",
            minWidth: "320px",
            boxShadow: 24,
            p: 2,
            // bgcolor: "background.paper",
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontSize: "1.5rem",
              fontWeight: "600",
              textAlign: "center",
              color: "text.primary",
              // mb: 3,
            }}
          >
            {/* Hey{" "}
    {userInfo?.name ||
      userInfo?.user?.first_name + " " + userInfo?.user?.last_name}
    <br /> */}
            Are you sure you want to logout?
          </DialogTitle>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              p: 2,
            }}
          >
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "black",
                backgroundColor: "white",

                marginTop: { xs: "-4px", md: "0px" },
                textDecoration: "none",

                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                ...commonStyles.buttonCommonStyles,
              }}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              onClick={deleteCookies}
              sx={{
                width: "10px",
                textTransform: "Capitalize",
                color: "white",
                bgcolor: "black",
                fontWeight: "600",
                fontSize: { xs: "12px", md: "16px" },
                ...commonStyles.borderRadius,
                // ...commonStyles.disabledButton,

                padding: { xs: "5px 55px", lg: "9px 80px" },
                "&:hover": {
                  backgroundColor: "black ",
                },
                marginRight: "16px",
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      {showAuthenticateModalWithoutLogin && (
        <AuthenticateNowWithoutLoginModal
          open={showAuthenticateModalWithoutLogin}
          handleClose={handleCloseAuthenticateModalWithoutLogin}
        />
      )}
    </Box>
  );
}

export default ResponsiveAppBar;
