import Layout from "@/components/layout";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import SignUpComponent from "@/components/signUpnew-component";
import { NextSeo } from "next-seo";

export default function UserSignUpPage() {
  const seo = {
    title: "Sign up",
    description: "sign up page",
  };

  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}
        <SignUpComponent />
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
