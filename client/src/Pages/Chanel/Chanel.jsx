import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ContentHeroSection from '../../components/client/ContentHeroSection/ContentHeroSection';
import AboutBrand from '../../sections/BrandSection/AboutBrand/AboutBrand';
import PremiumAuthentication from '../../sections/BrandSection/PremiumAuthentication/PremiumAuthentication';
import ServiceSection from '../../sections/BrandSection/ServiceSection/ServiceSection';
import DateCodeReference from '../../sections/BrandSection/DateCodeReference/DateCodeReference';
import AppDownload from '../../sections/BrandSection/AppDownload/AppDownload';
import whiteshoesImage from '../../assets/images/whiteshoes.jpg';
import { Shield, Eye, Award } from 'lucide-react';

// Chanel-specific images (using placeholder for now, can be replaced with actual Chanel images)
import BallenoImage from '../../assets/images/Logos_Stamps_Photo_1.jpeg';
import Image37 from '../../assets/images/Photo_2_craftsmanship.jpeg';
import WhiteDarkImage from '../../assets/images/Photo_3_hardwaare_and_details.jpeg';
const Chanel = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/authentication');
    };

    const handleLearnMoreClick = () => {
        console.log('Learn more clicked for Chanel');
    };

    // About Chanel data
    const aboutData = {
        title: "About Chanel",
        paragraphs: [
            "Chanel was founded in 1910 by Coco Chanel in Paris, beginning as a hat boutique before expanding into fashion, accessories, and fragrance. Coco broke with the restrictive styles of the time, introducing comfortable, elegant designs like the little black dress, tweed suits, and costume jewelry, emphasizing simplicity and luxury."
        ],
        milestones: [
            "1921: Launch of Chanel No. 5, the world-famous perfume.",
            "1955: Debut of the Classic Flap Bag, an enduring symbol of luxury.",
            "1983–2019: Under Karl Lagerfeld, Chanel modernized while retaining its signature style."
        ],
        closingText: "Today, Chanel represents timeless elegance, innovation, and high-end luxury, with products that remain coveted by collectors and fashion enthusiasts worldwide."
    };

    // Service Section data - Left box: Why Coveted, Right box: Authentication service
    const serviceCards = [
        {
            title: "WHY CHANEL ITEMS ARE SO COVETED.",
            content: [
                "Chanel items are always combine timeless design, high-quality craftsmanship, and brand prestige. Each piece—whether a Classic Flap Bag, tweed jacket, jewerly or Chanel No. 5 perfume—is made with premium materials and meticulous attention to detail. Limited production, iconic status, and cultural influence make them symbols of elegance and wealth, while some items hold or increase in value over time, making them highly desirable for collectors."
            ]
        },
        {
            title: "Our Online Chanel Authentication Service",
            content: [
                "Our expert specialists utilize advanced technology and a secure platform to provide a thorough, confidential analysis of your Chanel piece.",
                "Receive a definitive \"Authentic\" or \"Counterfeit\" determination via email within our efficient 24-hour turnaround window.",
                "Shop with total confidence knowing your luxury goods are verified by a reliable service that blends advanced technology with professional expertise."
            ]
        }
    ];

    // 3 Key Ways to Authenticate - Cards data
    const authCards = [
        {
            image: BallenoImage,
            imageAlt: "Chanel Logo & Stamps",
            title: "1. Logos & Stamps",
            description: "Check for the Chanel logo and markings like \"Chanel Made in France/Italy\".",
            features: [
                "Check for the Chanel logo and markings",
                "\"Chanel Made in France/Italy\" stamp",
                "Serial numbers match authenticity card"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Shield,
            showPopularTag: false,
        },
        {
            image: Image37,
            imageAlt: "Chanel Craftsmanship & Materials",
            title: "2. Craftsmanship & Materials",
            description: "Chanel items are meticulously made, with even stitching and high-quality leather.",
            features: [
                "Even stitching, high-quality leather, sturdy hardware",
                "Jewelry: high-quality metal alloy with high quality coating",
                "Tweed, leather, jewelry feel premium",
                "No loose threads or rough edges"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Eye,
            showPopularTag: false,
        },
        {
            image: WhiteDarkImage,
            imageAlt: "Chanel Hardware & Details",
            title: "3. Hardware & Details",
            description: "Zippers, clasps, and chains are weighty, engraved, and precise.",
            features: [
                "Weighty, engraved, and precise zippers/clasps/chains",
                "Check plating and hallmark stamps on jewelry",
                "Gemstones should feel solid",
                "Not cheap or lightweight"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Award,
            showPopularTag: false,
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section with Chanel-specific data */}
                <ContentHeroSection
                    backgroundColor="#F5F5F0"
                    showCapsule={true}
                    capsuleText="Professional"
                    capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full inline-block mb-4 sm:mb-5 md:mb-6 shadow-sm !mx-0 border-none text-xs sm:text-sm"
                    heading="Chanel Authentication by Authentic Detective"
                    headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight break-words"
                    subHeading="Authentic Detective provides fast, expert verification for luxury pieces — including highly sought-after items from Chanel, one of the most iconic fashion houses in the world. Our specialists review every detail to help you shop and sell with confidence."
                    subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl break-words"
                    align="left"
                    primaryButtonText="Start Authentication"
                    primaryButtonIcon={FiArrowRight}
                    primaryButtonOnClick={handleExploreClick}
                    // secondaryButtonText="Explore Services"
                    // secondaryButtonOnClick={handleLearnMoreClick}
                    buttonsLayout="row"
                    image={whiteshoesImage}
                    imageAlt="Chanel Collection"
                    showInfoCard={true}
                    infoCardTitle="About Chanel"
                    infoCardDescription="Chanel is a luxury fashion brand founded in 1910 by Coco Chanel. The brand is known for its timeless elegance, the iconic Classic Flap Bag, and Chanel No. 5 perfume."
                    infoCardPosition="bottom-left"
                    imagePosition="right"
                    paddingY="py-12 md:py-20 lg:py-24"
                    gap="gap-12 md:gap-8 lg:gap-16"
                />

                {/* About Chanel Section - Reusable Component */}
                <AboutBrand
                    title={aboutData.title}
                    paragraphs={aboutData.paragraphs}
                    milestones={aboutData.milestones}
                    closingText={aboutData.closingText}
                />

                {/* 3 Key Ways to Authenticate Chanel */}
                <PremiumAuthentication
                    heading="3 KEY WAYS TO AUTHENTICATE CHANEL ITEM"
                    subHeading="Expert verification points our specialists look for"
                    cards={authCards}
                />

                {/* Service Section with Chanel data - Left: Why Coveted, Right: Auth Service */}
                <ServiceSection
                    heading="Service"
                    cards={serviceCards}
                />

                {/* Date Code Reference - Can be customized for Chanel later */}
                {/* <DateCodeReference /> */}

                {/* App Download Section */}
                <AppDownload />
            </main>
        </div>
    );
};

export default Chanel;
