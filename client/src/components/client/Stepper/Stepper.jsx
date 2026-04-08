import PropTypes from "prop-types";

const Stepper = ({
  stepNumber,
  stepIcon,
  stepText,
  heading,
  subHeading,
  showLine = true,
  hideLineOnTablet = false,
  lineColor = "primary",
  className = "",
  boxClassName = "",
  headingClassName = "",
  subHeadingClassName = "",
}) => {
  // Determine line color class
  const lineColorClass =
    lineColor === "secondary" ? "bg-secondary" : "bg-line-color";

  return (
    <div className={`flex flex-col relative overflow-visible ${className}`}>
      {/* Mobile layout: text appears on the line */}
      <div className="flex items-start gap-3 md:hidden">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 bg-primary text-secondary ${boxClassName}`}
        >
          {stepIcon ? (
            typeof stepIcon === "function" ? (
              <stepIcon className="w-6 h-6 text-secondary" />
            ) : (
              stepIcon
            )
          ) : stepText ? (
            stepText
          ) : (
            stepNumber
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          {heading && (
            <h3
              className={`text-sm font-bold text-primary mb-1 ${headingClassName}`}
            >
              {heading}
            </h3>
          )}
          {/* On mobile always show the bar line under the heading for every step (including last) */}
          <div className={`h-[2px] w-full ${lineColorClass}`} />
          {subHeading && (
            <p
              className={`text-xs leading-relaxed text-primary opacity-70 mt-1 ${subHeadingClassName}`}
            >
              {subHeading}
            </p>
          )}
        </div>
      </div>

      {/* Desktop/tablet: entire step centered in equal-width grid cell */}
      <div className="hidden md:flex md:flex-col md:items-center md:w-full md:h-full overflow-visible">
        {/* Number box centered; any connecting line is handled by the parent layout (e.g., HowItWorks) */}
        <div className="relative w-full flex items-center justify-center flex-shrink-0">
          <div
            className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl flex-shrink-0 bg-primary text-secondary z-10 ${boxClassName}`}
          >
            {stepIcon ? (
              typeof stepIcon === "function" ? (
                <stepIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary" />
              ) : (
                stepIcon
              )
            ) : stepText ? (
              stepText
            ) : (
              stepNumber
            )}
          </div>
        </div>
        {/* Heading and subheading centered, same max-width for all steps */}
        <div className="flex flex-col items-center text-center mt-3 sm:mt-4 md:mt-5 w-full px-1 flex-1">
          {heading && (
            <h3
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary flex-shrink-0 ${headingClassName}`}
            >
              {heading}
            </h3>
          )}
          {subHeading && (
            <p
              className={`text-xs sm:text-sm leading-relaxed text-primary opacity-70 max-w-[180px] mt-1.5 sm:mt-2 ${subHeadingClassName}`}
            >
              {subHeading}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

Stepper.propTypes = {
  stepNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stepIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  stepText: PropTypes.string,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  showLine: PropTypes.bool,
  hideLineOnTablet: PropTypes.bool,
  lineColor: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  boxClassName: PropTypes.string,
  headingClassName: PropTypes.string,
  subHeadingClassName: PropTypes.string,
};

export default Stepper;
