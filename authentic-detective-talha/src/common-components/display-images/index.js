import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, Typography, Skeleton, Grid } from "@mui/material";
import CustomErrorMessage from "@/common-commponent/error-message";

// Single Image component with loader
const LoadingImage = ({ src, onRemove }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {isLoading && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            bgcolor: "grey.200",
          }}
        />
      )}

      {/* Image */}
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/authenticateImage/${src}`}
          alt="Image"
          fill
          sizes="(max-width: 768px) 30vw, 10vw"
          style={{ objectFit: "cover" }}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      </Box>

      {/* Error state */}
      {error && (
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "red",
          }}
        >
          Failed to load
        </Typography>
      )}

      {/* Remove button */}
      <Box
        sx={{
          position: "absolute",
          top: 5,
          left: 5,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 2,
        }}
        onClick={onRemove}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          X
        </Typography>
      </Box>
    </Box>
  );
};

// Main ImageGrid component
const ImageGrid = ({ displayImages, handleRemoveImage, errors }) => {
  return (
    <>
      <Grid container spacing={1} justifyContent="flex-start" ml={1}>
        {displayImages?.map((src, index) => (
          <Grid
            item
            xs={3}
            sm={2.4}
            md={2}
            lg={1.5}
            key={`${src}-${index}`}
          >
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1/1",
              }}
            >
              <LoadingImage src={src} onRemove={() => handleRemoveImage(index)} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {errors?.image && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <CustomErrorMessage errorMessage={errors.image.message} />
        </Box>
      )}
    </>
  );
};

export default ImageGrid;
