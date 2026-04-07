import { NextSeo } from "next-seo";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import SubscriptionsPage from "@/components/subscriptions-page";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

export default function Subscriptions() {
  const seo = {
    title: "Authentication Subscriptions | Authentic Detective Plans",
    description: "Join Authentic Detective subscription plans for priority luxury authentication, exclusive benefits, faster turnaround and expert verification for designer items online.",
  }

  return (
    <>
      {/* <NextSeo {...seo} /> */}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Makes the Box fill the viewport height
        }}
      > */}
      {/* <Header /> */}
      <Layout seo={seo}>
        <SubscriptionsPage />
        {/* <Footer /> */}
      </Layout>
    {/* </Box > */}
    </>
  );
}
