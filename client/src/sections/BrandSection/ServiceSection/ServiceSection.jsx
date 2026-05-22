import PropTypes from "prop-types";

const ServiceSection = ({
  heading = "Service",
  cards = [],
  className = "",
}) => {
  // Default cards if none provided
  const defaultCards = [
    {
      title: "Authentic Detective Balenciaga Authentication",
      content: [
        "If you’re thinking about purchasing a Balenciaga item, verifying that it’s genuine is an important step. Authentic Detective provides digital authentication services for Balenciaga as well as many other luxury designer brands.",
        "Our trained authentication experts carefully review every item to confirm its legitimacy, helping buyers and sellers feel confident that what they have is truly authentic.",
      ],
    },
    {
      title: "Our Online Designer Authentication Service",
      content: [
        "Get a clear final verdict — “Authentic” or “Counterfeit” — delivered straight to your email within our standard 6-12 hour review period.",
        "Buy and sell with confidence knowing your luxury item has been evaluated by experienced specialists using a trusted verification process.",
      ],
    },
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  return (
    <section
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-primary ${className}`}
    >
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto">
        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          {heading}
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {cardsToRender.map((card, index) => (
            <div
              key={index}
              className="bg-[#F5F5F0] rounded-[22px] p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-lg"
            >
              {/* Card Title */}
              {card.title && (
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight">
                  {card.title}
                </h3>
              )}

              {/* Card Content */}
              {card.content && card.content.length > 0 && (
                <ul className="space-y-3 sm:space-y-4 list-none">
                  {card.content.map((paragraph, pIndex) => (
                    <li
                      key={pIndex}
                      className="text-xs sm:text-sm md:text-base text-primary opacity-90 leading-relaxed flex items-start gap-2 sm:gap-3"
                    >
                      <span className="text-primary text-2xl leading-none flex-shrink-0 translate-y-[-2px]">•</span>
                      <span>{paragraph}</span>
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

ServiceSection.propTypes = {
  heading: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  className: PropTypes.string,
};

export default ServiceSection;
