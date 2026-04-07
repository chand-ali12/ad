import { NextSeo } from "next-seo";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import ForgotPassword from "@/components/forget-password";
import { Box } from "@mui/material";
import Layout from "@/components/layout";
export default function ForgetPassword() {
  const seo = {
    title: "Forgot Password",
    description: "forgot password ",
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
        <Layout seo={seo}>
          {/* <Header /> */}
          <ForgotPassword />
          {/* <Footer /> */}
        </Layout>
      {/* </Box> */}
    </>
  );
}
