import PropTypes from 'prop-types';
import { FiArrowRight } from 'react-icons/fi';

const HeroCard = ({
  smallHeading,
  largeHeading,
  description,
  primaryButtonText,
  primaryButtonIcon,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonOnClick,
  className = "",
  headingClassName = "",
  smallHeadingClassName = "",
  largeHeadingClassName = "",
  descriptionClassName = "",
  buttonsContainerClassName = "",
  primaryButtonClassName = "",
  secondaryButtonClassName = "",
}) => {
  // Default icons
  const PrimaryIcon = primaryButtonIcon || FiArrowRight;
  const SecondaryIcon = secondaryButtonIcon;

  return (
    <div className={`bg-secondary/30 backdrop-blur-sm p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg ${className}`}>
      {/* Text block: vertical flow, fill (576px), hug, gap adjusted for mobile */}
      {(smallHeading || largeHeading || description) && (
        <div className={`flex flex-col w-full max-w-[576px] gap-2 sm:gap-1 md:gap-1.5 ${headingClassName}`}>
          {smallHeading && (
            <h2 className={`text-sm md:text-base font-normal text-primary/60 text-left ${smallHeadingClassName}`}>
              {smallHeading}
            </h2>
          )}
          {largeHeading && (
            <h1 className={`text-primary leading-tight text-left ${largeHeadingClassName || 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'}`}>
              {largeHeading}
            </h1>
          )}
          {description && (
            <p className={`text-sm md:text-base text-primary/70 leading-relaxed text-left ${descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      {(primaryButtonText || secondaryButtonText) && (
        <div className={`flex flex-col sm:flex-row gap-3 text-left mt-4 sm:mt-5 ${buttonsContainerClassName}`}>
          {/* Primary Button */}
          {primaryButtonText && (
            <button 
              className={`bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-primary-hover active:scale-[0.98] whitespace-nowrap ${primaryButtonClassName}`}
              onClick={primaryButtonOnClick}
            >
              <span>{primaryButtonText}</span>
              {PrimaryIcon && (
                <span className="flex-shrink-0">
                  {typeof PrimaryIcon === 'function' ? (
                    <PrimaryIcon className="w-4 h-4" />
                  ) : (
                    PrimaryIcon
                  )}
                </span>
              )}
            </button>
          )}

          {/* Secondary Button */}
          {secondaryButtonText && (
            <button 
              className={`bg-white text-primary border border-primary/10 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-primary/5 active:scale-[0.98] whitespace-nowrap ${secondaryButtonClassName}`}
              onClick={secondaryButtonOnClick}
            >
              <span>{secondaryButtonText}</span>
              {SecondaryIcon && (
                <span className="flex-shrink-0">
                  {typeof SecondaryIcon === 'function' ? (
                    <SecondaryIcon className="w-4 h-4" />
                  ) : (
                    SecondaryIcon
                  )}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

HeroCard.propTypes = {
  smallHeading: PropTypes.string,
  largeHeading: PropTypes.string,
  description: PropTypes.string,
  primaryButtonText: PropTypes.string,
  primaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  primaryButtonOnClick: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  secondaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  secondaryButtonOnClick: PropTypes.func,
  className: PropTypes.string,
  headingClassName: PropTypes.string,
  smallHeadingClassName: PropTypes.string,
  largeHeadingClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  buttonsContainerClassName: PropTypes.string,
  primaryButtonClassName: PropTypes.string,
  secondaryButtonClassName: PropTypes.string,
};

export default HeroCard;
