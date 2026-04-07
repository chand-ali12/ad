import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  useMediaQuery,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { commonStyles } from "@/commonStyles";
import axiosInstance from "../../../utils/api/axios-client";
import { GET_ALL_BRANDS_WITH_CATEGORIES } from "../../../utils/api/constants";
import { notifyError } from "../../../utils/toast";

const CertificateFilters = ({
  open,
  onClose,
  selectedBrand,
  onBrandChange,
  sortOrder,
  onSortChange,
  onApply,
  onClear,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [searchBrand, setSearchBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await axiosInstance.get(GET_ALL_BRANDS_WITH_CATEGORIES);
        const brandsData = response?.data?.data?.brands || [];
        // Extract brand names from brand objects
        const brandNames = brandsData.map((brand) => brand.brand || brand.name || brand);
        setBrands(brandNames);
        setFilteredBrands(brandNames);
      } catch (error) {
        console.error("Error fetching brands:", error);
        notifyError("Failed to load brands");
      } finally {
        setLoadingBrands(false);
      }
    };

    if (open) {
      fetchBrands();
    }
  }, [open]);

  useEffect(() => {
    if (brands && brands.length > 0) {
      if (searchBrand) {
        const filtered = brands.filter((brand) =>
          brand.toLowerCase().includes(searchBrand.toLowerCase())
        );
        setFilteredBrands(filtered);
      } else {
        setFilteredBrands(brands);
      }
    }
  }, [searchBrand, brands]);

  const handleClear = () => {
    setSearchBrand("");
    onClear();
  };

  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? "100%" : 400,
        maxWidth: "100%",
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          width: "100%",
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            ...commonStyles.commonHeadingStyles,
            fontSize: { xs: "20px", sm: "24px" },
          }}
        >
          Filter & Sort
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Brand Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            ...commonStyles.commonTextStyles,
            mb: 1,
            fontWeight: "600",
          }}
        >
          Brand
        </Typography>
        <TextField
          fullWidth
          placeholder="Search brand..."
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          size="small"
          sx={{
            mb: 2,
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
        <Box
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            overflowX: "hidden",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 1,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {loadingBrands ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredBrands.length > 0 ? (
            filteredBrands.map((brand, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Radio
                    checked={selectedBrand === brand}
                    onChange={() => onBrandChange(brand)}
                    size="small"
                  />
                }
                label={brand}
                sx={{
                  display: "block",
                  mb: 0.5,
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
                  "& .MuiFormControlLabel-label": {
                    ...commonStyles.commonTextStyles,
                    fontSize: { xs: "12px", sm: "14px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  },
                }}
              />
            ))
          ) : (
            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                color: "#999",
                textAlign: "center",
                py: 2,
              }}
            >
              No brands found
            </Typography>
          )}
        </Box>
      </Box>

      {/* Sort By */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            ...commonStyles.commonTextStyles,
            mb: 2,
            fontWeight: "600",
          }}
        >
          Sort By
        </Typography>
        <RadioGroup
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <FormControlLabel
            value="asc"
            control={<Radio size="small" />}
            label="Ascending"
            sx={{
              mb: 1,
              "& .MuiFormControlLabel-label": {
                ...commonStyles.commonTextStyles,
                fontSize: { xs: "12px", sm: "14px" },
              },
            }}
          />
          <FormControlLabel
            value="desc"
            control={<Radio size="small" />}
            label="Descending"
            sx={{
              "& .MuiFormControlLabel-label": {
                ...commonStyles.commonTextStyles,
                fontSize: { xs: "12px", sm: "14px" },
              },
            }}
          />
        </RadioGroup>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: "auto", display: "flex", gap: 2, width: "100%", minWidth: 0, flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={handleClear}
          fullWidth
          sx={{
            ...commonStyles.buttonCommonStyles,
            borderColor: "#333",
            color: "#333",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={onApply}
          fullWidth
          sx={{
            ...commonStyles.buttonCommonStyles,
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Filter
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "80vh",
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            overflowY: "auto",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "4px",
            backgroundColor: "#ccc",
            borderRadius: 2,
            mx: "auto",
            mt: 1,
            mb: 2,
          }}
        />
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
};

export default CertificateFilters;

