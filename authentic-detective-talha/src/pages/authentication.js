import Header from "../components/home-components/header";

import Authenticate from "@/components/authentication/authenticate";
import AdFormSection from "@/components/authentication/authenticate/form";
import Footer from "@/components/home-components/footer";
import { useRef, useState } from "react";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";

export default function Authentication() {
  const [bulkPage, setBulkPage] = useState(false);
  const [quantity, setQuantity] = useState("");
  const sectionRef = useRef(null);
  const scrollToSection = () => {
    const element = sectionRef.current;
    const elementTop = element.getBoundingClientRect().top + window.scrollY; // Get the absolute position of the element
    const scrollPosition = elementTop - (bulkPage ? 185 : 255); // Calculate the new scroll position

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  const seo = {
    title: "Verify Luxury Goods Online | Authentic Detective",
    description: "Get expert luxury item authentication and a certified authenticity certificate with every check. Fast, reliable verification for bags, shoes, watches & accessories online.",
  };
  return (
    <>
      {/* <NextSeo {...seo} /> */}
      <Layout seo={seo}>
        {/* <Header /> */}

        <Authenticate
          bulkPage={bulkPage}
          setBulkPage={setBulkPage}
          quantity={quantity}
          setQuantity={setQuantity}
          scrollToSection={scrollToSection}
          sectionRef={sectionRef}
        />
        <AdFormSection
          bulkPage={bulkPage}
          setBulkPage={setBulkPage}
          quantity={quantity}
          setQuantity={setQuantity}
          sectionRef={sectionRef}
          scrollToSection={scrollToSection}
        />

        {/* <Footer /> */}
      </Layout>
    </>
  );
}
