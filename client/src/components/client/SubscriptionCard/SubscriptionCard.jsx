import React from "react";
import PropTypes from "prop-types";
import { FiCheck } from "react-icons/fi";

const SubscriptionCard = ({
  title,
  price,
  period = "/month",
  features = [],
  additionalNote,
  buttonText = "Get started",
  headerBgColor,
  headerTextColor = "white",
  onButtonClick,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full min-h-[320px] md:min-h-[420px] lg:min-h-[460px] ${className}`}
    >
      {/* Header Section with Colored Background */}
      <div
        className="px-4 py-3 sm:px-6 sm:py-4 md:py-5"
        style={{
          backgroundColor: headerBgColor || "#8B4513",
          color: headerTextColor,
        }}
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
          {title}
        </h3>
      </div>

      {/* Content Section */}
      <div className="px-6 sm:p-4 md:px-8 md:pt-10 md:pb-6 pt-6 sm:pt-8 pb-5 flex flex-col flex-grow">
        {/* Price */}
        <div className="text-center mb-6 md:mb-8">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
            {price}
          </span>
          <span className="text-base sm:text-lg md:text-xl text-gray-600 ml-1">
            {period}
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-full h-0.5 mb-6 md:mb-8"
          style={{ backgroundColor: "#D4AF37" }}
        ></div>

        {/* Features List */}
        <div className="flex-grow mb-6 md:mb-8">
          <ul className="space-y-3 md:space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <FiCheck className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base md:text-lg text-gray-700">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={onButtonClick}
          className="w-full bg-primary text-secondary py-2.5 sm:py-3 md:py-4 rounded-[12px] font-semibold text-sm sm:text-base md:text-lg hover:bg-primary-hover transition-colors shadow-md mt-auto"
        >
          {buttonText}
        </button>

        {/* Additional Note - below button */}
        {additionalNote && (
          <p
            className="mt-3 md:mt-4 text-center md:text-sm"
            style={{ color: "#4A4A4A", fontSize: "clamp(8px, 1.5vw, 13px)" }}
          >
            {additionalNote}
          </p>
        )}
      </div>
    </div>
  );
};

SubscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  period: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  additionalNote: PropTypes.string,
  buttonText: PropTypes.string,
  headerBgColor: PropTypes.string,
  headerTextColor: PropTypes.string,
  onButtonClick: PropTypes.func,
  className: PropTypes.string,
};

export default SubscriptionCard;
