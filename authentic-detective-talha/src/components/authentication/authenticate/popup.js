import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CropperDemo from "./cropper";

export default function Popup({ open, imageSrc, onClose, onCropComplete }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent>
        <CropperDemo src={imageSrc} onCropComplete={onCropComplete} />
      </DialogContent>
    </Dialog>
  );
}
