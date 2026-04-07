import React from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../../../components/client/SectionHeader/SectionHeader';

const HowToVerify = ({ className = "" }) => {
    return (
        <section className={`w-full py-16 md:py-24 bg-[#F5F5F0] ${className}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

                    {/* Left Side - Steps */}
                    <div className="w-full lg:w-1/2 pl-[15px]">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-16">How to Verify</h2>

                        <div className="space-y-12">
                            {/* Step 1 */}
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold pt-1">
                                        1
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#453F3D] mb-3">Enter the certificate number</h3>
                                    <p className="text-[#6B6B6B] text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                                        Use the form below to confirm its validity in our database.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold pt-1">
                                        2
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#453F3D] mb-3">Scan the QR code</h3>
                                    <p className="text-[#6B6B6B] text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                                        Use the QR code on the physical certificate to instantly pull up the official digital copy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Info Card */}
                    <div className="w-full lg:w-1/2 flex justify-center md:justify-center lg:justify-end">
                        <div className="bg-primary text-secondary rounded-[22px] p-8 md:p-10 shadow-xl max-w-lg w-full h-full flex flex-col justify-center">
                            <div>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#5C4D46] text-[10px] font-bold tracking-wider uppercase mb-6 mt-3 text-white/90">
                                    IMPORTANT
                                </span>

                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">Authentication vs Verification</h3>

                                <p className="text-secondary/80 leading-relaxed mb-4 text-sm sm:text-base md:text-lg">
                                    Verification is different from authentication. Authentication is the process of reviewing an item to determine whether it's real or fake.
                                </p>

                                <div className="h-px w-full bg-[#D4AF37] mb-6"></div>

                                <p className="text-secondary/90 text-xs sm:text-sm leading-relaxed mb-3">
                                    Always check that the URL matches:
                                    <br />
                                    <span className="font-bold text-xs sm:text-sm block mt-2 break-all">https://authenticdetective.com/certificates/your-code</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section >
    );
};

HowToVerify.propTypes = {
    className: PropTypes.string,
};

export default HowToVerify;
