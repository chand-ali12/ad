import PropTypes from "prop-types";
import { SectionHeader, PremiumCard } from "../../../components";

const WhyChooseUs = ({
  heading = "Why Choose Us",
  cards = [],
  className = "",
}) => {
  // Default cards if none provided
  const defaultCards = [
    {
      title: "A Trusted Name in Luxury Authentication",
      features: [
        "Trusted by buyers, resellers, and collectors.",
        "Competitive rates.",
        "Certificate-backed results for luxury items.",
        "The smart choice for buying or selling.",
      ],
    },
    {
      title: "Certificate of Authenticity Always Included",
      features: [
        "Free Certificate of Authenticity with every authentication.",
        "Unique QR code links to a secure digital copy.",
        "Added security layer to prevent fraud. Helps build trust with potential buyers.",
      ],
    },
    {
      title: "Fast, Professional Turnaround",
      features: [
        "Results delivered within 12 hours.",
        "Additional photos requested if needed.",
        "Multi-step verification for accuracy.",
      ],
    },
    {
      title: "Over 160 Luxury Brands",
      features: [
        "Authenticate 160+ designer brands.",
        "Give customers peace of mind.",
        "Maintain business credibility in resale.",
      ],
    },
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 pt-12 sm:pt-16 md:pt-20 pb-2 sm:pb-4 md:pb-4 max-w-[1400px] mx-auto ${className}`}
    >
      <SectionHeader
        heading={heading}
        headingColor="primary"
        className="text-center mb-8 sm:mb-10 md:mb-12"
        headingClassName="text-center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-stretch mb-10">
        {cardsToRender.map((card, index) => (
          <PremiumCard
            key={index}
            title={card.title}
            features={card.features || []}
            className={card.className}
          />
        ))}
      </div>
    </div>
  );
};

WhyChooseUs.propTypes = {
  heading: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      features: PropTypes.array,
      className: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
};

export default WhyChooseUs;
