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

// Using existing images (can be replaced with LV-specific images later)
import BallenoImage from '../../assets/images/Balleno.jpg';
import Image37 from '../../assets/images/37.jpg';
import WhiteDarkImage from '../../assets/images/whitedark.jpg';

// Detailed Guide Section Component
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
                                        <li key={idx} className="flex gap-2 items-start text-sm leading-relaxed sm:text-base text-primary/80">
                                            <span className="flex-shrink-0 font-bold text-primary">•</span>
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
    guides: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.arrayOf(PropTypes.string),
    })),
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
                                <span className="text-lg font-bold text-red-600">{index + 1}</span>
                            </div>
                            <p className="text-sm font-medium sm:text-base text-primary">{sign}</p>
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

const LouisVuitton = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/authentication');
    };

    const handleLearnMoreClick = () => {
        console.log('Learn more clicked for Louis Vuitton');
    };

    // About Louis Vuitton data
    const aboutData = {
        title: "Why Authenticating a Louis Vuitton Bag Matters",
        paragraphs: [
            "Louis Vuitton has been crafting premium leather goods for over a century, and every genuine piece represents precision, detail, and quality. Buying an authentic LV bag means investing in long-term value, exceptional craftsmanship, and a product that lasts for years.",
            "Counterfeit bags might look similar at first glance, but they never match the durability, stitching, materials, and longevity of a real LV piece. Fake bags tear easily, age poorly, and often have structural flaws. Understanding the difference is key to ensuring your purchase is worth the investment."
        ],
        milestones: [],
        closingText: ""
    };

    // Service Section data
    const serviceCards = [
        {
            title: "How Authentic Detective Helps Verify Authenticity",
            content: [
                "Clear, expert-backed evaluations with fast turnaround time and detailed reports.",
                "Accurate assessments from trained authenticators with extensive experience with Louis Vuitton bags.",
                "Friendly customer support, transparent communication, and high trust and accuracy."
            ]
        },
        {
            title: "Buy From Trusted Sources Only",
            content: [
                "Purchase from official LV stores or brand-authorized boutiques.",
                "Use reputable online resale marketplaces with clear photos and return policies.",
                "Avoid random social media sellers, unverified marketplaces, and deals that seem \"too good to be true\"."
            ]
        }
    ];

    // 3 Key Ways to Authenticate - Cards data
    const authCards = [
        {
            image: BallenoImage,
            imageAlt: "Louis Vuitton Stitching",
            title: "1. Stitching: The Signature of Authentic LV",
            description: "Louis Vuitton treats stitching as an art form with strict stitch counts.",
            features: [
                "Perfectly even stitches throughout",
                "No loose threads anywhere",
                "Smooth edges and consistent thread color",
                "Strict stitch counts on certain models"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Shield,
            showPopularTag: false,
        },
        {
            image: Image37,
            imageAlt: "Louis Vuitton Hardware",
            title: "2. Hardware Examination",
            description: "Louis Vuitton uses top-quality brass and metal hardware.",
            features: [
                "Weighty, solid feel with clean engravings",
                "Smooth zipper movement",
                "High durability and tarnish resistance",
                "Fake bags have lightweight, poor hardware"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Eye,
            showPopularTag: false,
        },
        {
            image: WhiteDarkImage,
            imageAlt: "Louis Vuitton Monogram",
            title: "3. Monogram Alignment",
            description: "LV monogram alignment is one of the quickest giveaways of authenticity.",
            features: [
                "Properly centered \"LV\" logos",
                "Symmetrical placement throughout",
                "Clean transitions across seams",
                "Perfect pattern flow on all sides"
            ],
            buttonText: "View Details",
            bottomLeftIcon: Award,
            showPopularTag: false,
        }
    ];

    // Detailed Authentication Guide
    const guideItems = [
        {
            title: "1. Evaluate the Overall Look & Feel",
            content: [
                "Structured shape with strong edges",
                "Premium, thick canvas with slight natural shine",
                "Not overly glossy—consistent color tones",
                "High-quality glazing throughout",
                "Fakes appear flimsy or have plastic-like texture"
            ]
        },
        {
            title: "2. Vachetta Leather Patina",
            content: [
                "Natural, untreated vachetta leather darkens over time",
                "Starts light beige and darkens to honey-brown",
                "Changes evenly across the surface",
                "Fake bags turn dark too quickly or become patchy"
            ]
        },
        {
            title: "3. Interior Lining & Fonts",
            content: [
                "Authentic linings: microfiber suede, canvas, or cross-grain leather",
                "Counterfeit interiors feel rough, thin, or cheap",
                "Inside label and heat stamp must be crisp",
                "Fonts spaced correctly—never blurry or uneven"
            ]
        },
        {
            title: "4. Understanding the Date Code",
            content: [
                "Date codes follow specific patterns by year and model",
                "Fake bags use wrong letter combinations or fonts",
                "LV transitioned to microchip authentication in 2021–2022",
                "Missing date code is no longer a reason to assume fake"
            ]
        },
        {
            title: "5. Use Online Tools for Fast Verification",
            content: [
                "Submit photos for expert evaluations without mailing the bag",
                "Convenient and quick verification method",
                "Accuracy depends on reviewer's expertise",
                "Photo quality is important for best results"
            ]
        },
        {
            title: "6. When to Choose Professional Authentication",
            content: [
                "Professionals analyze stitch count, angle, leather texture",
                "Heat stamp embossing, label spacing, zipper structure examined",
                "Model manufacturing standards verified",
                "Authentic Detective offers high-accuracy evaluations"
            ]
        },
        {
            title: "7. Peace of Mind Comes From Knowledge",
            content: [
                "Authentication is a skill that improves with experience",
                "Understand craftsmanship, materials, stitching, alignment",
                "Make smarter luxury purchases on the resale market",
                "Authentic Detective is a trusted partner for verification"
            ]
        }
    ];

    // Common Signs of Fake
    const fakeSigns = [
        "Poor stitching quality with uneven or loose threads",
        "Incorrect monogram flow or misaligned logos",
        "Plastic-like leather that feels rubbery",
        "Wrong hardware color—overly yellow or lightweight",
        "Off-smell or chemical odor",
        "Cheap, thin interior lining",
        "Incorrect fonts on tags—blurry or misaligned"
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section with Louis Vuitton-specific data */}
                <ContentHeroSection
                    backgroundColor="#F5F5F0"
                    showCapsule={true}
                    capsuleText="Ultimate Guide"
                    capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full inline-block mb-4 sm:mb-5 md:mb-6 shadow-sm !mx-0 border-none text-xs sm:text-sm"
                    heading="How to Authenticate a Louis Vuitton Bag"
                    headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight break-words"
                    subHeading="Louis Vuitton is more than a luxury brand—it's a symbol of heritage, craftsmanship, and timeless elegance. Because of its global reputation, it's also one of the most counterfeited brands in the world. That's why understanding how to authenticate a Louis Vuitton bag has become essential for every buyer, collector, and reseller."
                    subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl break-words"
                    align="left"
                    primaryButtonText="Start Authentication"
                    primaryButtonIcon={FiArrowRight}
                    primaryButtonOnClick={handleExploreClick}
                    // secondaryButtonText="Explore Services"
                    // secondaryButtonOnClick={handleLearnMoreClick}
                    buttonsLayout="row"
                    image={whiteshoesImage}
                    imageAlt="Louis Vuitton Collection"
                    showInfoCard={true}
                    infoCardTitle="About Louis Vuitton"
                    infoCardDescription="Founded in 1854 in Paris, Louis Vuitton is renowned for its iconic monogram, exceptional craftsmanship, and timeless luxury leather goods that have defined elegance for over a century."
                    infoCardPosition="bottom-left"
                    imagePosition="right"
                    paddingY="py-12 md:py-20 lg:py-24"
                    gap="gap-12 md:gap-8 lg:gap-16"
                />

                {/* About Louis Vuitton Section */}
                <AboutBrand
                    title={aboutData.title}
                    paragraphs={aboutData.paragraphs}
                    milestones={aboutData.milestones}
                    closingText={aboutData.closingText}
                />

                {/* 3 Key Ways to Authenticate Louis Vuitton */}
                <PremiumAuthentication
                    heading="3 KEY WAYS TO AUTHENTICATE A LOUIS VUITTON BAG"
                    subHeading="The most important identifiers during Louis Vuitton authentication"
                    cards={authCards}
                />

                {/* Detailed Authentication Guide */}
                <AuthenticationGuideSection guides={guideItems} />

                {/* Common Signs of Fake */}
                <CommonSignsSection
                    title="Common Signs of a Fake Louis Vuitton Bag"
                    signs={fakeSigns}
                />

                {/* Service Section */}
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

export default LouisVuitton;
