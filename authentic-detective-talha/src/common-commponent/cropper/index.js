// import React, { useState, useRef } from "react";
// import ReactCrop, {
//   centerCrop,
//   makeAspectCrop,
//   convertToPixelCrop,
// } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
// import { Button, Box } from "@mui/material";
// import Image from "next/image";
// import { commonStyles } from "@/commonStyles";
// function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
//   return centerCrop(
//     makeAspectCrop(
//       {
//         unit: "%",
//         width: 90,
//       },
//       aspect,
//       mediaWidth,
//       mediaHeight
//     ),
//     mediaWidth,
//     mediaHeight
//   );
// }

// function CropperDemo({ src, onCropComplete }) {
//   const [crop, setCrop] = useState();
//   const [aspect, setAspect] = useState(1 / 1); // Set to 1:1 aspect ratio
//   const imgRef = useRef(null);

//   // function onImageLoad(e) {
//   //   const { width, height } = e.currentTarget;
//   //   setCrop(centerAspectCrop(width, height, aspect));
//   // }

//   function onImageLoad(e) {
//     const { width, height } = e.currentTarget;
//     setCrop(null); // Reset the crop when loading a new image
//     setCrop(centerAspectCrop(width, height, aspect));
//   }


//   function handleCompleteCrop() {
//     if (imgRef.current && crop.width && crop.height) {
//       const image = imgRef.current;
//       const scaleX = image.naturalWidth / image.width;
//       const scaleY = image.naturalHeight / image.height;
//       const pixelCrop = convertToPixelCrop(crop, image.width, image.height);

//       const canvas = document.createElement("canvas");
//       canvas.width = pixelCrop.width;
//       canvas.height = pixelCrop.height;
//       const ctx = canvas.getContext("2d");

//       ctx.drawImage(
//         image,
//         pixelCrop.x * scaleX,
//         pixelCrop.y * scaleY,
//         pixelCrop.width * scaleX,
//         pixelCrop.height * scaleY,
//         0,
//         0,
//         pixelCrop.width,
//         pixelCrop.height
//       );

//       canvas.toBlob((blob) => {
//         const croppedImageUrl = URL.createObjectURL(blob);
//         onCropComplete(croppedImageUrl);
//       }, "image/jpeg");
//     }
//   }

//   return (
//     <Box
//       sx={{
//         width: "60%",

//         // height:"100vh",
//         display: "flex",
//         marginTop: 1,
//         minHeight:"-webkit-fill-available",
//         flexDirection: "column", // Ensure content is stacked vertically
//         alignItems: "center", // Center items horizontally
//         justifyContent: "center", // Center items vertically (if needed)
//       }}
//     >
//       <ReactCrop
//         crop={crop}
//         onChange={(_, percentCrop) => setCrop(percentCrop)}
//         aspect={aspect}
//         minWidth={100}
//         minHeight={100}
//         style={{ width: "80%" }} // Ensure ReactCrop takes full width of the Box
//       >
//         <Image
//           ref={imgRef}
//           alt="Crop me"
//           src={src}
//           layout="responsive"
//           width={700}
//           height={475}
//           onLoad={onImageLoad}
//         />
//       </ReactCrop>
//       <Button
//         sx={{
//           ...commonStyles.buttonCommonStyles,
//           mt: 2,
//           mb: 1,
//           backgroundColor: "black",
//           "&:hover": {
//             backgroundColor: "black",
//             boxShadow: "none",
//           },
//         }}
//         onClick={handleCompleteCrop}
//         variant="contained"
//       >
//         Crop
//       </Button>
//     </Box>
//   );
// }
// export default CropperDemo;


import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button, Box, Slider } from "@mui/material";
import { commonStyles } from "@/commonStyles"; // Assume your common styles are here

function CropperDemo({ src, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation) => {
    setRotation(rotation);
  }, []);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCompleteCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(src, croppedAreaPixels, rotation);
      onCropComplete(croppedImage); // Use the prop `onCropComplete`
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, onCropComplete, src]);

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    if (onCancel) onCancel(); // Notify the parent to reset the cropper state
  };
  

  // const handleCancel = () => {
  //   // Reset the cropper state
  //   setCrop({ x: 0, y: 0 });
  //   setZoom(1);
  //   setRotation(0);
  //   setCroppedAreaPixels(null);
  //   if (onCancel) onCancel(); 
  // };

  return (
    <Box
      sx={{
        overflowX:"hidden",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "70%",
          minHeight: "200px", 
        }}
      >
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          onCropComplete={handleCropComplete} // Use the renamed function here
        />
      </Box>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          <p>Zoom</p>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </Box>
        <Box>
          <p>Rotation</p>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            onChange={(e, rotation) => setRotation(rotation)}
          />
        </Box>
        <Box sx={{ display: "flex",justifyContent:"center",alignItems:"center", gap: 3 }}>
         
          <Button
            sx={{
              ...commonStyles.buttonCommonStyles,
              mt: 2,
              mb: 1,
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "gray",
                boxShadow: "none",
              },
            }}
            onClick={handleCancel}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            sx={{
              ...commonStyles.buttonCommonStyles,
              mt: 2,
              mb: 1,
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "black",
                boxShadow: "none",
              },
            }}
            onClick={handleCompleteCrop}
            variant="contained"
          >
            Crop
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CropperDemo;

// Helper function to create a cropped image
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
