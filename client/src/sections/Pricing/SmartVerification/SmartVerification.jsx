import React from 'react';
import PropTypes from 'prop-types';
import twoCardImage from '../../../assets/images/2card.png';

const SmartVerification = ({
    className = ""
}) => {
    return (
        <section className={`w-full py-12 md:py-16 lg:py-20 xl:py-24 bg-[#F5F5F0] ${className}`}>
            <div className="w-full  mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
                    
                    {/* Left Side Content */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left pl-4 sm:pl-6 lg:pl-8 xl:pl-12">
                        {/* Heading */}
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6 sm:mb-8 leading-tight whitespace-nowrap">
                            Smart Verification
                        </h2>

                        {/* Bullet Points */}
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            {/* First Point */}
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0 w-1 h-1 rounded-full mt-2 sm:mt-2.5" style={{ backgroundColor: '#4A4A4A' }}></div>
                                <p className="text-xs sm:text-sm md:text-base leading-relaxed pr-[4px]" style={{ color: '#4A4A4A' }}>
                                    A revolutionary new product that brings certainty and
                                    convenience to verifying the authenticity of your luxury items.
                                    Linked to your Certificate of Authenticity, these sleek cards
                                    utilize NFC technology, allowing you to access your certificate
                                    with a simple tap of the card to the back of your phone (2018+).
                                </p>
                            </div>

                            {/* Second Point */}
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0 w-1 h-1 rounded-full mt-2 sm:mt-2.5" style={{ backgroundColor: '#4A4A4A' }}></div>
                                <p className="text-xs sm:text-sm md:text-base leading-relaxed pr-[3px]" style={{ color: '#4A4A4A' }}>
                                    Alternatively, scan the QR code on the back of the card to
                                    instantly view your certificate. Say goodbye to rummaging
                                    through paperwork or doubt about your item's legitimacy.
                                    With Authenticity Cards, proof of authenticity is always at your
                                    fingertips, making it easier than ever to buy, sell, and own with
                                    confidence.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center pr-4 sm:pr-6 lg:pr-8 xl:pr-12">
                        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                            <img
                                src={twoCardImage}
                                alt="Authenticity Cards"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

SmartVerification.propTypes = {
    className: PropTypes.string
};

export default SmartVerification;
