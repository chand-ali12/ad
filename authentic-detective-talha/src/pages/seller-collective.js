import BusinessCollection from "@/components/seller-collecton";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

export default function Seller() {
  const seo = {
    title: "Seller Collective",
    description: "view of all businesses",
  };
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
      <Layout seo={seo}>
        {/* <Header /> */}
        <BusinessCollection />
        {/* <Footer /> */}
      </Layout>
      {/* </Box> */}
    </>
  );
}
