"use-client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@mui/material";

const AdImage = (props) => {
  const { zIndex = -1, layout } = props;
  const imageProps = { ...props };
  if (layout == "default") {
    return <CustomImage {...imageProps} />;
  }
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <CustomImage {...props} />
    </Box>
  );
};

export default AdImage;

const CustomImage = (props) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show the image after a delay (3 seconds in this case)

    const timeoutId = setTimeout(() => {
      setFade(true);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const {
    renderError,
    onLoad,
    fill = true,
    style,
    applyFadeEffect = true,
  } = props;
  if (error && renderError) {
    return renderError();
  }
  return (
    <Image
      sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
      fill={fill}
      {...props}
      className={applyFadeEffect ? `fade-in ${fade ? "image-loaded" : ""}` : ""}
      style={{
        ...style,
        // objectFit: style?.objectFit ? style?.objectFit : "cover",
        // backgroundColor: error ? "#eae9e7ff" : "transparent",
      }}
      src={props.src}
      onError={() => {
        setError(true);
      }}
      // placeholder={blur}
      onLoad={() => {
        setLoaded(true);
        if (onLoad) onLoad();
      }}
      loading={props.priority ? "eager" : "lazy"}
      alt={props?.alt ? props?.alt : "Authentic-detective"}
    />
  );
};
