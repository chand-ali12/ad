import EditProfile from "@/components/editProfile/profile";
import Header from "../components/home-components/header";
import Footer from "@/components/home-components/footer";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";
import EditProfiles from "../components/edit-profiles";
import Learning from "../components/learning-edit-profile";

export default function UpdateProfilePage() {
  const seo = {
    title: "Update  Profile",
    description: "edit  information",
  };

  return (
    <>
      <Layout seo={seo}>
        <Learning />
      </Layout>
    </>
  );
}
