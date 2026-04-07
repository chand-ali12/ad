import React from 'react';
import PropTypes from 'prop-types';

const WhyNeedCard = ({ icon, title, description }) => {
    return (
        <div className="bg-[#F9F9F7] rounded-[22px] p-8 md:p-10 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-white rounded-xl shadow-xl flex items-center justify-center p-3 mb-8">
                {icon}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4">
                {title}
            </h3>
            <p className="text-[#4A4A4A] leading-relaxed text-sm sm:text-base md:text-lg">
                {description}
            </p>
        </div>
    );
};

WhyNeedCard.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default WhyNeedCard;
