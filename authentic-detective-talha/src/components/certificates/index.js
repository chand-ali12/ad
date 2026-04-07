import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Grid,
  InputAdornment,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { commonStyles } from "@/commonStyles";
import { getCertificates, getValuations } from "../../../utils/api/certificates";
import { filterCertificates } from "../../../utils/certificate-helpers";
import CertificateCard from "./CertificateCard";
import CertificateFilters from "./CertificateFilters";
import CertificateViewer from "./CertificateViewer";
import CertificateNoteModal from "./CertificateNoteModal";
import RequestMoreImagesModal from "./RequestMoreImagesModal";
import {
  updateCertificateNote,
  markCertificateSold,
  submitRequestMoreImages,
  userUpdateQueryImages,
} from "../../../utils/api/certificates";
import CustomLoaderWithBackdrop from "@/common-components/custom-loader-with-backdrop";

const CertificatesSection = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  
  // Main state
  const [allCertificates, setAllCertificates] = useState([]);
  const [valuationsData, setValuationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("completed");
  const [activeSubTab, setActiveSubTab] = useState("available");
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [requestImagesModalOpen, setRequestImagesModalOpen] = useState(false);
  const [sellConfirmModalOpen, setSellConfirmModalOpen] = useState(false);
  const [certificateToToggle, setCertificateToToggle] = useState(null);

  // Ref to track if we're currently fetching to prevent duplicate calls
  const fetchingRef = useRef(false);
  const countsFetchedRef = useRef(false);
  const mountedRef = useRef(false);

  // Fetch valuations
  const fetchValuations = async () => {
    if (fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    try {
      setLoading(true);
      
      const response = await getValuations({
        limit: 20,
        page: 1,
      });

      const valuations = Array.isArray(response?.data) 
        ? response.data 
        : response?.data?.data || [];
      
      setValuationsData(valuations);
      
      // Update valuations count
      setCounts((prev) => ({
        ...prev,
        valuations: valuations.length,
      }));
    } catch (error) {
      console.error("Error fetching valuations:", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  // Fetch certificates based on active tab and sub-tab
  const fetchCertificates = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    try {
      setLoading(true);
      
      let params = {
        all: 1,
        order_by: sortOrder || "desc",
      };

      // Set parameters based on active tab and sub-tab
      if (activeTab === "completed") {
        params.type = 1; // Completed certificates
        if (activeSubTab === "available") {
          params.issold = 0; // Available items
        } else if (activeSubTab === "sold") {
          params.issold = 1; // Sold items
        }
        // valuations sub-tab is handled separately
      } else if (activeTab === "pending") {
        params.type = 0; // Pending certificates
      }

      const response = await getCertificates(params);

      // Handle different response structures
      const certificates = Array.isArray(response?.data) 
        ? response.data 
        : response?.data?.data || [];
      
      setAllCertificates(certificates);

      // Update counts from additional_data if available
      if (response?.additional_data) {
        const additionalData = response.additional_data;
        
        // Update completed and pending counts from additional_data
        setCounts((prev) => ({
          ...prev,
          completed: additionalData.complete_count !== undefined ? additionalData.complete_count : prev.completed,
          pending: additionalData.pending_count !== undefined ? additionalData.pending_count : prev.pending,
          valuations: additionalData.completed_valuation_count !== undefined ? additionalData.completed_valuation_count : prev.valuations,
        }));

        // For completed tab, update available/sold counts
        // Only fetch the other sub-tab count once on first load
        if (activeTab === "completed") {
          if (activeSubTab === "available") {
            // Update available count from current data
            setCounts((prev) => {
              const newCounts = {
                ...prev,
                available: certificates.length,
              };
              
              // Only fetch sold count if we don't have it yet and haven't fetched it
              // Only on first load (when mountedRef is true and countsFetchedRef is false)
              if (newCounts.sold === 0 && !countsFetchedRef.current && mountedRef.current) {
                countsFetchedRef.current = true;
                // Fetch sold count in background (don't await to avoid blocking)
                getCertificates({
                  type: 1,
                  issold: 1,
                  all: 1,
                  order_by: sortOrder || "desc",
                })
                  .then((soldResponse) => {
                    const sold = Array.isArray(soldResponse?.data)
                      ? soldResponse.data
                      : soldResponse?.data?.data || [];
                    setCounts((prevCounts) => ({
                      ...prevCounts,
                      sold: sold.length,
                    }));
                  })
                  .catch((error) => {
                    console.error("Error fetching sold count:", error);
                  });
              }
              
              return newCounts;
            });
          } else if (activeSubTab === "sold") {
            // Update sold count from current data
            setCounts((prev) => {
              const newCounts = {
                ...prev,
                sold: certificates.length,
              };
              
              // Only fetch available count if we don't have it yet and haven't fetched it
              // Only on first load (when mountedRef is true and countsFetchedRef is false)
              if (newCounts.available === 0 && !countsFetchedRef.current && mountedRef.current) {
                countsFetchedRef.current = true;
                // Fetch available count in background
                getCertificates({
                  type: 1,
                  issold: 0,
                  all: 1,
                  order_by: sortOrder || "desc",
                })
                  .then((availableResponse) => {
                    const available = Array.isArray(availableResponse?.data)
                      ? availableResponse.data
                      : availableResponse?.data?.data || [];
                    setCounts((prevCounts) => ({
                      ...prevCounts,
                      available: available.length,
                    }));
                  })
                  .catch((error) => {
                    console.error("Error fetching available count:", error);
                  });
              }
              
              return newCounts;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  // Fetch certificates when tab/subtab/sort changes
  useEffect(() => {
    // Mark as mounted after first render
    if (!mountedRef.current) {
      mountedRef.current = true;
    }
    
    // Only fetch if not already fetching
    if (!fetchingRef.current) {
      if (activeTab === "completed" && activeSubTab === "valuations") {
        fetchValuations();
      } else {
        fetchCertificates();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeSubTab, sortOrder]);

  // Filter certificates based on current filters (client-side filtering for search and brand)
  const filteredCertificates = useMemo(() => {
    // Use valuations data if on valuations tab, otherwise use certificates
    const sourceData = (activeTab === "completed" && activeSubTab === "valuations") 
      ? valuationsData 
      : allCertificates;
    
    let filtered = [...sourceData];

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(
        (cert) => {
          const brandName = cert.brands?.brand || cert.brand;
          return brandName?.toLowerCase() === selectedBrand.toLowerCase();
        }
      );
    }

    // Search filter - search in certificate_id, brand, model, coa_number, order_number
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert) => {
          const brandName = cert.brands?.brand || cert.brand;
          const coaNumber = cert.coa_number || cert.certificate?.certificate_id;
          const orderNumber = cert.order_number;
          return (
            coaNumber?.toLowerCase().includes(searchLower) ||
            brandName?.toLowerCase().includes(searchLower) ||
            cert.model?.toLowerCase().includes(searchLower) ||
            (orderNumber && orderNumber.toLowerCase().includes(searchLower))
          );
        }
      );
    }

    // Sort (API already sorts, but we can re-sort client-side if needed)
    filtered.sort((a, b) => {
      const dateA = new Date(a.certificate?.date || a.created_at || 0);
      const dateB = new Date(b.certificate?.date || b.created_at || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [allCertificates, valuationsData, activeTab, activeSubTab, selectedBrand, searchQuery, sortOrder]);

  // Count certificates - get from API response additional_data
  const [counts, setCounts] = useState({
    completed: 0,
    pending: 0,
    available: 0,
    sold: 0,
    valuations: 0,
  });
  
  // Reset countsFetchedRef when switching tabs to allow re-fetching if needed
  useEffect(() => {
    if (activeTab === "pending") {
      countsFetchedRef.current = false;
    }
  }, [activeTab]);

  // Extract counts for use in UI
  const completedCount = counts.completed || 0;
  const pendingCount = counts.pending || 0;
  const availableCount = counts.available || 0;
  const soldCount = counts.sold || 0;
  const valuationsCount = counts.valuations || 0;

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === "completed") {
      setActiveSubTab("available");
    }
  };

  const handleSubTabChange = (event, newValue) => {
    setActiveSubTab(newValue);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewerOpen(true);
  };

  const handleSellToggle = (certificate) => {
    // Show confirmation modal first
    setCertificateToToggle(certificate);
    setSellConfirmModalOpen(true);
  };

  console.log("certificateToToggle", certificateToToggle);
  

  const handleConfirmSellToggle = async () => {
    
    if (!certificateToToggle) return;

    try {
      
      
      // Use certificate_id from certificate object
      const certificateId = certificateToToggle?.certificate?.id;
      
      if (!certificateId) {
        console.error("Certificate ID not found");
        setSellConfirmModalOpen(false);
        setCertificateToToggle(null);
        return;
      }
      
      await markCertificateSold(certificateId);
      
      // Close modal and reset state
      setSellConfirmModalOpen(false);
      setCertificateToToggle(null);
      
      // Refresh list (this will also update counts from additional_data)
      await fetchCertificates();
    } catch (error) {
      console.error("Error toggling sold status:", error);
      setSellConfirmModalOpen(false);
      setCertificateToToggle(null);
    }
  };

  const handleCancelSellToggle = () => {
    setSellConfirmModalOpen(false);
    setCertificateToToggle(null);
  };

  const handleSaveNote = async (certificate, note) => {
    try {
      // Use certificate_id from certificate object
      const certificateId = certificate.certificate?.certificate_id;
      
      if (!certificateId) {
        console.error("Certificate ID not found");
        return;
      }
      
      await updateCertificateNote(certificateId, note);
      await fetchCertificates(); // Refresh list
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleRequestMoreImages = async (certificate, images) => {
    try {
      // Use id (authenticate_id) from certificate object
      const authenticateId = certificate.id;
      
      if (!authenticateId) {
        console.error("Authenticate ID not found");
        return;
      }
      
      // Check if admin requested more images (status === 0)
      const isAdminRequested =
        certificate.request_more_images?.some((item) => item.status === 0);

      if (isAdminRequested) {
        await submitRequestMoreImages(authenticateId, images);
      } else {
        await userUpdateQueryImages(authenticateId, images);
      }
      
      await fetchCertificates(); // Refresh list
    } catch (error) {
      console.error("Error submitting images:", error);
    }
  };

  const handleApplyFilters = () => {
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedBrand("");
    setSortOrder("desc");
  };

  if (loading && allCertificates.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Typography
        sx={{
          ...commonStyles.commonHeadingStyles,
          mb: 3,
          textAlign: "center",
        }}
      >
        Certificates of Authenticity
      </Typography>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          px: { xs: 2, sm: 0 },
        }}
      >
        <TextField
          fullWidth
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={() => setFiltersOpen(true)}
          sx={{
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Main Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              ...commonStyles.commonTextStyles,
              fontWeight: "600",
              textTransform: "none",
            },
          }}
        >
          <Tab
            label={`Completed (${completedCount})`}
            value="completed"
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Pending ({pendingCount})
                {/* {pendingCount > 0 && (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#f44336",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {pendingCount}
                  </Box>
                )} */}
              </Box>
            }
            value="pending"
          />
        </Tabs>
      </Box>

      {/* Sub-tabs for Completed */}
      {activeTab === "completed" && (
        <Box 
          sx={{ 
            borderBottom: 1, 
            borderColor: "divider", 
            mb: 3,
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Tabs
            value={activeSubTab}
            onChange={handleSubTabChange}
            variant={"scrollable"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minWidth: "fit-content",
              "& .MuiTab-root": {
                ...commonStyles.commonTextStyles,
                fontWeight: "600",
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: "auto",
                px: { xs: 2, sm: 3 },
              },
            }}
          >
            <Tab label={`Available Items (${availableCount})`} value="available" />
            <Tab label={`Sold Items (${soldCount})`} value="sold" />
            <Tab label={`Valuations (${valuationsCount})`} value="valuations" />
          </Tabs>
        </Box>
      )}

      {/* Certificates Grid */}
      {filteredCertificates.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCertificates.map((certificate, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <CertificateCard
                certificate={certificate}
                type={activeTab}
                subType={activeSubTab}
                onView={handleViewCertificate}
                onSellToggle={handleSellToggle}
                onAddNote={() => {
                  setSelectedCertificate(certificate);
                  setNoteModalOpen(true);
                }}
                onRequestMoreImages={() => {
                  setSelectedCertificate(certificate);
                  setRequestImagesModalOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              color: "#999",
            }}
          >
            No certificates found
          </Typography>
        </Box>
      )}

      {/* Filters Drawer */}
      <CertificateFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Certificate Viewer */}
      {selectedCertificate && (
        <CertificateViewer
          open={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedCertificate(null);
          }}
          certificate={selectedCertificate}
          type={activeTab}
          subType={activeSubTab}
        />
      )}

      {/* Note Modal */}
      {selectedCertificate && (
        <CertificateNoteModal
          open={noteModalOpen}
          onClose={() => {
            setNoteModalOpen(false);
            setSelectedCertificate(null);
          }}
          certificate={selectedCertificate}
          onSave={handleSaveNote}
        />
      )}

      {/* Request More Images Modal */}
      {selectedCertificate && (
        <RequestMoreImagesModal
          open={requestImagesModalOpen}
          onClose={() => {
            setRequestImagesModalOpen(false);
            setSelectedCertificate(null);
          }}
          certificate={selectedCertificate}
          onSubmit={handleRequestMoreImages}
          isAdminRequested={
            selectedCertificate.request_more_images?.some(
              (item) => item.status === 0
            ) || false
          }
        />
      )}

      {/* Sell/Unsell Confirmation Modal */}
      <Dialog
        open={sellConfirmModalOpen}
        onClose={handleCancelSellToggle}
        aria-labelledby="sell-confirm-dialog-title"
        aria-describedby="sell-confirm-dialog-description"
        sx={{
          borderRadius: "20px",
          minWidth: "320px",
          boxShadow: 24,
          p: 2,
        }}
      >
        <DialogTitle
          id="sell-confirm-dialog-title"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          {certificateToToggle?.certificate?.is_sold === 1
            ? "Mark as Available?"
            : "Mark as Sold?"}
        </DialogTitle>
        <Typography
          sx={{
            px: 3,
            pb: 2,
            textAlign: "center",
            color: "text.secondary",
            ...commonStyles.commonTextStyles,
          }}
        >
          {certificateToToggle?.certificate?.is_sold === 1
            ? "Are you sure you want to mark this certificate as available?"
            : "Are you sure you want to mark this certificate as sold?"}
        </Typography>
        <DialogActions
          sx={{
            justifyContent: "space-around",
            gap: 0,
            p: 2,
          }}
        >
          <Button
            onClick={handleCancelSellToggle}
            sx={{
              width: "40%",
              ...commonStyles.buttonCommonStyles,
              borderColor: "#333",
              color: "#333",
              "&:hover": {
                borderColor: "#000",
                backgroundColor: "#f5f5f5",
              },
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSellToggle}
            sx={{
              width: "40%",
              ...commonStyles.buttonCommonStyles,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <CustomLoaderWithBackdrop
        open={loading && allCertificates.length > 0}
        handleClose={() => {}}
      />
    </Box>
  );
};

export default CertificatesSection;

