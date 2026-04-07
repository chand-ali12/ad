import React from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../../../components/client/SectionHeader/SectionHeader';

const TransparentPricing = ({
    className = "",
    onBuyNowClick
}) => {
    return (
        <section className={`w-full py-12 md:py-16 lg:py-20 xl:py-24 bg-[#F5F5F0] ${className}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="mb-8 sm:mb-10 md:mb-12 text-center">
                    <SectionHeader
                        heading="Transparent Pricing"
                        subHeading="Premium authentication services at competitive rates"
                        headingColor="primary"
                        subHeadingColor="primary"
                        className="text-center"
                        headingClassName="text-center mb-2 sm:mb-3 md:mb-3 lg:mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                        subHeadingClassName="text-center"
                    />
                </div>

                {/* Pricing Box */}
                <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-lg overflow-hidden border border-[#ADADAD]">
                    {/* Header Section */}
                    <div className="bg-primary px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-center">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-secondary mb-1 sm:mb-2">
                            Domestic (USA)
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-secondary/80">
                            Transit time 1-5 days
                        </p>
                    </div>

                    {/* Pricing Table */}
                    <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10">
                        {/* Table Headers */}
                        <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
                            <div className="font-bold text-primary text-sm sm:text-base md:text-lg text-center">
                                Quantity
                            </div>
                            <div className="font-bold text-primary text-sm sm:text-base md:text-lg text-center">
                                Price (USD)
                            </div>
                        </div>

                        {/* Pricing Rows */}
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">1</div>
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">$12</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">2</div>
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">$20</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">3</div>
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">$25</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">4</div>
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">$35</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">5+</div>
                                <div className="text-primary text-xs sm:text-sm md:text-base text-center">$7 / each</div>
                            </div>
                        </div>

                        {/* Separator Line */}
                        <div className="border-t border-gray-300 mb-6 sm:mb-8"></div>

                        {/* Disclaimer */}
                        <p className="text-xs sm:text-sm text-primary mb-6 sm:mb-8 leading-relaxed text-center">
                            International orders have a 10 card minimum. Please email us<br />
                            at{' '}
                            <a 
                                href="mailto:support@authenticdetective.com" 
                                className="font-bold hover:underline"
                                style={{ color: '#3C1F1B' }}
                            >
                                support@authenticdetective.com
                            </a>
                            {' '}for more information.
                        </p>

                        {/* Buy Now Button */}
                        <button
                            onClick={onBuyNowClick}
                            className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[14px] font-semibold text-sm sm:text-base md:text-lg hover:bg-primary-hover transition-colors shadow-md"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

TransparentPricing.propTypes = {
    className: PropTypes.string,
    onBuyNowClick: PropTypes.func
};

export default TransparentPricing;
