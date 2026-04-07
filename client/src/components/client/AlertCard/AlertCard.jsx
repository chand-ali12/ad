import React from 'react';
import PropTypes from 'prop-types';

const AlertCard = ({
    icon: Icon,
    title = "Important Details",
    details = [],
    iconColor = "black",
    cardRadius = "22px",
    className = "",
    titleClassName = "",
    detailsClassName = "",
    iconClassName = ""
}) => {
    return (
        <div 
            className={`bg-white rounded-[${cardRadius}] shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden ${className}`}
            style={{ borderRadius: cardRadius }}
        >
            {/* Left Side Border */}
            <div 
                className="absolute left-0"
                style={{ 
                    backgroundColor: '#3C1F1B',
                    width: '6px',
                    top: '0',
                    bottom: '0',
                    borderRadius: `${cardRadius} 0 0 ${cardRadius}`
                }}
            ></div>
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6 pl-4">
                {Icon && (
                    <div className={`flex-shrink-0 ${iconClassName}`}>
                        {typeof Icon === 'function' ? (
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: iconColor }} />
                        ) : React.isValidElement(Icon) ? (
                            React.cloneElement(Icon, { style: { color: iconColor, ...Icon.props.style } })
                        ) : (
                            <div style={{ color: iconColor }}>{Icon}</div>
                        )}
                    </div>
                )}
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-primary ${titleClassName}`}>
                    {title}
                </h3>
            </div>

            {/* Content Section */}
            <div className="space-y-3 sm:space-y-4 pl-4">
                {details.map((detail, index) => (
                    <p 
                        key={index}
                        className={`text-sm sm:text-base text-gray-700 leading-relaxed ${detailsClassName}`}
                    >
                        {detail}
                    </p>
                ))}
            </div>
        </div>
    );
};

AlertCard.propTypes = {
    icon: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.node,
        PropTypes.element
    ]),
    title: PropTypes.string,
    details: PropTypes.arrayOf(PropTypes.string).isRequired,
    iconColor: PropTypes.string,
    cardRadius: PropTypes.string,
    className: PropTypes.string,
    titleClassName: PropTypes.string,
    detailsClassName: PropTypes.string,
    iconClassName: PropTypes.string
};

export default AlertCard;
