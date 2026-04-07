import UpdatePassword from "@/components/update-password";
import React from "react";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

function UpdatePasswordPage() {
  const seo = {
    title: "Change Password",
    description: "Change password",
  };
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Makes the Box fill the viewport height
        }}
      > */}

        {/* <Header /> */}
        <UpdatePassword />
        {/* <Footer /> */}
        {/* </Box> */}
      </Layout>
    </>
  );
}

export default UpdatePasswordPage;
