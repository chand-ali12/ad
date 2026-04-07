"use-client";

import ReceiptGenerator from "@/components/receipt-making";
import Header from "@/components/home-components/header";
import Footer from "@/components/home-components/footer";
import { Box } from "@mui/material";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";

export default function Receipt() {
  const seo = {
    title: "Reciept",
    description: "records of all payments and products",
  };
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        <ReceiptGenerator />
      </Layout>
    </>
  );
}
