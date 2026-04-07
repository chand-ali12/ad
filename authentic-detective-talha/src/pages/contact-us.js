import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import ContactComponent from "@/components/contact";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

export default function ContactUs() {
  const seo = {
    title: "Contact us",
    description: "for queries",
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
          <ContactComponent />
          {/* <Footer /> */}
        </Layout>
      {/* </Box> */}
    </>
  );
}
