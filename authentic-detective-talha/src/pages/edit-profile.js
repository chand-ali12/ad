import EditProfile from "@/components/editProfile/profile";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

export default function EditProfilePage() {
  const seo = {
    title: "Update Business Profile",
    description: "edit business information",
  };

  return (
    <>
      {/* <NextSeo {...seo} /> */}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      > */}
        <Layout seo={seo}>
          {/* <Header /> */}
          <EditProfile />
          {/* <Footer /> */}
        </Layout>
      {/* </Box> */}
    </>
  );
}
