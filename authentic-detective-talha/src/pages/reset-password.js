import { NextSeo } from "next-seo";
import Footer from "../components/home-components/footer";
import Header from "../components/home-components/header";
import ResetPassword from "@/components/reset-password";
import Layout from "@/components/layout";
export default function Resetpassword() {
  const seo = {
    title: "Reset Password",
    description: "reset password",
  }
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}
        <ResetPassword />
        {/* <Footer /> */}
      </Layout>
    </>
  );
}
