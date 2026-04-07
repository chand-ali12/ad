import AuthentiCards from "@/components/home-components/cards";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import AuthenticityCard from "@/components/authenticityCards/authenticCard";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";

export default function UserSignUp() {
  const seo = {
    title: "Authenticity Cards Service | Authentic Detective Verifies",
    description: "Authentic Detective provides authenticity cards with expert verification for luxury items. Secure your certificate of authenticity for bags, shoes and accessories online.",
  };
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}
        <AuthenticityCard />
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
