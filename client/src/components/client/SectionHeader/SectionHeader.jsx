import PropTypes from 'prop-types';

const SectionHeader = ({
  capsuleText,
  showCapsule = false,
  heading,
  subHeading,
  headingColor,
  subHeadingColor,
  className = "",
  capsuleClassName = "",
  headingClassName = "",
  headingStyle,
  subHeadingClassName = "",
  subHeadingStyle,
}) => {
  // Determine color classes based on props - fully reusable
  const headingColorClass = headingColor === "secondary" ? "text-secondary" : "text-primary";
  const subHeadingColorClass = subHeadingColor === "primary" ? "text-primary" : "text-secondary";
  const subHeadingOpacityClass = subHeadingColor === "primary" ? "opacity-80" : "opacity-100";
  
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Capsule */}
      {showCapsule && capsuleText && (
        <div 
          className={`inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium w-fit border border-primary/20 mx-auto bg-secondary text-primary ${capsuleClassName}`}
        >
          {capsuleText}
        </div>
      )}

      {/* Heading - default responsive sizes; pass headingClassName to override (e.g. Premium Solution) */}
      {heading && (
        <h2 
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight ${headingColorClass} ${headingClassName}`}
          style={headingStyle}
        >
          {heading}
        </h2>
      )}

      {/* Sub Heading - default responsive sizes; pass subHeadingClassName to override */}
      {subHeading && (
        <p 
          className={`text-sm sm:text-base md:text-lg leading-relaxed ${subHeadingColorClass} ${subHeadingOpacityClass} ${subHeadingClassName}`}
          style={subHeadingStyle}
        >
          {subHeading}
        </p>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  capsuleText: PropTypes.string,
  showCapsule: PropTypes.bool,
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headingColor: PropTypes.oneOf(["primary", "secondary"]),
  subHeadingColor: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  capsuleClassName: PropTypes.string,
  headingClassName: PropTypes.string,
  headingStyle: PropTypes.object,
  subHeadingClassName: PropTypes.string,
  subHeadingStyle: PropTypes.object,
};

export default SectionHeader;
