import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

const TermsAndSubmit = ({ register, errors, handleRecaptcha }) => {
  return (
    <>
      <Box pt={3} sx={{ paddingLeft: { xs: "5%", md: "0%" } }}>
        <FormControlLabel
          control={<Checkbox {...register("terms")} />}
          label={
            <Typography
              id="term"
              name="term"
              variant="caption"
              sx={{
                fontSize: "13px",
                color: "black",
              }}
            >
              By Signing Up, you accept the{" "}
              <span style={{ color: "blue", cursor: "pointer" }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span style={{ color: "blue", cursor: "pointer" }}>
                Privacy Policy
              </span>
            </Typography>
          }
        />
        {errors.terms && (
          <Typography color="error" variant="body2">
            {errors.terms.message}
          </Typography>
        )}
      </Box>

      <Box mt={5}>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
          onChange={handleRecaptcha}
        />
      </Box>

      <Box
        pt={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          type="submit"
          sx={{
            width: "100%",
            textTransform: "Capitalize",
            color: "white",
            bgcolor: "black",
            fontWeight: "600",
            fontSize: { xs: "12px", md: "16px" },
            padding: { xs: "5px 55px", lg: "9px 80px" },
            "&:hover": {
              backgroundColor: "black",
            },
            marginRight: "16px",
          }}
        >
          Create Free Account
        </Button>
      </Box>

      <Box
        pt={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="caption"
          color="initial"
          sx={{
            color: "black",
            fontSize: "13px",
          }}
        >
          Already have an account?
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <b> Sign In!</b>
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default TermsAndSubmit;
