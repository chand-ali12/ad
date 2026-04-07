import React from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../../../components/client/SectionHeader/SectionHeader';
import WhyNeedCard from './WhyNeedCard';
import { ArrowRight } from 'lucide-react';
import handImg from '../../../assets/images/hand.png';
import stockImg from '../../../assets/images/stock.png';
import trustImg from '../../../assets/images/trust.png';
import { useNavigate } from 'react-router-dom';

const WhyNeedCertificate = ({ className = "" }) => {
    const navigate = useNavigate();
    const reasons = [
        {
            icon: <img src={handImg} alt="Resale Value" className="w-full h-full object-contain" />,
            title: "Resale Value",
            description: "Items sold with a certificate of authenticity are typically priced higher as it puts the buyers mind at ease."
        },
        {
            icon: <img src={stockImg} alt="Quicker Sales" className="w-full h-full object-contain" />,
            title: "Quicker Sales",
            description: "Sell your items faster with a certificate of authenticity"
        },
        {
            icon: <img src={trustImg} alt="Increased Trust" className="w-full h-full object-contain" />,
            title: "Increased Trust",
            description: "Reputation is important. Make it clear to your clients that you sell authentic items."
        }
    ];

    return (
        <section className={`w-full py-20 px-4 md:py-28 bg-primary ${className}`}>
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Section Header */}
                <SectionHeader
                    heading="Why You Need A Certificate"
                    headingColor="secondary"
                    headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-10 md:mb-12"
                    className="w-full"
                />

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16 md:mb-20">
                    {reasons.map((reason, index) => (
                        <WhyNeedCard
                            key={index}
                            icon={reason.icon}
                            title={reason.title}
                            description={reason.description}
                        />
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    className="flex items-center gap-2 bg-[#F9F9F7] text-primary font-bold text-sm sm:text-base px-8 py-3.5 rounded-[98px] hover:bg-white transition-all shadow-lg active:scale-95 group"
                    onClick={() => navigate('/authentication')}
                >
                    Authenticate Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
};

WhyNeedCertificate.propTypes = {
    className: PropTypes.string,
};

export default WhyNeedCertificate;
