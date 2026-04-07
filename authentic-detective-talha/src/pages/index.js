import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import HomeCover from "../components/home-components/homeCover";
import TheVault from "@/components/home-components/theVault";
import AuthentiCards from "@/components/home-components/cards";
import SellersCollective from "@/components/home-components/sellers";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import SubscriptionModal from "@/components/show-subscriptions-modal";
import Layout from "@/components/layout";

export default function Home() {
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);

  useEffect(() => {
    // Check localStorage for "do not show again" preference
    const doNotShowAgain = localStorage.getItem("doNotShowModal");

    // If "do not show again" is not set, check sessionStorage for current session status
    if (!doNotShowAgain) {
      const hasVisitedBefore = sessionStorage.getItem("hasVisitedHomePage");
      if (!hasVisitedBefore) {
        setShowSubscriptionsModal(true);
        sessionStorage.setItem("hasVisitedHomePage", "true");
      }
    }
  }, []);

  const handleClose = () => {
    setShowSubscriptionsModal(false);
  };

  const handleDoNotShowAgain = (checked) => {
    if (checked) {
      localStorage.setItem("doNotShowModal", "true");
    } else {
      localStorage.removeItem("doNotShowModal");
    }
  };

  const seo = {
    title: "Authenticate Designer Bags & Shoes | Authentic Detective",
    description:
      "Authenticate luxury bags, shoes, watches & accessories with expert verification. Authentic Detective provides fast, trusted authentication certificates online.",
  };

  return (
    <>
      <Layout seo={seo}>
        <Box
          sx={{
            pl: { xs: 0, sm: 7, md: 9, lg: 11, xl: 12 },
            pr: { xs: 0, sm: 7, md: 9, lg: 11, xl: 12 },
          }}
        >
          <HomeCover />
          <TheVault />
          <AuthentiCards />
          <SellersCollective />
        </Box>
      </Layout>
      {/* <NextSeo {...seo} />

      <Header />
      <Box
        sx={{
          pl: { xs: 0, sm: 7, md: 9, lg: 11, xl: 12 },
          pr: { xs: 0, sm: 7, md: 9, lg: 11, xl: 12 },
        }}
      >
        <HomeCover />
        <TheVault />
        <AuthentiCards />
        <SellersCollective />

      </Box>
      <Footer />

      {/* Show modal only on first visit in this session */}
      {/* <SubscriptionModal
        open={showSubscriptionsModal}
        handleClose={handleClose}
        handleDoNotShowAgain={handleDoNotShowAgain}
      /> */}
    </>
  );
}
