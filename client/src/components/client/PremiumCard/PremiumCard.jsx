import PropTypes from "prop-types";
import React from "react";
import { Check } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";

const PremiumCard = ({
  image,
  imageAlt,
  title,
  description,
  features = [],
  buttonText,
  buttonIcon,
  popularTagText,
  popularTagIcon,
  showPopularTag = false,
  bottomLeftIcon,
  featureIcon,
  featureIconColor,
  fullBleedImage = false,
  imageFit = "contain",
  onButtonClick,
  className = "",
}) => {
  // Default icons if not provided
  const DefaultFeatureIcon = featureIcon || Check;
  const DefaultButtonIcon = buttonIcon || FiArrowRight;

  // Helper function to render icon components
  const renderIcon = (IconComponent, className, color) => {
    if (!IconComponent) return null;

    // Check if it's already a React element
    if (React.isValidElement(IconComponent)) {
      return IconComponent;
    }

    // Check if it's a string (image path)
    if (typeof IconComponent === "string") {
      return <img src={IconComponent} alt="Icon" className={className} />;
    }

    // Extract size from className (w-8 = 32px, h-8 = 32px)
    const sizeMatch = className?.match(/w-(\d+)|h-(\d+)/);
    const size = sizeMatch ? parseInt(sizeMatch[1] || sizeMatch[2]) * 4 : 32;

    // For React components (both function and object types), use React.createElement
    // This handles lucide-react icons which may be forwardRef components
    try {
      // Create props object
      const props = {
        size: size,
        strokeWidth: 2,
        className: className,
        ...(color && {
          color: color,
          style: { color: color },
        }),
      };

      // Use React.createElement which works for all component types
      return React.createElement(IconComponent, props);
    } catch (error) {
      console.error("Error rendering icon component:", error, IconComponent);
      return null;
    }
  };

  return (
    <div
      className={`bg-secondary rounded-[16px] overflow-hidden shadow-lg ${!fullBleedImage ? "border-2 border-gray-200" : ""} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl max-w-full flex flex-col h-full ${className}`}
    >
      {/* Top Section - Image (only show if image is provided) */}
      {image && (
        <div
          className={`relative w-full h-72 sm:h-80 md:h-96 overflow-hidden flex-shrink-0 ${!fullBleedImage ? "bg-primary flex items-center justify-center" : ""} ${imageFit === "contain" ? "bg-white p-2" : ""}`}
        >
          <img
            src={image}
            alt={imageAlt || title || "Card image"}
            // Use object-cover so the image fills the card area (no extra whitespace),
            // while the wrapper keeps it cropped to the card dimensions.
            className="w-full h-full object-cover object-[center_60%] bg-center bg-no-repeat "
          />

          {/* Popular Tag */}
          {showPopularTag && popularTagText && (
            <div className="absolute top-4 right-4 bg-primary px-3 py-1.5 rounded-[50px] text-xs font-semibold tracking-wide uppercase z-10 flex items-center gap-1.5 text-secondary">
              {popularTagIcon && (
                <span className="text-secondary">
                  {renderIcon(popularTagIcon, "w-3 h-3")}
                </span>
              )}
              <span className="text-secondary">{popularTagText}</span>
            </div>
          )}

          {/* Bottom Left Icon */}
          {bottomLeftIcon && (
            <div className="absolute bottom-6 left-6 bg-primary w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] flex items-center justify-center z-10 text-secondary">
              {renderIcon(
                bottomLeftIcon,
                "w-4 h-4 sm:w-5 sm:h-5 text-secondary",
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Section - Content */}
      <div className="p-6 text-left flex flex-col flex-grow">
        {title && (
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 leading-tight text-left">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-xs sm:text-sm text-primary opacity-80 mb-5 leading-relaxed text-left">
            {description}
          </p>
        )}

        {features.length > 0 && (
          <ul className="list-none p-0 m-0 flex flex-col gap-3 mb-6 flex-grow">
            {features.map((feature, index) => {
              // Support both string and object format for features
              const featureText =
                typeof feature === "string" ? feature : feature.text;
              const FeatureIcon =
                typeof feature === "object" && feature.icon
                  ? feature.icon
                  : DefaultFeatureIcon;

              return (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-primary opacity-90"
                >
                  <span
                    className="flex-shrink-0"
                    style={featureIconColor ? { color: featureIconColor } : {}}
                  >
                    {renderIcon(FeatureIcon, "w-4 h-4", featureIconColor)}
                  </span>
                  <span>{featureText}</span>
                </li>
              );
            })}
          </ul>
        )}

        {buttonText && (
          <button
            className="w-full bg-primary text-secondary border-none rounded-xl py-3.5 px-5 text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-primary-hover active:scale-[0.98] mt-auto"
            onClick={onButtonClick}
          >
            <span>{buttonText}</span>
            {DefaultButtonIcon && (
              <span className="flex-shrink-0">
                {renderIcon(DefaultButtonIcon, "w-5 h-5")}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

PremiumCard.propTypes = {
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
      }),
    ]),
  ),
  buttonText: PropTypes.string,
  buttonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  popularTagText: PropTypes.string,
  popularTagIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  showPopularTag: PropTypes.bool,
  bottomLeftIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  featureIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  featureIconColor: PropTypes.string,
  fullBleedImage: PropTypes.bool,
  onButtonClick: PropTypes.func,
  className: PropTypes.string,
};

export default PremiumCard;
