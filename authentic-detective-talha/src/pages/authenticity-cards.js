import Layout from "@/components/layout";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import AuthenticityCards from "@/components/authenticity-cards/index";
import { NextSeo } from "next-seo";

export default function AuthenticityCard() {
  const seo = {
    title: "Authenticity cards",
    description: "detail of cards",
  };

  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}
        <AuthenticityCards />
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
