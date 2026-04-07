import React from "react";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import ProfilePage from "@/components/profile-page";
import BusinessProfilePage from "@/components/profile-page/buiness-profile-page";
import CertificatesSection from "@/components/certificates";
import { useSelector } from "react-redux";
import { currentUserInformation } from "@/store/slice/userData";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

function Profile() {

  const currentUserInfo = useSelector(currentUserInformation);

  const seo = {
    title: "Profile",
    description: "user information",
  };

  return (
    <>
      {/* <NextSeo {...seo} /> */}

      {/* <Header />
      {console.log("current userInfo: ", currentUserInfo)}
      {currentUserInfo?.apiRole == "business-user" && <BusinessProfilePage />}
      {currentUserInfo?.apiRole == "user" && <ProfilePage />}
      <Footer sx={{bottom:0}} /> */}

      {/* <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      > */}
        <Layout seo={seo}>
        {/* <Header /> */}
          {/* {console.log("current userInfo: ", currentUserInfo)} */}

          <Box sx={{ flex: 1 }}>
            {currentUserInfo?.apiRole === "business-user" && (
              <BusinessProfilePage />
            )}
            {currentUserInfo?.apiRole === "user" && <ProfilePage />}
            
            {/* Certificates Section */}
            <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }, py: 4 }}>
              <CertificatesSection />
            </Box>
          </Box>

          {/* <Footer
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        /> */}
        </Layout>
      {/* </Box> */}
    </>
  );
}

export default Profile;
