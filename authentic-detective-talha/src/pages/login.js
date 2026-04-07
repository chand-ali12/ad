import UserSignUpComponent from "@/components/signUp-components/signUp";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";

export default function UserSignUp() {
  const seo = {
    title: "Login",
    description: "login page",
  };

  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>

        {/* <Header /> */}
        <UserSignUpComponent />
      </Layout>
      {/* <Footer /> */}
    </>
  );
}
