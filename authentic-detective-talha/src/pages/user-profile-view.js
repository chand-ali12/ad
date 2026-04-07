import React from "react";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import UserProfileView from "@/components/view-profile";
import { Box } from "@mui/material";
import Layout from "@/components/layout";
function UserProfile() {
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
      <Layout>
        <UserProfileView />
      </Layout>
      {/* <Footer /> */}
      {/* </Box> */}
    </>
  );
}

export default UserProfile;
