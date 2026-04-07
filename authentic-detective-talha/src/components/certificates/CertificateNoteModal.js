import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { commonStyles } from "@/commonStyles";

const CertificateNoteModal = ({ open, onClose, certificate, onSave }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (certificate && open) {
      setNote(certificate.certificate?.note || "");
    }
  }, [certificate, open]);

  const handleSave = () => {
    if (onSave) {
      onSave(certificate, note);
    }
    onClose();
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
        Add Note
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
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
          onClick={handleSave}
          variant="contained"
          sx={{
            ...commonStyles.buttonCommonStyles,
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateNoteModal;

