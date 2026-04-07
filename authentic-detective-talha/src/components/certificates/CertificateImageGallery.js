import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CertificateImageGallery = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Typography>No images available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
      }}
    >
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 16,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Certificate image ${currentIndex + 1}`}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          borderRadius: 2,
        }}
      />

      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontFamily: "var(--font-montserrat)",
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      )}

      {/* Thumbnail strip for multiple images */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            maxWidth: "90%",
            overflowX: "auto",
            pb: 1,
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 60,
                height: 60,
                position: "relative",
                cursor: "pointer",
                border:
                  currentIndex === index ? "2px solid white" : "2px solid transparent",
                borderRadius: 1,
                opacity: currentIndex === index ? 1 : 0.7,
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`Thumbnail ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CertificateImageGallery;

