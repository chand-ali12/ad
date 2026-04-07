import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SectionHeader, PremiumCard } from "../../../components";
import { BadgeCheck, TrendingUp, StickyNote } from "lucide-react";
import authCardsImage from "../../../assets/images/Authenticity Cards.jpeg";
import valuationImage from "../../../assets/images/valuation.jpeg";

const PremiumSolution = ({
  capsuleText = "Our Services",
  showCapsule = true,
  heading = "Premium Solutions",
  subHeading = "Professional authentication services tailored to your needs",
  subHeadingColor = "primary",
  cards = [],
  className = "",
  fullWidth = false,
}) => {
  const navigate = useNavigate();

  // Default cards if none provided – each button navigates to its section
  const defaultCards = [
    // {
    //   image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
    //   imageAlt: "Luxury handbag",
    //   title: "Subscriptions",
    //   description: "Flexible Authentication Plans for Every Buyer",
    //   features: [
    //     "Save up to 15% on authentications",
    //     "Flexible subscription plans",
    //     "Certificate of Authenticity",
    //     "Broad Coverage on bags, shoes, and accessories"
    //   ],
    //   buttonText: "View Plans and save",
    //   bottomLeftIcon: BadgeCheck,
    //   popularTagText: "",
    //   showPopularTag: false,
    //   onButtonClick: () => navigate('/subscription'),
    // },
    {
      image: valuationImage,
      imageAlt: "Valuation",
      title: "Valuation",
      description: "Accurate market valuations for insurance and resale",
      features: [
        "Estimated Market Value",
        "Based on Recent Sales Data",
        "Helps Price Your Item",
        "Supports Buying & Selling Decisions",
      ],
      buttonText: "See what it’s worth",
      bottomLeftIcon: TrendingUp,
      popularTagText: "POPULAR",
      showPopularTag: true,
      onButtonClick: () => navigate("/valuation"),
    },
    {
      image: authCardsImage,
      imageAlt: "Authenticity Cards",
      title: "Authenticity Cards",
      description: "NFC-enabled authenticity cards for instant verification",
      features: [
        "NFC Technology",
        "Digital Access",
        "Secure Verification",
        "Lifetime Validity",
      ],
      buttonText: "Learn More",
      bottomLeftIcon: StickyNote,
      popularTagText: "",
      showPopularTag: false,
      onButtonClick: () => navigate("/authenticity-cards"),
    },
  ];

  const cardsToRender = (cards.length > 0 ? cards : defaultCards).slice(0, 2);

  const handleButtonClick = () => {};

  const headingStyle = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
    letterSpacing: "0.26px",
    textAlign: "center",
  };

  const subHeadingStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 400,
    letterSpacing: "-0.46px",
    textAlign: "center",
    maxWidth: "576px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "12px",
  };

  return (
    <div
      className={`pt-8 sm:pt-10 md:pt-12 px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 ${
        fullWidth ? "w-full max-w-none" : "max-w-[1200px] mx-auto"
      } ${className}`}
    >
      <SectionHeader
        capsuleText={capsuleText}
        showCapsule={showCapsule}
        heading={heading}
        subHeading={subHeading}
        subHeadingColor={subHeadingColor}
        className="text-center"
        headingClassName="text-center premium-heading-responsive tracking-[0.26px]"
        headingStyle={headingStyle}
        subHeadingClassName="text-center premium-subheading-responsive tracking-[-0.46px]"
        subHeadingStyle={subHeadingStyle}
      />
      <div className="mt-8 sm:mt-10 md:mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0">
        {cardsToRender.map((card, index) => (
          <div
            key={index}
            className="w-[85%] min-w-[85%] snap-start md:w-auto md:min-w-0"
          >
            <PremiumCard
              image={card.image}
              imageAlt={card.imageAlt}
              title={card.title}
              description={card.description}
              features={card.features || []}
              buttonText={card.buttonText}
              buttonIcon={card.buttonIcon}
              bottomLeftIcon={card.bottomLeftIcon}
              popularTagText={card.popularTagText}
              popularTagIcon={card.popularTagIcon}
              showPopularTag={card.showPopularTag || false}
              featureIcon={card.featureIcon}
              fullBleedImage
              onButtonClick={card.onButtonClick || handleButtonClick}
              className={`h-full ${card.className || ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

PremiumSolution.propTypes = {
  capsuleText: PropTypes.string,
  showCapsule: PropTypes.bool,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  subHeadingColor: PropTypes.oneOf(["primary", "secondary"]),
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      imageAlt: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      features: PropTypes.array,
      buttonText: PropTypes.string,
      buttonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
      bottomLeftIcon: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.node,
      ]),
      popularTagText: PropTypes.string,
      popularTagIcon: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.node,
      ]),
      showPopularTag: PropTypes.bool,
      featureIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
      onButtonClick: PropTypes.func,
      className: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default PremiumSolution;
