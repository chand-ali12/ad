import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Grid,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import CustomErrorMessage from "@/common-commponent/error-message";
import { commonStyles } from "@/commonStyles";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

import axios from "../../../utils/api/axios-client";
import { notifyError, notifySuccess } from "../../../utils/toast";

import { SHOW_COA_RECEIPTS } from "../../../utils/api/constants";
import { FormateDateToApiAccordingYearMonthDay } from "../../../utils/formatDateToApiAccording";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";
// import ReceiptPdfGenerate from "../receipt-pdf-generate";
import { currentUserInformation } from "@/store/slice/userData";
import { useSelector } from "react-redux";
import ReceiptPdfGenerator from "../receipt-pdf-generate";

// Add custom styles to prevent zoom
const preventZoomStyles = `
  @viewport {
    width: device-width;
    zoom: 1;
    max-zoom: 1;
    user-zoom: fixed;
  }
  
  input, select, textarea {
    font-size: 16px !important;
  }

  .rs-picker-toggle-textbox {
    font-size: 16px !important;
  }

  .rs-picker-toggle {
    padding: 7px 10px !important;
  }
`;

const tableHeadings = [
  { headingTable: "Order Number" },

  { headingTable: "Brand" },
  { headingTable: "Date" },
  { headingTable: "Price" },
  { headingTable: "Payment" },
];

const ReceiptGenerator = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const userInfo = useSelector(currentUserInformation);

  const [receiptsData, setReceiptsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dataSearched, setDataSearched] = useState(false);

  const [showPdfGeneratorPage, setShowPdfGeneratorPage] = useState(false);

  const handleClose = () => {
    // setLoader(false);
  };

  // Add useEffect to inject the styles
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = preventZoomStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const receiptSchema = yup.object().shape({
    start_date: yup.date().required("Start date is required"),
    end_date: yup
      .date()
      .required("End date is required")
      .min(yup.ref("start_date"), "End date can't be before start date"),
  });

  const {
    handleSubmit,
    formState: { errors },
    trigger,
    control,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(receiptSchema),
  });

  const onSubmit = async (data) => {
    setLoader(true);
    const bodyData = {
      starting_date: FormateDateToApiAccordingYearMonthDay(data?.start_date),
      ending_date: FormateDateToApiAccordingYearMonthDay(data?.end_date),
    };

    setDataSearched(true);

    setStartDate(data?.start_date);
    setEndDate(data?.end_date);
    try {
      const response = await axios.post(SHOW_COA_RECEIPTS, bodyData);

      if (response?.data?.data) {
        notifySuccess(response?.data?.msg);
        setReceiptsData(response?.data?.data);
        //   router.push("/jobs");
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        notifyError("Please connect to the internet first");
      } else {
        notifyError(error.toString());
      }
    }
    setLoader(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedRows(receiptsData); // Store all row objects
      setSelectAll(true);
      return;
    }
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleRowClick = (rowData) => {
    const selectedIndex = selectedRows.findIndex(
      (item) => item.id === rowData.id
    );
    let newSelected = [];

    if (selectedIndex === -1) {
      // Add the full row data
      newSelected = newSelected.concat(selectedRows, rowData);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (id) => selectedRows.some((row) => row.id === id);

  console.log("receiptsDatareceiptsData", receiptsData);

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: isMobile && showPdfGeneratorPage ? "4px" : "auto",
      }}
    >
      <>
        {!showPdfGeneratorPage ? (
          <>
            <Box
              sx={{
                mt: { xs: "22%", sm: "14%", md: "12%" },
              }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                // style={{ mt: 1, p: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}
                // style={{
                //   height:
                //     !dataSearched || receiptsData?.length < 10
                //       ? "60vh"
                //       : "auto",
                // }}
              >
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        sx={{
                          ...commonStyles.commonTextFieldsLabelStyles,
                          mb: 1,
                        }}
                      >
                        Start Date
                      </Typography>
                      <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            format="MM/dd/yyyy"
                            //   shouldDisableDate={disablePastDates}
                            placeholder=" Start Date"
                            style={{ width: "100%" }}
                            oneTap
                            onChange={(date) => {
                              field.onChange(date);
                              trigger("end_date");
                            }}
                          />
                        )}
                      />

                      {errors.start_date && (
                        <CustomErrorMessage
                          errorMessage={errors.start_date.message}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        sx={{
                          ...commonStyles.commonTextFieldsLabelStyles,
                          mb: 1,
                        }}
                      >
                        End Date
                      </Typography>
                      <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            format="MM/dd/yyyy"
                            //   shouldDisableDate={disablePastDates}
                            placeholder="End Date"
                            style={{ width: "100%" }}
                            oneTap
                            onChange={(date) => {
                              field.onChange(date);
                              trigger("end_date");
                            }}
                          />
                        )}
                      />
                      {errors.end_date && (
                        <CustomErrorMessage
                          errorMessage={errors.end_date.message}
                        />
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    mt={4}
                    mb={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        Object.keys(errors).length > 0
                          ? true
                          : Object.keys(getValues()).length === 0
                          ? true
                          : false
                      }
                      sx={{
                        ...commonStyles.buttonCommonStyles,
                        textTransform: "none",
                        color: "white",
                        bgcolor: "black",

                        fontSize: { xs: "12px", md: "16px" },
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Box>
              </form>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowPdfGeneratorPage(true)}
                  disabled={selectedRows?.length === 0 ? true : false}
                  sx={{
                    ...commonStyles.buttonCommonStyles,
                    ...commonStyles.disabledButton,

                    textTransform: "none",
                    color: "white",
                    bgcolor: "black",
                    // fontWeight: "600",
                    fontSize: { xs: "12px", md: "16px" },
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                  }}
                >
                  Generate Receipt
                </Button>
              </Box>
              {receiptsData?.length > 0 ? (
                <TableContainer
                  component={Paper}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    border: "2px solid",
                    borderColor: "#D5D5D5",
                    maxHeight: "700px",
                    overflowY: "scroll",
                    mb: 5,
                  }}
                >
                  <Table sx={{ minWidth: 750 }} aria-label="details table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell
                          padding="checkbox"
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 900,
                            // display: "flex",

                            width: { xs: 60, sm: "auto" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: { xs: "auto", sm: "200px" },
                            }}
                          >
                            <Checkbox
                              color="primary"
                              indeterminate={
                                selectedRows.length > 0 &&
                                selectedRows.length < receiptsData?.length
                              }
                              checked={
                                receiptsData?.length > 0 &&
                                selectedRows.length === receiptsData?.length
                              }
                              onChange={handleSelectAllClick}
                              sx={{
                                transform: { xs: "scale(0.8)", sm: "scale(1)" }, // Smaller checkbox on mobile
                              }}
                            />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                display: { xs: "flex", sm: "flex" },
                              }}
                            >
                              {receiptsData?.length > 0 &&
                              selectedRows.length === receiptsData?.length
                                ? "Unselect All"
                                : "Select All"}
                            </Box>
                          </Box>
                        </TableCell>
                        {tableHeadings.map((item, index) => (
                          <TableCell
                            key={index}
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 900,
                              display: { xs: "table-cell", md: "table-cell" },
                            }}
                          >
                            {item.headingTable}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={{
                        maxHeight: "400px",
                        overflowY: "scroll",
                      }}
                    >
                      {receiptsData.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 1 ? "#f5f5f5" : "white",
                            }}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onChange={() => handleRowClick(row)}
                                sx={{
                                  transform: {
                                    xs: "scale(0.8)",
                                    sm: "scale(1)",
                                  }, // Smaller checkbox on mobile
                                }}
                              />
                            </TableCell>

                            <TableCell>{row?.order_number ?? "N/A"}</TableCell>

                            <TableCell>{row.brand ?? "Null"}</TableCell>
                            <TableCell>
                              {row.created_at
                                ? new Date(row.created_at).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                : "Null"}
                            </TableCell>
                            <TableCell>
                              {row.amount ? `$${row.amount}` : "$" + 0}
                            </TableCell>
                            <TableCell>
                              {row?.payment_status === 1 && row?.is_refund === 0
                                ? "Success"
                                : row?.payment_status === 1 &&
                                  row?.is_refund === 1
                                ? "Refunded"
                                : "" ?? "Null"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : receiptsData?.length === 0 && dataSearched && !loader ? (
                <Box mt={2} mb={2}>
                  <Typography
                    sx={{
                      ...commonStyles.commonTextStyles,
                    }}
                  >
                    No Data Found
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </>
        ) : (
          <ReceiptPdfGenerator
            pdfDataToGenerate={selectedRows}
            startDate={startDate}
            endDate={endDate}
            userInfo={userInfo}
            setShowPdfGeneratorPage={setShowPdfGeneratorPage}
          />
        )}
      </>

      <CustomLoaderWithBackdrop open={loader} handleClose={handleClose} />
    </Container>
  );
};

export default ReceiptGenerator;
