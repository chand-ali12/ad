import React from 'react';
import PropTypes from 'prop-types';
import verifyHeroImage from '../../../assets/images/verifyhero.jpeg';
import { FiArrowRight } from 'react-icons/fi';
import ContentHeroSection from '../../../components/client/ContentHeroSection/ContentHeroSection';

const ADCertification = ({
    className = "",
    onVerifyClick,
}) => {
    return (
        <ContentHeroSection
            backgroundColor="#F5F5F0"
            className={className}
            showCapsule={true}
            capsuleText="CERTIFICATION VERIFICATION"
            capsuleClassName="bg-[#DEDBD6] text-primary font-bold uppercase tracking-wide px-6 py-2 rounded-full inline-block mb-6 shadow-sm !mx-0 border-none"
            heading="Authentic Detective Certificate"
            headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-6 leading-tight"
            subHeading="Already have an item authenticated by Authentic Detective? Use This page to verify the certificate that came with it—so you know it's real and untampered."
            subHeadingClassName="!text-primary text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-3xl"
            align="left"
            primaryButtonText="Verify Now"
            primaryButtonIcon={FiArrowRight}
            primaryButtonOnClick={onVerifyClick}
            buttonsLayout="row"
            image={verifyHeroImage}
            imageAlt="Authentic Detective Verification"
            showInfoCard={true}
            infoCardTitle="What Is Verification?"
            infoCardDescription="Verification confirms that a Certificate of Authenticity issued by Authentic Detective is genuine, unaltered, and matches our official records."
            infoCardPosition="bottom-left"
            imagePosition="right"
            paddingY="py-12 md:py-20 lg:py-24"
            gap="gap-12 md:gap-8 lg:gap-16"
        />
    );
};

ADCertification.propTypes = {
    className: PropTypes.string,
    onVerifyClick: PropTypes.func,
};

export default ADCertification;
