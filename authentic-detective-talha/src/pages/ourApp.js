import OurAppCom from "@/components/ourApp-components/appGrid.js";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";

export default function OurApp() {
  const seo = {
    title: "Our App",
    description: "about us",
  };
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}
        <OurAppCom />
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
