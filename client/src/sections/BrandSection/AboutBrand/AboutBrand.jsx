import React from 'react';
import PropTypes from 'prop-types';

const AboutBrand = ({
    title = "About Brand",
    paragraphs = [],
    milestones = [],
    closingText = "",
    className = "",
}) => {
    return (
        <section className={`w-full py-12 sm:py-16 md:py-20 bg-white ${className}`}>
            <div className="px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto">
                {/* Title with decorative underline */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary uppercase tracking-wide">
                        {title}
                    </h2>
                    <div className="w-20 h-1 bg-primary mt-4"></div>
                </div>

                {/* Main paragraphs */}
                <div className="space-y-6 max-w-4xl">
                    {paragraphs.map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-base sm:text-lg text-primary/80 leading-relaxed"
                        >
                            {paragraph}
                        </p>
                    ))}

                    {/* Milestones list */}
                    {milestones.length > 0 && (
                        <div className="mt-6">
                            <p className="text-base sm:text-lg text-primary/80 leading-relaxed mb-4">
                                Major milestones include:
                            </p>
                            <ul className="space-y-3 pl-4">
                                {milestones.map((milestone, index) => (
                                    <li
                                        key={index}
                                        className="text-base sm:text-lg text-primary/80 leading-relaxed flex items-start gap-3"
                                    >
                                        <span className="text-primary font-bold flex-shrink-0">•</span>
                                        <span>{milestone}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Closing text */}
                    {closingText && (
                        <p className="text-base sm:text-lg text-primary/80 leading-relaxed mt-6">
                            {closingText}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

AboutBrand.propTypes = {
    title: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    milestones: PropTypes.arrayOf(PropTypes.string),
    closingText: PropTypes.string,
    className: PropTypes.string,
};

export default AboutBrand;
