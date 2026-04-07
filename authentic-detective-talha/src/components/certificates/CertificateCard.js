import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import SellIcon from "@mui/icons-material/Sell";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { commonStyles } from "@/commonStyles";
import {
  getCertificateStatus,
  getStatusBadgeColor,
  getCompletedThumbnailUrl,
  getPendingThumbnailUrl,
  isPendingCertificate,
} from "../../../utils/certificate-helpers";
import defaultImage from "../../../public/default-image.png";

const CertificateCard = ({
  certificate,
  type,
  subType,
  onView,
  onSellToggle,
  onAddNote,
  onRequestMoreImages,
}) => {
  const isValuation = subType === "valuations";
  
  const status = getCertificateStatus(certificate);
  const statusColor = getStatusBadgeColor(status);
  // For pending tab, all items are pending. For completed tab, check if admin requested more images
  const isPending = type === "pending" || (type === "completed" && isPendingCertificate(certificate));
  let isMorePhotoRequested = false;
  if (certificate.request_more_images && certificate.request_more_images.length > 0) {
    for (let x = 0; x < certificate.request_more_images.length; x++) {
      if (certificate.request_more_images[x].status === 0) {
        isMorePhotoRequested = isPending && true;
        break;
      }
    }
  }

  // Get thumbnail URL based on type
  const thumbnailUrl = isValuation
    ? (certificate.certificate?.pdf ? getCompletedThumbnailUrl(certificate) : null)
    : type === "completed"
    ? getCompletedThumbnailUrl(certificate)
    : getPendingThumbnailUrl(certificate);
  
  // Get brand name - handle both structures
  const brandName = isValuation 
    ? (certificate.brands?.brand || certificate.brand)
    : certificate.brand;
  
  // Get order/COA number
  const orderNumber = !isValuation
    ? (certificate.coa_number || certificate.order_number || certificate.certificate?.certificate_id)
    : (certificate.certificate?.certificate_id || certificate.order_number);
  
  // Get certificate number for valuations
  const certificateNumber = isValuation
    ? (certificate.coa_number || certificate.certificate?.certificate_id || certificate.order_number || null)
    : null;
  
  // Get valuation_price for valuations
  const valuationPrice = isValuation 
    ? (certificate.valuation_price || null)
    : null;

    const valuationWithCertificatePrice = certificate.certificate?.valuation_price || null;
  
  
  // Get description for valuations (note or description field)
  const description = isValuation
    ? (certificate.certificate?.note || certificate.note || certificate.certificate?.description || certificate.description || null)
    : null;
  
  // Get date for valuations
  const valuationDate = isValuation
    ? (certificate.certificate?.date || certificate.created_at || certificate.certificate?.created_at || null)
    : null;

  const handleCardClick = () => {
    if (onView) {
      onView(certificate);
    }
  };

  const handleSellClick = (e) => {
    e.stopPropagation();
    if (onSellToggle) {
      onSellToggle(certificate);
    }
  };

  const handleRequestMoreImagesClick = (e) => {
    e.stopPropagation();
    if (onRequestMoreImages) {
      onRequestMoreImages(certificate);
    }
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        backgroundColor: (isPending && isMorePhotoRequested && status === 'Pending') ? "#ffebee" : "white",
        border: (isPending && isMorePhotoRequested && status === 'Pending') ? "2px solid #f44336" : "1px solid #e0e0e0",
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={handleCardClick}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "200px", sm: "250px", md: "300px" },
          backgroundColor: "#f5f5f5",
        }}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={brandName || "Certificate"}
            fill
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.src = defaultImage.src;
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e0e0e0",
            }}
          >
            <Typography sx={{ color: "#999" }}>No Image</Typography>
          </Box>
        )}

        {/* Status Badge */}
        {type === "completed" && !isValuation && status && (
          <Chip
            label={status}
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: statusColor,
              color: "white",
              fontWeight: "600",
              fontSize: { xs: "10px", sm: "12px" },
            }}
          />
        )}

        {/* Request More Images Icon for Pending */}
        {isPending && !isValuation && (
          <Tooltip title="Add more photos">
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
              onClick={handleRequestMoreImagesClick}
            >
              <AddPhotoAlternateIcon sx={{ color: "#f44336" }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Sell/Unsell Icon for Completed (not for valuations) */}
        {type === "completed" && !isValuation && (
          <Tooltip title={certificate.certificate?.is_sold === 1 ? "Mark as Available" : "Mark as Sold"}>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
              onClick={handleSellClick}
            >
              <SellIcon
                sx={{
                  color: certificate.certificate?.is_sold === 1 ? "#4caf50" : "#9e9e9e",
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          sx={{
            ...commonStyles.commonSubHeadingStyles,
            mb: 1,
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
          }}
        >
          {isValuation ? `Brand: ${brandName || "---"}` : (brandName || "N/A")}
        </Typography>

        <Typography
          sx={{
            ...commonStyles.commonTextStyles,
            mb: 0.5,
            fontSize: { xs: "12px", sm: "14px" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Model: {isValuation 
            ? (certificate.model || certificate.certificate?.product_name || "---")
            : (certificate.model || certificate.certificate?.product_name || "N/A")}
        </Typography>

        <Typography
          sx={{
            ...commonStyles.commonTextStyles,
            mb: 0.5,
            fontSize: { xs: "11px", sm: "12px" },
            color: "#666",
          }}
        >
          Date: {isValuation 
            ? (valuationDate ? new Date(valuationDate).toLocaleDateString() : "---")
            : (certificate.certificate?.date
              ? new Date(certificate.certificate.date).toLocaleDateString()
              : certificate.created_at
              ? new Date(certificate.created_at).toLocaleDateString()
              : "N/A")}
        </Typography>

        {isValuation ? (
          <>
            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                mb: 0.5,
                fontSize: { xs: "11px", sm: "12px" },
                color: "#666",
              }}
            >
              Certificate Number: {certificateNumber || "---"}
            </Typography>


            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                mb: 0.5,
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: "600",
                color: "#333",
              }}
            >
              Valuation: {valuationPrice ? `$${valuationPrice}` : "---"}
            </Typography>

            <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                fontSize: { xs: "11px", sm: "12px" },
                color: "#666",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              Description: {description || "---"}
            </Typography>
          </>
        ) : (
          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              fontSize: { xs: "11px", sm: "12px" },
              color: "#666",
            }}
          >
            Order: {orderNumber || "N/A"}
          </Typography>
        )}
     {valuationWithCertificatePrice!=null && !isValuation? (
          <>
    <Typography
              sx={{
                ...commonStyles.commonTextStyles,
                mb: 0.5,
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: "600",
                color: "#333",
              }}
            >
              Valuation: {valuationWithCertificatePrice ? `$${valuationWithCertificatePrice}` : "---"}
            </Typography>
</>) 
:(<> </>)}
        {/* Pending Message */}
        {isMorePhotoRequested && isPending && status === 'Pending' && !isValuation && (
          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: "10px", sm: "11px" },
              color: "#f44336",
              fontStyle: "italic",
            }}
          >
            * More photos required for proper authentication
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateCard;

