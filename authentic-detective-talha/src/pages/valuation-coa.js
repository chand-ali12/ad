import React from "react";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import Valuation from "@/components/valuation-coa";
import { Box } from "@mui/material";
import Layout from "@/components/layout";
function ValuationCoa() {
  const seo = {
    title: "COA & Valuation Services | Authentic Detective Experts",
    description: "Get expert COA and valuation services from Authentic Detective for luxury bags, shoes, watches & accessories. Trusted authenticity and value reporting online.",
  }
  return (
    <>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Makes the Box fill the viewport height
        }}
      > */}
      {/* <Header /> */}
      <Layout seo={seo}>
        <Valuation />
      </Layout>
      {/* <Footer /> */}
      {/* </Box> */}
    </>
  );
}

export default ValuationCoa;
