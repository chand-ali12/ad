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

// Using existing images (can be replaced with Hermes-specific images later)
import BallenoImage from '../../assets/images/Balleno.jpg';
import Image37 from '../../assets/images/37.jpg';
import WhiteDarkImage from '../../assets/images/whitedark.jpg';

const Hermes = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/authentication');
    };

    const handleLearnMoreClick = () => {
        console.log('Learn more clicked for Hermes');
    };

    // About Hermes data
    const aboutData = {
        title: "About Hermes",
        paragraphs: [
            "Hermès was founded in 1837 by Thierry Hermès as a Parisian harness and saddle maker. Over time it expanded into leather goods, silk scarves (1930s), and fashion. Iconic pieces like the Kelly (1950s) and Birkin (1984) made it a symbol of craftsmanship and exclusivity. It remains family-run and known for meticulous, handmade luxury.",
            "Hermès is known for extremely high prices because almost everything is hand-made, produced in small quantities, and crafted by single artisans who train for years. The brand often uses rare and exotic materials such as:"
        ],
        milestones: [
            "Crocodile, alligator, and ostrich leathers",
            "Lizard and rare calfskins",
            "Precious hardware like palladium, gold, and even diamond-set clasps"
        ],
        closingText: "Bags like the Birkin and Kelly can cost tens of thousands to hundreds of thousands of dollars, especially in exotic skins or limited editions. Scarcity, craftsmanship, and luxurious materials are what keep Hermès at the top of the high-end market."
    };

    // Service Section data - Left box: Why Coveted, Right box: Authentication service
    const serviceCards = [
        {
            title: "Why Hermes Items Are So Coveted",
            content: [
                "Each Hermes piece represents artistry, rarity, and prestige. Handmade by master artisans from rarest leathers and precious hardware, Hermès items are produced in very limited quantities, making them extremely scarce. Timeless designs like the Birkin and Kelly hold or even increase in value over time, making them not just luxury items but investment-worthy collectibles. Owning Hermès signals taste, exclusivity, and status, which adds to their desirability among collectors."
            ]
        },
        {
            title: "Our Online Hermes Authentication Service",
            content: [
                "Our expert specialists utilize advanced technology and a secure platform to provide a thorough, confidential analysis of your Hermès piece.",
                "Receive a definitive \"Authentic\" or \"Counterfeit\" determination via email within our efficient 24-hour turnaround window.",
                "Shop with total confidence knowing your luxury goods are verified by a reliable service that blends advanced technology with professional expertise."
            ]
        }
    ];

    // 3 Key Ways to Authenticate - Cards data
    const authCards = [
        {
            image: BallenoImage,
            imageAlt: "Hermes Craftsmanship & Stitching",
            title: "1. Craftsmanship & Stitching",
            description: "Hermès bags are hand-stitched using the saddle stitch technique.",
            features: [
                "Hand-stitched using the saddle stitch",
                "Stitches are even, precise, and angled consistently",
                "Sloppy or machine-like stitching is a red flag",
                "Each bag crafted by master artisans"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Shield,
            showPopularTag: false,
        },
        {
            image: Image37,
            imageAlt: "Hermes Stamps & Markings",
            title: "2. Stamps & Markings",
            description: "Look for the Hermès logo, often stamped as \"Hermès Paris Made in France\".",
            features: [
                "\"Hermès Paris Made in France\" stamp",
                "Check the date code and craftsman's ID",
                "Usually inside the bag or on the strap",
                "Mismatched or missing marks suggest inauthenticity"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Eye,
            showPopularTag: false,
        },
        {
            image: WhiteDarkImage,
            imageAlt: "Hermes Materials & Hardware",
            title: "3. Materials & Hardware",
            description: "Hermès uses high-quality leather and solid hardware (gold or palladium).",
            features: [
                "Premium leather: Togo, Clemence, exotic skins",
                "Solid gold or palladium hardware",
                "Zippers, clasps, locks feel heavy and sturdy",
                "Exotic skins have natural texture and irregularities"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Award,
            showPopularTag: false,
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section with Hermes-specific data */}
                <ContentHeroSection
                    backgroundColor="#F5F5F0"
                    showCapsule={true}
                    capsuleText="Professional"
                    capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full inline-block mb-4 sm:mb-5 md:mb-6 shadow-sm !mx-0 border-none text-xs sm:text-sm"
                    heading="Hermes Authentication by Authentic Detective"
                    headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight break-words"
                    subHeading="Authentic Detective provides fast, expert verification for luxury pieces — including highly sought-after items from Hermes, one of the most luxuryous fashion houses in the world. Our specialists review every detail to help you shop and sell with confidence."
                    subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl break-words"
                    align="left"
                    primaryButtonText="Start Authentication"
                    primaryButtonIcon={FiArrowRight}
                    primaryButtonOnClick={handleExploreClick}
                    // secondaryButtonText="Explore Services"
                    // secondaryButtonOnClick={handleLearnMoreClick}
                    buttonsLayout="row"
                    image={whiteshoesImage}
                    imageAlt="Hermes Collection"
                    showInfoCard={true}
                    infoCardTitle="About Hermes"
                    infoCardDescription="Hermès is a luxury fashion brand founded in 1837 by Thierry Hermès. Known for iconic pieces like the Birkin and Kelly bags, crafted by master artisans using the finest materials."
                    infoCardPosition="bottom-left"
                    imagePosition="right"
                    paddingY="py-12 md:py-20 lg:py-24"
                    gap="gap-12 md:gap-8 lg:gap-16"
                />

                {/* About Hermes Section - Reusable Component */}
                <AboutBrand
                    title={aboutData.title}
                    paragraphs={aboutData.paragraphs}
                    milestones={aboutData.milestones}
                    closingText={aboutData.closingText}
                />

                {/* 3 Key Ways to Authenticate Hermes */}
                <PremiumAuthentication
                    heading="3 KEY WAYS TO AUTHENTICATE A HERMES ITEM"
                    subHeading="Expert verification points our specialists look for"
                    cards={authCards}
                />

                {/* Service Section with Hermes data - Left: Why Coveted, Right: Auth Service */}
                <ServiceSection
                    heading="Service"
                    cards={serviceCards}
                />

                {/* Date Code Reference */}
                {/* <DateCodeReference /> */}

                {/* App Download Section */}
                <AppDownload />
            </main>
        </div>
    );
};

export default Hermes;
