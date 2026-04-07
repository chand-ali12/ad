import React from 'react';
import PropTypes from 'prop-types';
import whiteshoesImage from '../../../assets/images/whiteshoes.jpg';
import { FiArrowRight } from 'react-icons/fi';
import ContentHeroSection from '../../../components/client/ContentHeroSection/ContentHeroSection';

const BrandHero = ({
    brandName,
    className = "",
    onExploreClick,
    onLearnMoreClick
}) => {
    return (
        <ContentHeroSection
            backgroundColor="#F5F5F0"
            className={className}
            showCapsule={true}
            capsuleText="Professional"
            capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full inline-block mb-4 sm:mb-5 md:mb-6 shadow-sm !mx-0 border-none text-xs sm:text-sm"
            heading="BALENCIAGA Authentication"
            headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-5 md:mb-6 leading-tight break-words"
            subHeading="Real Authentication is proud to offer our trusted online authentication services for one of the most iconic luxury fashion brands in the world, Balenciaga."
            subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl break-words"
            align="left"
            primaryButtonText="Start Authentication"
            primaryButtonIcon={FiArrowRight}
            primaryButtonOnClick={onExploreClick}
            // secondaryButtonText="Explore Services"
            // secondaryButtonOnClick={onLearnMoreClick}
            buttonsLayout="row"
            image={whiteshoesImage}
            imageAlt={`${brandName || 'Brand'} Collection`}
            showInfoCard={true}
            infoCardTitle="About Balenciaga"
            infoCardDescription="Balenciaga is a luxury fashion brand founded in 1917 by Cristóbal Balenciaga. The brand is known for its avant-garde designs, high-quality materials, and innovative approach to fashion."
            infoCardPosition="bottom-left"
            imagePosition="right"
            paddingY="py-12 md:py-20 lg:py-24"
            gap="gap-12 md:gap-8 lg:gap-16"
        />
    );
};

BrandHero.propTypes = {
    brandName: PropTypes.string,
    className: PropTypes.string,
    onExploreClick: PropTypes.func,
    onLearnMoreClick: PropTypes.func
};

export default BrandHero;
