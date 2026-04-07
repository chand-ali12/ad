import * as React from "react";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none"
});

export default function Upload({ onFileSelect }) {
  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return alert("Please select a file.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label htmlFor="image-upload">
      <Input
        accept="image/*"
        id="image-upload"
        type="file"
        onChange={handleChange}
      />
      {/* This label will be styled to look like the image, so no button is needed */}
    </label>
  );
}
