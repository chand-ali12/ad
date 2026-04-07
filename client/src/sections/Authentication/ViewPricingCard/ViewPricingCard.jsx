import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Standalone card/section for the "View pricing" CTA.
 * Renders a card-shaped block with the button, separate from WhyChooseUs.
 */
const ViewPricingCard = ({ to = "/prices", className = "" }) => {
  return (
    <section
      className={`w-full px-4 sm:px-6 md:px-8 py-6 sm:py-10 ${className}`}
    >
      <div className="max-w-[900px] mx-auto">
        <div className="relative overflow-hidden bg-secondary/95 border border-[#D4AF37] rounded-3xl px-6 sm:px-10 py-7 sm:py-9 shadow-[0_14px_40px_rgba(0,0,0,0.22)] flex flex-col items-center text-center gap-4 sm:gap-5">
          {/* subtle radial accent */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative max-w-xl">
            <h3 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-1">
              View Complete Pricing
            </h3>
            <p className="text-primary/80 text-xs sm:text-sm md:text-base">
              Explore detailed pricing for brands, categories, and add-ons
              before you start authentication.
            </p>
          </div>

          <Link
            to={to}
            className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base border border-[#D4AF37] text-primary bg-white tracking-wide hover:bg-primary hover:text-secondary hover:border-primary transition-colors duration-300 active:scale-[0.98] shadow-md"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
};

ViewPricingCard.propTypes = {
  to: PropTypes.string,
  className: PropTypes.string,
};

export default ViewPricingCard;
