import React, { useState, useRef } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { commonStyles } from "@/commonStyles";
import { UploadMediaToS3 } from "../../../utils/common-functions/uploadMedia";
import ImageGrid from "@/common-components/display-images";
import TickAnimation from "@/common-commponent/animations";
import { getRequestedAttributes } from "../../../utils/certificate-helpers";
import CustomErrorMessage from "@/common-commponent/error-message";

const RequestMoreImagesModal = ({
  open,
  onClose,
  certificate,
  onSubmit,
  isAdminRequested = false,
}) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  const requestedAttributes = getRequestedAttributes(certificate);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    if (files.length > validFiles.length) {
      setImageError(true);
      return;
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    setImageError(false);

    try {
      const uploadPromises = validFiles.map((file) =>
        UploadMediaToS3(file, "authenticateImage")
      );

      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((result) => result !== undefined);

      if (validResults.length > 0) {
        setImages((prevImages) => [...validResults, ...prevImages]);
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      setImageError(true);
      return;
    }

    if (onSubmit) {
      onSubmit(certificate, images.join(","));
    }

    // Reset state
    setImages([]);
    setImageError(false);
    onClose();
  };

  const handleClose = () => {
    setImages([]);
    setImageError(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            ...commonStyles.commonHeadingStyles,
            fontSize: { xs: "18px", sm: "20px" },
          }}
        >
          {isAdminRequested
            ? "Submit Requested Images"
            : "Add Additional Images"}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {isAdminRequested && requestedAttributes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  mb: 1,
                  fontWeight: "600",
                }}
              >
                Requested photos:
              </Typography>
              <Typography
                sx={{
                  ...commonStyles.commonTextStyles,
                  color: "#666",
                }}
              >
                {requestedAttributes.join(", ")}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <Box
              onClick={handleImageClick}
              sx={{
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed #ccc",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
                mb: 2,
              }}
            >
              <IconButton color="primary" aria-label="upload photo">
                <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {imageError && (
              <CustomErrorMessage errorMessage="Please select at least one image" />
            )}
          </Box>

          {images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <ImageGrid
                displayImages={images}
                handleRemoveImage={handleRemoveImage}
              />
            </Box>
          )}

          <Typography
            sx={{
              ...commonStyles.commonTextStyles,
              fontSize: { xs: "11px", sm: "12px" },
              color: "#666",
              fontStyle: "italic",
            }}
          >
            To avoid delay please make sure you submit at least 6 images,
            including clear photos of all the logos, heat stamps, hardware, and
            serial numbers.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              ...commonStyles.buttonCommonStyles,
              color: "#666",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={images.length === 0 || uploading}
            sx={{
              ...commonStyles.buttonCommonStyles,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
              "&.Mui-disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            {uploading ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        aria-labelledby="success-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 200, sm: 300, md: 350 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            fontFamily: "montserrat",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: { xs: 40, md: 50 },
              color: "green",
              animation: `${TickAnimation} 0.6s ease-in-out`,
            }}
          />
          <Typography
            id="success-modal-title"
            sx={{
              mb: 2,
              mt: 2,
              ...commonStyles.modalHeading,
              fontWeight: "bold",
            }}
          >
            Upload Successful!
          </Typography>
          <Typography
            sx={{
              mt: 2,
              ...commonStyles.modalText,
            }}
          >
            Your images have been uploaded successfully.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default RequestMoreImagesModal;

