import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Rating,
  useMediaQuery,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import { commonStyles } from "@/commonStyles";
import AdImage from "@/components/zingImage";
import Arrow2 from "../../../../public/assets/images/arrow4.png";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { FormatDateToMonthAndDate } from "../../../../utils/format-date";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import {
  REVIEW_REPLY_DELETE,
  SUBMIT_REVIEW_REPLY,
  REVIEW_DELETE,
} from "../../../../utils/api/constants";
import axiosInstance from "../../../../utils/api/axios-client";
import REV from "../../../../public/assets/images/revBg.png";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import UserProfile from "@/pages/user-profile/[id]";
export default function ReviewCard({
  reviewsData,
  userInfo,
  getUserProfile,
  apiRole = "",
  onDelete,
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [editOpen, setEditOpen] = useState({});
  const currentUserInfo = useSelector(currentUserInformation);
  const [replyFieldValue, setRreplyFieldValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [imageExpand, setImageExpand] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({
    openModal: false, id: null, deleteChoice: null
  });
  const router = useRouter();
  console.log("IN review card CURRENT USERINFO: ", currentUserInfo);
  console.log("IN review card REVIEWS DATA00: ", reviewsData);
  console.log("IN review card USERINFO 00: ", userInfo);
  console.log("IN review card API ROLE00: ", apiRole);
  const handleDeleteModalState = (Id, choice) => {
    console.log("what is id:", Id)
    console.log("what is choice:", choice)
    setDeleteModalState({ openModal: true, id: Id, deleteChoice: choice });
  }
  const handleCloseDeleteModalState = () => { setDeleteModalState({ openModal: null, id: null, deleteChoice: null }); }
  const handleImageExpand = (index) => setImageExpand(index);
  const handleImageClose = () => { setImageExpand(null) };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleEditOpen = (itemId) => {
    setEditOpen((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId], // Toggle the specific item's edit state
    }));
    // console.log("reply edit item id: ", itemId)
    // console.log("reply edit item id: ", editOpen)
  };
  const handleResetEdit = (itemId) => {
    setEditOpen((prevState) => ({
      ...prevState,
      [itemId]: false, // Reset the specific item's edit state to false
    }));
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await axiosInstance.post(REVIEW_DELETE, { id: id });
      // console.log("Response of REVIEW_DELETE: ", response);
      if (response?.data?.status) {
        notifySuccess("The reply has been deleted Successfully!");
        onDelete();
        getUserProfile();
      } else {
        throw new Error(response.data.message || "Error submitting reply");
      }
    } catch (error) {
      notifyError(error.toString());
    }
  };

  const handleDeleteReviewReply = async (id) => {
    // console.log("DELETE ID: ", id);
    try {
      const response = await axiosInstance.post(REVIEW_REPLY_DELETE, {
        id: id,
      });
      // console.log("Response of DELETE: ", response);
      if (response?.data?.status) {
        notifySuccess("The reply has been deleted Successfully!");
        getUserProfile();
      } else {
        throw new Error(response.data.message || "Error submitting reply");
      }
    } catch (error) {
      notifyError(error.toString());
    }
  };
  const handleSubmit = async (e, reviewsData, index) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reply = formData.get("reply");
    const reviewId = reviewsData[index]?.id;

    try {
      const response = await axiosInstance.post(SUBMIT_REVIEW_REPLY, {
        review_reply: reply,
        id: reviewId,
      });
      // console.log("response of review reply submission API: ", response)
      if (response.data.status) {
        notifySuccess("Reply submitted successfully!");
        handleResetEdit(reviewId);
        getUserProfile();
      } else {
        throw new Error(
          response.data.msg ||
          response.data.additionalMsg ||
          "Error submitting reply"
        );
      }
    } catch (error) {
      notifyError(error.toString());
    }
  };

  let isFirstDisplay = true;

  return (
    <Box
      sx={{
        mt: { xs: 2, md: 3, lg: 4 },
        p: 2,
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", lg: "60%" },
          // padding: 2,
          mb: { xs: 0, md: 2 },
        }}
      >
        {/* {console.log("userInfo of review: ", userInfo)} */}
        {reviewsData?.map((item, index) => {
          const shouldDisplayBlock =
            apiRole === "user" && (!userInfo?.business_name || isFirstDisplay);
          if (userInfo?.business_name && isFirstDisplay) {
            isFirstDisplay = false;
          }
          return (
            <>
              {console.log("item: ", item)}
              {shouldDisplayBlock && (
                <Box
                  sx={{
                    width: { xs: "100%", lg: "60%" },
                    mb: 1,
                    mt: 2,
                    display: "flex",
                    textAlign: "start",
                  }}
                >
                  <Typography
                    className="ReplyFrom"
                    sx={{
                      fontWeight: "bold",
                      color: "#0073e6",
                      fontWeight: "700",
                      fontFamily: "var(--font-montserrat)",
                      fontSize: {
                        xs: "11px",
                        sm: "16px",
                        md: "14px",
                        lg: "16px",
                        xl: "18px",
                      },
                      lineHeight: {
                        xs: "12px",
                        sm: "22px",
                        md: "34px",
                        lg: "38px",
                        xl: "42px",
                      },
                    }}
                  >
                    {console.log("reviews slug", item)}
                    <span style={{ color: "black" }}>Reviews of</span>{" "}
                    <Link
                      href={item?.business?.slug
                        ? `/business-profile/${item?.business?.slug}`
                        : `/business-profile/${userInfo?.slug}`}
                      sx={{ color: "#0073e6" }}
                    >
                      {userInfo?.business_name
                        ? userInfo?.business_name
                        : item?.business?.business_name}
                    </Link>
                  </Typography>
                </Box>
              )}
              {/* {console.log("ITEM ID : ", item?.user_id == currentUserInfo?.user?.id)} */}

              <Box
                sx={{ display: "flex", alignItems: "center", mb: 1, mt: 1.5 }}
              >
                <Avatar
                  alt="User Avatar"
                  src={
                    item?.user?.profile_picture
                      ? `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/usersProfile/${item?.user?.profile_picture}`
                      : router.pathname.includes("business-profile") // Check if the route contains 'business-profile'
                        ? REV
                        : `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/businessProfile/${item?.business?.business_profile_picture}`
                  }
                  sx={{
                    width: { xs: 30, lg: 50 },
                    height: { xs: 30, lg: 50 },
                    mr: 2,
                  }}
                />
                <Box>
                  {console.log("item is: ", item)}
                  <Link
                    style={{ textDecoration: "none" }}
                    href={currentUserInfo?.user ? `/user-profile/${item?.user?.id}` : ""}
                    onClick={(event) => {
                      if (!currentUserInfo?.user) {
                        event.preventDefault(); // Prevents navigation if currentUserInfo is falsy
                        setOpenModal(true);
                      }
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#0073e6",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                          md: "14px",
                          lg: "16px",
                          xl: "18px",
                        },
                        lineHeight: {
                          xs: "12px",
                          sm: "28px",
                          md: "34px",
                          lg: "38px",
                          xl: "42px",
                        },
                      }}
                    >
                      {item?.user?.name}
                    </Typography>
                  </Link>
                  {/* <React.Fragment> */}
                  <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    BackdropProps={{
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                    }}
                    sx={{
                      borderRadius: "20px",
                      minWidth: "320px",
                      boxShadow: 1,
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
                      You must be logged in to view this profile
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
                      <Link href="/login" underline="hover">
                        <Button
                          autoFocus
                          variant="contained"
                          // onClick={deleteCookies}
                          sx={{
                            // width: "11px",
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
                          Sign In
                        </Button>
                      </Link>
                    </DialogActions>
                  </Dialog>
                  {/* </React.Fragment> */}

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: {
                        xs: "11px",
                        sm: "15px",
                        md: "16px",
                        lg: "16px",
                        xl: "18px",
                      },
                      lineHeight: {
                        xs: "14px",
                        sm: "15px",
                        md: "16px",
                        lg: "16px",
                        xl: "18px",
                      },
                      fontWeight: "400",
                    }}
                  >
                    {FormatDateToMonthAndDate(item?.updated_at)}
                  </Typography>
                </Box>
              </Box>

              {/* Rating */}
              <Box
                className="Stars"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                  top: "-23px",
                }}
              >
                <Typography
                  sx={{ mr: 0, fontSize: { xs: "12px", sm: "18px" } }}
                >
                  {Math.trunc(item?.rating)} &nbsp;
                </Typography>
                <Rating
                  readOnly
                  value={item?.rating}
                  name="feedback"
                  precision={0.5}
                  sx={{
                    ...commonStyles.muiStartsRatingStyles,
                    "& .MuiRating-iconEmpty": {
                      "&::before": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                  icon={
                    <StarIcon
                      sx={{ fontSize: { xs: "16px", sm: "24px", md: "29px" } }}
                    />
                  }
                  emptyIcon={
                    <StarBorderIcon
                      sx={{ fontSize: { xs: "16px", sm: "24px", md: "29px" } }}
                    />
                  }
                />
              </Box>

              <Box
                mt={-1.5}
                mb={2}
                sx={{ width: "100%", border: "1.3px solid hsla(240,7%,62%,1)" }}
              ></Box>
              <Grid container spacing={1}>
                <Grid item xs={11}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      ...commonStyles.commonTextStyles,
                    }}
                  >
                    {item?.review}
                  </Typography>
                  {item?.image && (
                    <Box
                      sx={{
                        width: "30%",
                        height: {
                          xs: "80px", sm: "100px",
                          md: "150px", lg: "150px",
                        },
                        overflow: "hidden", cursor: "pointer",
                      }}
                      onClick={() => handleImageExpand(item?.id)}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/reviewImage/${item?.image}`}
                        alt="Review Image"
                        layout="responsive"
                        width={150}
                        height={150}
                        objectFit="cover" // Ensure the image fills the container while maintaining the aspect ratio
                        style={{
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Box>
                  )}
                  <Dialog
                    open={imageExpand == item?.id}
                    onClose={handleImageClose}
                    fullWidth
                    maxWidth="lg"
                    sx={{
                      "& .MuiDialog-paper": {
                        backgroundColor: "transparent", // Transparent background
                        boxShadow: "none", // Remove shadow
                        position: "relative", // Needed for positioning the close button
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <IconButton
                        onClick={handleImageClose}
                        sx={{
                          mt: 1,
                          ml: 1,
                          "&:hover": {
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: "50%",
                          },
                          borderRadius: "none",
                          color: "white", cursor: "pointer",
                        }}
                      >
                        <CloseIcon
                          sx={{
                            fontSize: {
                              xs: "16px", sm: "20px", md: "24px",
                              lg: "28px", xl: "32px",
                            },
                          }} />
                      </IconButton>
                    </Box>
                    {/* Full-Screen Image */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "90vh", // Full screen height
                      }}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/reviewImage/${item?.image}`}
                        alt="Expanded Review Image"
                        layout="fill"
                        objectFit="contain" // Ensure the full image is visible
                      />
                    </Box>
                  </Dialog>
                </Grid>
                <Grid item xs={1}>
                  {console.log(
                    "!userInfo?.user?.id == currentUserInfo?.user?.id: ",
                    !(userInfo?.user?.id == currentUserInfo?.user?.id)
                  )}
                  {currentUserInfo?.user?.id == item?.user_id &&
                    apiRole == "user" &&
                    !(userInfo?.user?.id == currentUserInfo?.user?.id) && (
                      <Box>
                        <DeleteIcon
                          color="error"
                          sx={{
                            cursor: "pointer",
                            fontSize: {
                              xs: "16px",
                              sm: "20px",
                              md: "24px",
                              lg: "28px",
                              xl: "32px",
                            },
                            "&:hover": {
                              backgroundColor: "#d32f2f",
                              color: "white",
                            },
                            borderRadius: "50%",
                          }}
                          // onClick={() => handleDeleteReview(item?.id)}
                          onClick={() => handleDeleteModalState(item?.id, "review")}
                        />
                      </Box>
                    )}
                </Grid>
              </Grid>
              <Dialog
                open={deleteModalState?.openModal}
                onClose={handleCloseDeleteModalState}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                  borderRadius: "20px",
                  minWidth: "320px",
                  boxShadow: 1,
                  p: 2,
                  bgcolor: "transparent",

                }}
                BackdropProps={{
                  style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity here (0.3 is lighter)
                  },
                }}
              >
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "400",
                    textAlign: "center",
                    color: "text.primary",
                  }}
                >
                  Are you sure you want to Delete?
                </DialogTitle>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    gap: 2,
                    p: 2,
                  }}
                >
                  <Button
                    onClick={() => handleCloseDeleteModalState()}
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
                    onClick={() => {
                      if (deleteModalState?.deleteChoice == "review")
                        handleDeleteReview(deleteModalState?.id)
                      else {
                        handleDeleteReviewReply(deleteModalState?.id)
                      }
                      handleCloseDeleteModalState();
                    }}
                    sx={{
                      width: "10px",
                      textTransform: "Capitalize",
                      color: "white",
                      bgcolor: "black",
                      fontWeight: "600",
                      fontSize: { xs: "12px", md: "16px" },
                      ...commonStyles.borderRadius,
                      padding: { xs: "5px 55px", lg: "9px 80px" },
                      "&:hover": {
                        backgroundColor: "black ",
                      },
                      marginRight: "16px",
                    }}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              {item?.replies.length > 0 ? (
                <>
                  {/* {item?.replies?.map((subItem, index) => {
                    return ( */}
                  <Grid
                    container
                    spacing={2}
                    //  key={"review box" + index}
                    mt={"4px"}
                  >
                    <Grid item xs={1}>
                      <Box
                        sx={{
                          height: { xs: "30px", sm: "50px", lg: "auto" },
                          width: { xs: "29px", sm: "60px", lg: "60px" },
                          position: "relative",
                          zIndex: "1",
                        }}
                      >
                        <AdImage
                          src={Arrow2}
                          alt="book a call"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transform: "rotate(-10deg)",
                            top: isMobile ? 1 : -2,
                          }}
                          fill={false}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={11}>
                      {console.log("editOpen[item.id]: ", !editOpen[item.id])}
                      {console.log(
                        "item?.user_id == currentUserInfo?.user?.id: ",
                        item?.user_id == currentUserInfo?.user?.id
                      )}
                      {console.log(
                        "item?.user_id: ",
                        item?.user_id +
                        " currentUserInfo?.user?.id: " +
                        currentUserInfo?.user?.id
                      )}
                      {!editOpen[item.id] ? (
                        <Box
                          sx={{
                            width: { xs: "84%", md: "50%", lg: "69%" },
                            height: { xs: "auto", lg: "auto" },
                            borderRadius: "25px",
                            backgroundColor: "white",
                            padding: 1,
                            mb: { xs: 1, lg: 2 },
                            mt: { xs: 0, lg: 2 },
                          }}
                        >
                          <Box sx={{ height: "80%" }}>
                            <Typography
                              className="ReplyFrom"
                              sx={{
                                fontWeight: "bold",
                                color: "#0073e6",
                                fontWeight: "700",
                                fontFamily: "var(--font-montserrat)",
                                fontSize: {
                                  xs: "11px",
                                  sm: "16px",
                                  md: "14px",
                                  lg: "16px",
                                  xl: "18px",
                                },
                                lineHeight: {
                                  xs: "12px",
                                  sm: "22px",
                                  md: "34px",
                                  lg: "38px",
                                  xl: "42px",
                                },
                              }}
                            >
                              {console.log("slug", item)}
                              <span style={{ color: "black" }}>Reply from</span>{" "}
                              <Link
                                href={item?.business?.slug
                                  ? `/business-profile/${item?.business?.slug}`
                                  : `/business-profile/${userInfo?.slug}`}
                                sx={{ color: "#0073e6" }}
                              >
                                {userInfo?.business_name
                                  ? userInfo?.business_name
                                  : item?.business?.business_name}
                              </Link>
                            </Typography>
                            <Typography
                              mt={0.5}
                              variant="body2"
                              // noWrap="true"
                              sx={{
                                fontSize: {
                                  xs: "11px",
                                  sm: "16px",
                                  md: "14px",
                                  lg: "16px",
                                  xl: "18px",
                                },
                                lineHeight: {
                                  xs: "14px",
                                  sm: "26px",
                                  md: "28px",
                                  lg: "30px",
                                  xl: "42px",
                                },
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item?.replies[0]?.reply}
                            </Typography>
                          </Box>
                          {apiRole == "business-user" &&
                            userInfo?.user_id == currentUserInfo?.user?.id && (
                              <Box
                                sx={{
                                  textAlign: "end",
                                  pt: 1,
                                }}
                              >
                                <EditIcon
                                  color="primary"
                                  sx={{
                                    mr: { xs: 0, sm: 1 },
                                    cursor: "pointer",
                                    ml: 1,
                                    p: 0.5,
                                    fontSize: {
                                      xs: "16px",
                                      sm: "20px",
                                      md: "24px",
                                      lg: "28px",
                                      xl: "32px",
                                    },
                                    "&:hover": {
                                      backgroundColor: "#1976d2",
                                      color: "white",
                                    },
                                    borderRadius: "50%",
                                  }}
                                  onClick={() => handleEditOpen(item.id)}
                                />
                                <DeleteIcon
                                  color="error"
                                  sx={{
                                    cursor: "pointer",
                                    p: 0.5,
                                    ml: 1,
                                    fontSize: {
                                      xs: "16px",
                                      sm: "20px",
                                      md: "24px",
                                      lg: "28px",
                                      xl: "32px",
                                    },
                                    "&:hover": {
                                      backgroundColor: "#d32f2f",
                                      color: "white",
                                    },
                                    borderRadius: "50%",
                                  }}
                                  // onClick={() => {
                                  //   handleDeleteReviewReply(
                                  //     item?.replies[0]?.id
                                  //   )
                                  // }
                                  // }
                                  onClick={() => handleDeleteModalState(item?.replies[0]?.id, "reply")}
                                />
                              </Box>
                            )}
                        </Box>
                      ) : (
                        userInfo?.user_id == currentUserInfo?.user?.id && (
                          <Box
                            component="form"
                            onSubmit={(e) => handleSubmit(e, reviewsData, index)}
                            sx={{
                              width: { xs: "84%", md: "50%", lg: "69%" },
                              height: { xs: "auto", lg: "auto" },
                              borderRadius: "25px",
                              backgroundColor: "white",
                              // padding: 1,
                              pb: 0,
                              mb: { xs: 1, lg: 2 },
                              mt: { xs: 1, lg: 2 },
                              display: "flex",
                            }}
                          >
                            <Box sx={{ width: "100%" }}>
                              <TextField
                                name="reply"
                                fullWidth
                                multiline
                                defaultValue={item?.replies[0]?.reply}
                                placeholder="Write your reply here..."
                                onChange={(e) => setRreplyFieldValue(e.target.value)}
                                variant="outlined"
                                inputProps={{ maxLength: 200 }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "25px",
                                    borderColor: "black",
                                    fontSize: {
                                      xs: "11px",
                                      sm: "16px",
                                      md: "14px",
                                      lg: "16px",
                                      xl: "18px",
                                    },
                                    // width:"150%"
                                  },
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        disabled={!replyFieldValue.trim()}
                                        type="submit"
                                        color={"primary"}
                                        sx={{
                                          "&:hover": {
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                          },
                                          borderRadius: "50%",
                                        }}
                                      >
                                        <SendIcon
                                          sx={{
                                            fontSize: {
                                              xs: "16px",
                                              sm: "20px",
                                              md: "24px",
                                              lg: "28px",
                                              xl: "32px",
                                            },
                                          }}
                                        />
                                      </IconButton>

                                    </InputAdornment>
                                  )
                                }}

                              />
                            </Box>
                          </Box>
                        )
                      )}
                    </Grid>
                  </Grid>
                </>
              ) : (
                apiRole == "business-user" &&
                currentUserInfo?.user?.id == userInfo?.user?.id
                && !router.pathname.includes("user-profile") && (
                  <Grid container spacing={2}>
                    <Grid item xs={1}>
                      <Box
                        sx={{
                          height: { xs: "30px", sm: "50px", lg: "auto" },
                          width: { xs: "29px", sm: "60px", lg: "60px" },
                          position: "relative",
                          zIndex: "1",
                        }}
                      >
                        <AdImage
                          src={Arrow2}
                          alt="book a call"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            transform: "rotate(-10deg)",
                            top: isMobile ? 1 : -2,
                          }}
                          fill={false}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={11}>
                      <Box
                        component="form"
                        onSubmit={(e) => handleSubmit(e, reviewsData, index)}
                        sx={{
                          width: { xs: "84%", md: "50%", lg: "69%" },
                          height: { xs: "auto", lg: "auto" },
                          borderRadius: "25px",
                          backgroundColor: "white",
                          // padding: 1,
                          pb: 0,
                          mb: { xs: 1, lg: 2 },
                          mt: { xs: 1, lg: 2 },
                          display: "flex",
                        }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <TextField
                            name="reply"
                            fullWidth
                            multiline
                            placeholder="Write your reply here..."
                            onChange={(e) => setRreplyFieldValue(e.target.value)}
                            variant="outlined"
                            inputProps={{ maxLength: 200 }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "25px",
                                borderColor: "black",
                                fontSize: {
                                  xs: "11px",
                                  sm: "16px",
                                  md: "14px",
                                  lg: "16px",
                                  xl: "18px",
                                },
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    disabled={!replyFieldValue.trim()}
                                    type="submit"
                                    color={"primary"}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                      },
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <SendIcon
                                      sx={{
                                        fontSize: {
                                          xs: "16px",
                                          sm: "20px",
                                          md: "24px",
                                          lg: "28px",
                                          xl: "32px",
                                        },
                                      }}
                                    />
                                  </IconButton>

                                </InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )
              )}
            </>
          );
        })}
      </Box>
    </Box >
  );
}
