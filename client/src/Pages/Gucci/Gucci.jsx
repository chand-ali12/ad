import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ContentHeroSection from "../../components/client/ContentHeroSection/ContentHeroSection";
import AboutBrand from "../../sections/BrandSection/AboutBrand/AboutBrand";
import PremiumAuthentication from "../../sections/BrandSection/PremiumAuthentication/PremiumAuthentication";
import ServiceSection from "../../sections/BrandSection/ServiceSection/ServiceSection";
import DateCodeReference from "../../sections/BrandSection/DateCodeReference/DateCodeReference";
import AppDownload from "../../sections/BrandSection/AppDownload/AppDownload";
import whiteshoesImage from "../../assets/images/whiteshoes.jpg";
import { Shield, Eye, Award } from "lucide-react";

// Using existing images (can be replaced with Gucci-specific images later)
import GucciSection1 from "../../assets/images/Gucci_section_1.jpeg";
import GucciSection2 from "../../assets/images/Gucci_section_2.jpeg";
import GucciSection3 from "../../assets/images/Gucci_section_3.jpeg";

// Detailed Guide Section Component for Gucci's extensive content
const AuthenticationGuideSection = ({ guides = [] }) => {
  return (
    <section className="py-12 w-full bg-white sm:py-16 md:py-20">
      <div className="px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-wide text-center uppercase sm:text-3xl md:text-4xl text-primary sm:mb-10 md:mb-12">
          Complete Authentication Guide
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-[#F5F5F0] rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-bold sm:text-xl text-primary">
                {guide.title}
              </h3>
              {guide.content && (
                <ul className="space-y-3">
                  {guide.content.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 items-start text-sm leading-relaxed sm:text-base text-primary/80"
                    >
                      <span className="flex-shrink-0 font-bold text-primary">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

AuthenticationGuideSection.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

// Common Signs Section
const CommonSignsSection = ({ title, signs = [] }) => {
  return (
    <section className="py-12 w-full sm:py-16 md:py-20 bg-primary">
      <div className="px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-wide text-center uppercase sm:text-3xl md:text-4xl text-secondary sm:mb-10">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {signs.map((sign, index) => (
            <div
              key={index}
              className="bg-[#F5F5F0] rounded-xl p-5 sm:p-6 text-center"
            >
              <div className="flex justify-center items-center mx-auto mb-3 w-10 h-10 bg-red-100 rounded-full">
                <span className="text-lg font-bold text-red-600">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm font-medium sm:text-base text-primary">
                {sign}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

CommonSignsSection.propTypes = {
  title: PropTypes.string,
  signs: PropTypes.arrayOf(PropTypes.string),
};

const Gucci = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/authentication");
  };

  const handleLearnMoreClick = () => {
    console.log("Learn more clicked for Gucci");
  };

  // About Gucci data
  const aboutData = {
    title: "Why Authenticating a Gucci Bag Matters",
    paragraphs: [
      "Since Guccio Gucci founded his Florentine leather goods shop in 1921, the house has embodied exceptional craftsmanship and innovation. Ensuring you purchase an authentic Gucci handbag means investing in long-term resale value, superior materials and construction, and a reliable luxury piece that will last for years.",
      "Counterfeit Gucci bags often mimic the look but rarely match the structure, stitching, or premium feel of a genuine piece. Understanding the differences is key to accurate Gucci authentication and smarter luxury purchases.",
    ],
    milestones: [],
    closingText: "",
  };

  // Service Section data
  const serviceCards = [
    {
      title: "How Authentic Detective Helps Verify Gucci Bags",
      content: [
        "Fast, accurate Gucci authentication with expert evaluations from trained authenticators.",
        "Detailed reporting with friendly customer support and high trust and transparency.",
        "Whether you want to confirm an authentic Gucci handbag, verify an authentic Gucci strap, or complete a full Gucci bag authentication, Authentic Detective provides reliable, professional guidance.",
      ],
    },
    {
      title: "Buy From Trusted Sources Only",
      content: [
        "Purchase from Gucci boutiques or authorized retail partners.",
        "Use reputable resale marketplaces with transparent photos and return policies.",
        "Avoid random social media sellers or drastically underpriced listings—these are the most common sources of counterfeits.",
      ],
    },
  ];

  // 3 Key Ways to Authenticate - Cards data
  const authCards = [
    {
      image: GucciSection1,
      imageAlt: "Gucci Style Code",
      title: "1. Style Code: Most Important Marker",
      description:
        "Gucci does not use a traditional number; instead, most authentic Gucci bags feature style codes. These vary in length and grouping depending on their age. ",
      features: [
        "Clean crisp embossing",
        "Fonts depending on age & factory",
        "Located on the interior leather, often under the GUCCI label or on the interior leather trim",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Shield,
      showPopularTag: false,
    },
    {
      image: GucciSection2,
      imageAlt: "Gucci Hardware Engravings",
      title: "2. Hardware Engravings",
      description:
        "Gucci hardware has widely evolved since the brand’s founding. However, authentic hardware is solid and expertly engraved.",
      features: [
        "Clear, legible logos",
        "Depth may vary",
        "Consistent plating without bubbling",
        "Engravings seen on zippers, zipper pulls, clasps, etc.",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Eye,
      showPopularTag: false,
    },
    {
      image: GucciSection3,
      imageAlt: "Gucci Materials",
      title: "3. Materials: Leather, Monogram Canvas, & More",
      description:
        "Gucci has consistently invested in premium materials for all of their pieces.",
      features: [
        "Leather: Full-Grain hides and even exotic skins such as python and crocodile.",
        "Monogram Canvas: Symmetrical pattern, smooth and malleable.",
        "Linings: Varied across the decades, but include materials such as leather and canvas.",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Award,
      showPopularTag: false,
    },
  ];

  // Detailed Authentication Guide
  const guideItems = [
    {
      title: "1. Evaluate the Overall Look & Feel",
      content: [
        "High-quality leather or GG Supreme canvas",
        "Consistent colors and glazing",
        "A refined, balanced weight",
        "Fake bags often look overly shiny or feel lightweight",
      ],
    },
    {
      title: "2. Stitching Quality",
      content: [
        "Consistent spacing throughout",
        "Clean finishing on all edges",
      ],
    },
    {
      title: "3. Logo, Fonts, & Heatstamps",
      content: [
        "Gucci logo is cleanly embossed, not puffy",
        "Most Gucci bags will be marked “Made in Italy” in uppercase or lowercase letters",
        "Most Gucci bags have a style code",
      ],
    },
    {
      title: "4. Pattern & Iconic Motifs",
      content: [
        "Horsebit hardware, GG monogram, Dionysus details",
        "Web stripe and Bamboo produced with precision",
        "Misaligned patterns are signs of counterfeit",
      ],
    },
    {
      title: "5. When to Choose Professional Authentication",
      content: [
        "When certainty matters most, professional service is safest",
        "Experts review style code accuracy and hardware engraving depth",
        "Leather grain, texture, and stitching style are examined",
        "Lining materials, pattern alignment, and strap quality verified",
      ],
    },
    {
      title: "6. Confidence Comes From Knowledge",
      content: [
        "Mastering basics helps make better luxury purchases",
        "Understand style codes, hardware, materials, and logos",
        "Navigate the resale market confidently",
        "Authentic Detective delivers expert, accurate authentication",
      ],
    },
  ];

  // Common Signs of Fake
  const fakeSigns = [
    "Incorrect or poorly stamped style code",
    "Cheap or lightweight hardware",
    "Plastic-like leather",
    "Chemical smells",
    "Misaligned GG monogram",
    "Blurry heat stamp",
    "Rough or low-quality lining",
    "Low-quality imitation strap",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section with Gucci-specific data */}
        <ContentHeroSection
          backgroundColor="#F5F5F0"
          showCapsule={true}
          capsuleText="Ultimate Guide"
          capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full inline-block mb-4 sm:mb-5 md:mb-6 shadow-sm !mx-0 border-none text-xs sm:text-sm"
          heading="How to Authenticate a Gucci Bag"
          headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight break-words"
          subHeading="Gucci remains one of the world's most influential luxury houses—known for its Italian craftsmanship, rich heritage, and iconic design elements. Because of the brand's popularity, Gucci bag authentication has become essential for shoppers, collectors, and resellers. Whether you're buying a pre-loved authentic Gucci handbag, reselling, or simply want reassurance, this guide from Authentic Detective explains everything you need to know."
          subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl break-words"
          align="left"
          primaryButtonText="Start Authentication"
          primaryButtonIcon={FiArrowRight}
          primaryButtonOnClick={handleExploreClick}
          // secondaryButtonText="Explore Services"
          // secondaryButtonOnClick={handleLearnMoreClick}
          buttonsLayout="row"
          image={whiteshoesImage}
          imageAlt="Gucci Collection"
          showInfoCard={true}
          infoCardTitle="About Gucci"
          infoCardDescription="Founded in 1921 by Guccio Gucci in Florence, Gucci is known for its Italian craftsmanship, GG monogram, and iconic designs like the Dionysus and Marmont bags."
          infoCardPosition="bottom-left"
          imagePosition="right"
          paddingY="py-12 md:py-20 lg:py-24"
          gap="gap-12 md:gap-8 lg:gap-16"
        />

        {/* About Gucci Section */}
        <AboutBrand
          title={aboutData.title}
          paragraphs={aboutData.paragraphs}
          milestones={aboutData.milestones}
          closingText={aboutData.closingText}
        />

        {/* 3 Key Ways to Authenticate Gucci */}
        <PremiumAuthentication
          heading="3 KEY WAYS TO AUTHENTICATE A GUCCI BAG"
          subHeading="The most important identifiers during Gucci authentication"
          cards={authCards}
        />

        {/* Detailed Authentication Guide */}
        <AuthenticationGuideSection guides={guideItems} />

        {/* Common Signs of Fake */}
        <CommonSignsSection
          title="Common Signs of a Fake Gucci Bag"
          signs={fakeSigns}
        />

        {/* Service Section */}
        <ServiceSection heading="Service" cards={serviceCards} />

        {/* Date Code Reference */}
        {/* <DateCodeReference /> */}

        {/* App Download Section */}
        <AppDownload />
      </main>
    </div>
  );
};

export default Gucci;
