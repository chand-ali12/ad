import ProfilePage from "@/components/profile-page";
import Header from "../../components/home-components/header";
import Footer from "@/components/home-components/footer";
import { NextSeo } from "next-seo";
import { Box } from "@mui/material";
import Layout from "@/components/layout";

export default function UserProfile({ id }) {
  const seo = {
    title: "Business Details",
    description: "business information and reviews",
  };
  return (
    <>
      <Layout seo={seo}>
        <ProfilePage userId={id} />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
