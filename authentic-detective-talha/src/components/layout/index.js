import { useEffect, useState } from "react";
import {
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    Box,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Footer from "../home-components/footer";
import Header from "../home-components/header";
import { currentUserInformation } from "@/store/slice/userData";
import { commonStyles } from "@/commonStyles";

let hasShownCertificatesModalThisSession = false;

// import UpdatedHeader from "../updated-header";

export default function Layout(props) {
    const { children, seo } = props;
    const router = useRouter();
    const userInfo = useSelector(currentUserInformation);
    const isLoggedIn = !!(userInfo && Object.keys(userInfo)?.length > 0);

    const [showCertificatesModal, setShowCertificatesModal] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const hasDismissed = window.localStorage.getItem("certificatesModalDismissed");
        if (hasDismissed) {
            return;
        }
        if (hasShownCertificatesModalThisSession) {
            return;
        }
        hasShownCertificatesModalThisSession = true;
        setShowCertificatesModal(false);
        /*todo: set true to show popup*/
    }, []);

    const dismissModal = () => {
        setShowCertificatesModal(false);
        if (typeof window !== "undefined") {
            if (dontShowAgain) {
                window.localStorage.setItem("certificatesModalDismissed", "true");
            }
        }
    };

    const handleGoToCertificates = () => {
        dismissModal();
        router.push(isLoggedIn ? "/profile" : "/login");
    };

    useEffect(() => {
        if (showCertificatesModal) {
            setDontShowAgain(false);
        }
    }, [showCertificatesModal]);

    return (
        <Container
            maxWidth={false}
            disableGutters={true}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <header>{seo && <NextSeo {...seo} />}</header>
            <main
                style={{
                    flex: 1,
                }}
            >
                <Header />
                {/* <UpdatedHeader /> */}

                {children}
            </main>
            <footer>
                <Footer />
            </footer>

            <Dialog
                open={showCertificatesModal}
                onClose={dismissModal}
                aria-labelledby="new-certificates-dialog-title"
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: { xs: 2, sm: 3 },
                        position: "absolute",
                        top: { xs: "5%", sm: "10%" },
                        mx: { xs: 2, sm: "auto" },
                    },
                }}
            >
                <DialogTitle
                    id="new-certificates-dialog-title"
                    sx={{
                        ...commonStyles.commonSubHeadingStyles,
                        fontSize: { xs: "20px", sm: "24px" },
                        fontWeight: 600,
                        pr: 5,
                        position: "relative",
                        pb: 1,
                    }}
                >
                    {"Pricing Update!"}
                    <IconButton
                        aria-label="close"
                        onClick={dismissModal}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        pt: 1,
                        pb: { xs: 2, sm: 3 },
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography
                            sx={{
                                ...commonStyles.commonTextStyles,
                                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                lineHeight: 1.6,
                            }}
                        >
                          Our Certificate of Authenticity is now $12 to support ongoing costs and upcoming feature
                          enhancements designed to improve your experience.
                        </Typography>
                        <Typography
                            sx={{
                                ...commonStyles.commonTextStyles,
                                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                lineHeight: 1.6, fontWeight: { bold: 600 },
                            }}
                        >
                          Discounted rates are available through our subscription plans, and pricing for Jewelry and
                          Premium Brands remains unchanged at this time.
                        </Typography>
                        <Typography
                            sx={{
                                ...commonStyles.commonTextStyles,
                                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                lineHeight: 1.6,
                            }}
                        >
                          Thank you for your continued support.
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={dontShowAgain}
                                onChange={(event) => setDontShowAgain(event.target.checked)}
                                sx={{
                                    color: "#000",
                                    "&.Mui-checked": {
                                        color: "#000",
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    ...commonStyles.commonTextStyles,
                                    fontSize: { xs: "12px", sm: "13px" },
                                }}
                            >
                                Don’t show this again
                            </Typography>
                        }
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "stretch",
                        gap: 1,
                        pt: { xs: 1, sm: 2 },
                    }}
                >
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                        {/*<Button
                            variant="contained"
                            onClick={handleGoToCertificates}
                            sx={{
                                ...commonStyles.buttonCommonStyles,
                                flex: 1,
                                backgroundColor: "black",
                                color: "white",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                },
                            }}
                        >
                            Go to My Certificates
                        </Button>*/}
                        <Button
                            variant="outlined"
                            onClick={dismissModal}
                            sx={{
                                ...commonStyles.buttonCommonStyles,
                                flex: 1,
                                borderColor: "#000",
                                color: "#000",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                    borderColor: "#333",
                                },
                            }}
                        >
                            OK
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
