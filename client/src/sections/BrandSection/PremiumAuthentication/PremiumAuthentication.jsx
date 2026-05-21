import PropTypes from "prop-types";
import { SectionHeader, PremiumCard } from "../../../components";
import { Shield, Eye, Award } from "lucide-react";
import BallenoImage from "../../../assets/images/Balleno.jpg";
import Image37 from "../../../assets/images/37.jpg";
import WhiteDarkImage from "../../../assets/images/whitedark.jpg";

const PremiumAuthentication = ({
  heading = "Premium Authentication Solutions",
  subHeading = "Professional authentication services tailored to your needs",
  cards = [],
  className = "",
}) => {
  // Default cards if none provided
  const defaultCards = [
    {
      image: BallenoImage,
      imageAlt: "Balleno",
      title: "BALENCIAGA Logo",
      description:
        "Verify authenticity through metal nameplate and leather tag inspection",
      features: [
        "Metal nameplate verification",
        "Style number identification",
        '"MADE IN ITALY" embossing',
        "Balenciaga_Paris or Balenciaga.Paris tag",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Shield,
      popularTagText: "",
      showPopularTag: false,
    },
    {
      image: Image37,
      imageAlt: "37",
      title: "Leather & Stitching",
      description: "Inspect quality materials and craftsmanship details",
      features: [
        "Premium soft and durable leather",
        "Thick, uniform stitching",
        "Sueded-leather handles",
        "Solid piece leather straps with hardware",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Eye,
      popularTagText: "",
      showPopularTag: false,
    },
    {
      image: WhiteDarkImage,
      imageAlt: "White dark",
      title: "Hardware Details",
      description: "Verify hardware authenticity and quality standards",
      features: [
        "High-quality metal studs",
        "Lampo zipper hardware",
        "Secure metal fittings",
        "Edgy distinctive metal details",
      ],
      buttonText: "View Details",
      bottomLeftIcon: Award,
      popularTagText: "",
      showPopularTag: false,
    },
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  const handleButtonClick = () => {
    console.log("Button clicked!");
  };

  return (
    <section
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-white ${className}`}
    >
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto">
        <SectionHeader
          showCapsule={false}
          heading={heading}
          subHeading={subHeading}
          headingColor="primary"
          subHeadingColor="primary"
          className="text-center mb-8 sm:mb-10 md:mb-12"
          headingClassName="text-center"
          subHeadingClassName="text-center"
        />
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-stretch">
          {cardsToRender.map((card, index) => (
            <PremiumCard
              key={index}
              image={card.image}
              imageAlt={card.imageAlt}
              title={card.title}
              description={card.description}
              features={card.features || []}
              buttonIcon={card.buttonIcon}
              bottomLeftIcon={card.bottomLeftIcon}
              popularTagText={card.popularTagText}
              popularTagIcon={card.popularTagIcon}
              showPopularTag={card.showPopularTag || false}
              featureIcon={card.featureIcon}
              featureIconColor="#D4AF37"
              fullBleedImage={true}
              className={`!bg-[#F5F5F0] ${card.className || ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

PremiumAuthentication.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
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
};

export default PremiumAuthentication;
