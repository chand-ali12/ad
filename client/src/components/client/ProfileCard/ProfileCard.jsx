import React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ProfileCard = ({
    className = "",
    bannerImage,
    profileImage,
    name,
    subtitle,
    website,
    reviewsCount,
    onReviewsClick,
    showEditProfile = false,
    onEditProfileClick,
    onProfileClick,
    editButtonText = "Edit profile",
    verifiedBadgeImage = null,
    rating = null
}) => {
    // Render star rating display (supports halves)
    const renderStarRating = () => {
        const safe = Number.isFinite(Number(rating)) ? Math.max(0, Math.min(5, Number(rating))) : 0;
        const full = Math.floor(safe);
        const hasHalf = safe - full >= 0.25 && safe - full < 0.75;
        const extraFull = safe - full >= 0.75 ? 1 : 0;
        const filled = Math.min(5, full + extraFull);
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const idx = i + 1;
            const cls = "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6";
            if (idx <= filled) {
                stars.push(<FaStar key={i} className={`${cls} text-yellow-400`} />);
            } else if (idx === filled + 1 && hasHalf) {
                stars.push(<FaStarHalfAlt key={i} className={`${cls} text-yellow-400`} />);
            } else {
                stars.push(<FaRegStar key={i} className={`${cls} text-gray-300`} />);
            }
        }
        return stars;
    };
    return (
        <section className={`w-full ${className}`}>
            {/* Main Profile Card */}
            <div className="overflow-visible">
                {/* Banner Image */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72">
                    {bannerImage ? (
                        <img
                            src={bannerImage}
                            alt="Profile Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    )}
                        
                    {/* Profile Picture - top aligned with name/text, with margin from banner */}
                    <div className="absolute top-[100%] left-6 sm:left-40 md:left-48 lg:left-56 xl:left-64 mt-6 sm:mt-10">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={onProfileClick}
                                disabled={!onProfileClick}
                                className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center p-0 border-0 ${onProfileClick ? 'cursor-pointer' : 'cursor-default'}`}
                                aria-label="Open profile"
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </button>
                            {/* Verified Badge - Right side of circle, slightly lower */}
                            {verifiedBadgeImage && (
                                <div className="absolute right-0 top-[75%] transform -translate-y-1/2 translate-x-[30%] z-10">
                                    <img
                                        src={verifiedBadgeImage}
                                        alt="Verified"
                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Information Section - margin top so pic and text sit below banner */}
                <div className="pt-6 sm:pt-10 pb-3 sm:pb-8 px-4 sm:px-6 md:px-8">
                    <div className="flex flex-row items-start gap-3 sm:gap-10 md:gap-12">
                        {/* Profile Picture Space - Left Side (matches absolute positioned picture) - texts stay to the right on all screens */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0"></div>

                        {/* Profile Info - Right of picture: name + count/stars on same row (count on other end), URL and Total Reviews below */}
                        <div className="flex-1 flex flex-row flex-wrap items-start justify-between gap-2 sm:gap-4 min-w-0">
                            <div className="flex-1 min-w-0 mt-2 sm:mt-5">
                                {/* Row 1: Name (left, indented) + Rating (right, unchanged) */}
                                <div className="flex flex-wrap items-baseline justify-between gap-x-2 sm:gap-x-4 gap-y-1">
                                    <div className="ml-4 sm:ml-32 md:ml-40 lg:ml-48 xl:ml-56">
                                        {name && (
                                            <button
                                                type="button"
                                                onClick={onProfileClick}
                                                disabled={!onProfileClick}
                                                className={`text-left bg-transparent border-0 p-0 text-base sm:text-3xl md:text-4xl font-bold text-primary mb-0 leading-tight ${onProfileClick ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
                                                aria-label="Open profile"
                                            >
                                                {name}
                                            </button>
                                        )}
                                    </div>
                                    {(rating !== null && rating !== undefined) && (
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-sm sm:text-2xl font-medium text-gray-600">{Number(rating)}</span>
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                {renderStarRating().map((star, index) => (
                                                    <span key={index}>{star}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Website, subtitle, Total Reviews — same left indent as name (rating stays right) */}
                                {website && (
                                    <a
                                        href={website.startsWith('http') ? website : `https://${website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs sm:text-xl text-blue-600 hover:underline block mt-1 ml-4 sm:ml-32 md:ml-40 lg:ml-48 xl:ml-56"
                                    >
                                        {website.replace(/^https?:\/\//i, '')}
                                    </a>
                                )}
                                {subtitle && (
                                    <p className="text-sm sm:text-xl md:text-2xl text-[#4A4A4A] mb-0 leading-tight mt-1 ml-4 sm:ml-32 md:ml-40 lg:ml-48 xl:ml-56">
                                        {subtitle}
                                    </p>
                                )}
                                {reviewsCount !== undefined && reviewsCount !== null && (
                                    <button
                                        type="button"
                                        onClick={onReviewsClick}
                                        disabled={!onReviewsClick}
                                        className={`text-[11px] sm:text-lg text-[#6B6B6B] italic leading-tight mt-1 ml-4 sm:ml-32 md:ml-40 lg:ml-48 xl:ml-56 bg-transparent border-0 p-0 text-left ${onReviewsClick ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
                                    >
                                        Total Reviews ({reviewsCount})
                                    </button>
                                )}
                            </div>

                            {/* Edit Profile - Plain Text (no button styling) */}
                            <div className="flex items-start sm:items-center flex-shrink-0 mt-2 sm:mt-3 gap-4">
                                {showEditProfile && (
                                    <button
                                        onClick={onEditProfileClick}
                                        className="flex items-center gap-2 text-[#6B6B6B] hover:text-primary hover:bg-transparent bg-transparent border-0 p-0 cursor-pointer font-normal transition-colors text-sm sm:text-base"
                                    >
                                        <span>{editButtonText}</span>
                                        <FiEdit3 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

ProfileCard.propTypes = {
    className: PropTypes.string,
    bannerImage: PropTypes.string,
    profileImage: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    website: PropTypes.string,
    reviewsCount: PropTypes.number,
    onReviewsClick: PropTypes.func,
    showEditProfile: PropTypes.bool,
    onEditProfileClick: PropTypes.func,
    onProfileClick: PropTypes.func,
    editButtonText: PropTypes.string,
    verifiedBadgeImage: PropTypes.string,
    rating: PropTypes.number
};

export default ProfileCard;
