import React from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../SectionHeader/SectionHeader';
import { FiArrowRight } from 'react-icons/fi';

const ContentHeroSection = ({
    // Background
    backgroundColor = '#F5F5F0',
    className = "",
    
    // Section Header Props
    showCapsule = false,
    capsuleText = "",
    capsuleClassName = "",
    heading = "",
    headingClassName = "",
    subHeading = "",
    subHeadingClassName = "",
    align = "left",
    
    // Buttons
    primaryButtonText = "",
    primaryButtonIcon,
    primaryButtonOnClick,
    primaryButtonClassName = "",
    secondaryButtonText = "",
    secondaryButtonIcon,
    secondaryButtonOnClick,
    secondaryButtonClassName = "",
    buttonsLayout = "row", // "row" or "column"
    
    // Image
    image = null,
    imageAlt = "Hero Image",
    imageClassName = "",
    imageContainerClassName = "",
    
    // Floating Info Card
    showInfoCard = false,
    infoCardTitle = "",
    infoCardDescription = "",
    infoCardClassName = "",
    infoCardPosition = "bottom-left", // "bottom-left", "bottom-right", "top-left", "top-right"
    
    // Layout
    imagePosition = "right", // "left" or "right"
    paddingY = "py-12 md:py-20 lg:py-24",
    gap = "gap-12 md:gap-8 lg:gap-16",
}) => {
    const PrimaryIcon = primaryButtonIcon || FiArrowRight;
    const SecondaryIcon = secondaryButtonIcon;
    
    // Determine button layout class
    const buttonLayoutClass = buttonsLayout === "column" 
        ? "flex-col sm:flex-col md:flex-row" 
        : "flex-col sm:flex-col md:flex-row";
    
    // Info card position classes
    const getInfoCardPositionClasses = () => {
        const positions = {
            "bottom-left": "md:absolute -bottom-10 left-0 md:-bottom-[42px] md:left-[10px] lg:-bottom-12 lg:left-10",
            "bottom-right": "md:absolute -bottom-10 right-0 md:-bottom-[42px] md:right-[10px] lg:-bottom-12 lg:right-10",
            "top-left": "md:absolute top-0 left-0 md:top-[10px] md:left-[10px] lg:top-10 lg:left-10",
            "top-right": "md:absolute top-0 right-0 md:top-[10px] md:right-[10px] lg:top-10 lg:right-10",
        };
        return positions[infoCardPosition] || positions["bottom-left"];
    };
    
    return (
        <section 
            className={`w-full ${paddingY}`}
            style={{ backgroundColor }}
        >
            <div className={`w-full px-3 sm:px-4 md:px-6 lg:px-8 ${className}`}>
                <div className={`flex flex-col md:flex-row items-center ${gap} ${imagePosition === "left" ? "md:flex-row-reverse" : ""}`}>
                    
                    {/* Content Side */}
                    <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col items-start text-left px-2 sm:px-4 md:pl-[15px] md:pr-4">
                        <SectionHeader
                            showCapsule={showCapsule}
                            capsuleText={capsuleText}
                            capsuleClassName={capsuleClassName || "bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-6 py-2 rounded-full inline-block mb-6 shadow-sm !mx-0 border-none"}
                            heading={heading}
                            headingClassName={headingClassName || "text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight"}
                            subHeading={subHeading}
                            subHeadingClassName={subHeadingClassName || "!text-primary text-lg leading-relaxed mb-10 max-w-3xl"}
                            align={align}
                        />

                        {/* Buttons */}
                        {(primaryButtonText || secondaryButtonText) && (
                            <div className={`flex ${buttonLayoutClass} gap-4`}>
                                {primaryButtonText && (
                                    <button
                                        onClick={primaryButtonOnClick}
                                        className={`bg-primary text-secondary px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-lg active:scale-95 ${primaryButtonClassName}`}
                                    >
                                        {primaryButtonText}
                                        {PrimaryIcon && (
                                            typeof PrimaryIcon === 'function' ? (
                                                <PrimaryIcon className="w-5 h-5" />
                                            ) : (
                                                PrimaryIcon
                                            )
                                        )}
                                    </button>
                                )}

                                {secondaryButtonText && (
                                    <button
                                        onClick={secondaryButtonOnClick}
                                        className={`bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg active:scale-95 ${secondaryButtonClassName}`}
                                    >
                                        {secondaryButtonText}
                                        {SecondaryIcon && (
                                            typeof SecondaryIcon === 'function' ? (
                                                <SecondaryIcon className="w-5 h-5" />
                                            ) : (
                                                SecondaryIcon
                                            )
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`w-full md:w-1/2 lg:w-1/2 relative flex justify-center md:justify-center lg:justify-end px-2 sm:px-4 md:pl-4 md:pr-[15px] overflow-visible ${imageContainerClassName}`}>
                        {image && (
                            <div className={`${showInfoCard ? 'hidden md:block' : ''} relative rounded-[32px] overflow-hidden shadow-2xl max-w-xs md:max-w-sm lg:max-w-lg w-full ${imageClassName}`}>
                                <img
                                    src={image}
                                    alt={imageAlt}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Floating Info Card */}
                        {showInfoCard && (
                            <div className={`block ${getInfoCardPositionClasses()} bg-white p-6 sm:p-7 md:p-8 rounded-[10px] shadow-xl max-w-sm border border-gray-100 z-10 ${infoCardClassName}`}>
                                {infoCardTitle && (
                                    <h4 className="text-xl font-bold text-primary mb-3">{infoCardTitle}</h4>
                                )}
                                {infoCardDescription && (
                                    <p className="text-primary/70 text-sm leading-relaxed">
                                        {infoCardDescription}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

ContentHeroSection.propTypes = {
    // Background
    backgroundColor: PropTypes.string,
    className: PropTypes.string,
    
    // Section Header Props
    showCapsule: PropTypes.bool,
    capsuleText: PropTypes.string,
    capsuleClassName: PropTypes.string,
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headingClassName: PropTypes.string,
    subHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    subHeadingClassName: PropTypes.string,
    align: PropTypes.string,
    
    // Buttons
    primaryButtonText: PropTypes.string,
    primaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
    primaryButtonOnClick: PropTypes.func,
    primaryButtonClassName: PropTypes.string,
    secondaryButtonText: PropTypes.string,
    secondaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
    secondaryButtonOnClick: PropTypes.func,
    secondaryButtonClassName: PropTypes.string,
    buttonsLayout: PropTypes.oneOf(["row", "column"]),
    
    // Image
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    imageClassName: PropTypes.string,
    imageContainerClassName: PropTypes.string,
    
    // Floating Info Card
    showInfoCard: PropTypes.bool,
    infoCardTitle: PropTypes.string,
    infoCardDescription: PropTypes.string,
    infoCardClassName: PropTypes.string,
    infoCardPosition: PropTypes.oneOf(["bottom-left", "bottom-right", "top-left", "top-right"]),
    
    // Layout
    imagePosition: PropTypes.oneOf(["left", "right"]),
    paddingY: PropTypes.string,
    gap: PropTypes.string,
};

export default ContentHeroSection;
