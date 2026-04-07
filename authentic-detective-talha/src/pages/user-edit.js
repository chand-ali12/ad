import Layout from "@/components/layout";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import EditUserProfilePage from "@/components/user-edit-profile";
import { Box } from "@mui/material";
import { NextSeo } from "next-seo";
export default function EditProfilePage() {
  const seo = {
    title: "Update User Profile",
    description: "edit user information",
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

      {/* <Header /> */}
      <Layout seo={seo}>
        <EditUserProfilePage />
        {/* <Footer /> */}
      </Layout>
    {/* </Box > */}
    </>
  );
}
