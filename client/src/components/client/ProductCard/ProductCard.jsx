import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import {
  BsStarFill,
  BsStarHalf,
  BsStar,
  BsPatchCheckFill,
} from "react-icons/bs";

const ProductCard = ({
  image,
  imageAlt,
  fallbackImage,
  verifiedBadgeText,
  showVerifiedBadge = false,
  brandName,
  location,
  rating,
  reviewCount,
  buttonText,
  buttonIcon,
  onButtonClick,
  starIcon,
  emptyStarIcon,
  halfStarIcon,
  className = "",
  imageClassName = "",
  verifiedBadgeClassName = "",
  brandInfoClassName = "",
  buttonClassName = "",
}) => {
  // Default star icons - using BsStarFill for solid yellow stars
  const FullStarIcon = starIcon || BsStarFill;
  const HalfStarIcon = halfStarIcon || BsStarHalf;
  const EmptyStarIcon = emptyStarIcon || BsStar;

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FullStarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400" />,
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <HalfStarIcon key="half" className="w-4 h-4 text-yellow-400" />,
      );
    }

    // Empty stars
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);
    const emptyStars = 5 - totalStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <EmptyStarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />,
      );
    }

    return stars;
  };

  const [imgSrc, setImgSrc] = useState(image);
  useEffect(() => {
    setImgSrc(image);
  }, [image]);
  const handleImageError = () => {
    if (fallbackImage && imgSrc !== fallbackImage) {
      setImgSrc(fallbackImage);
    }
  };

  return (
    <div
      className={`relative bg-secondary rounded-[4px] overflow-hidden shadow-lg ${className}`}
    >
      {/* Product Image Section */}
      <div
        className={`relative w-full h-[350px] overflow-hidden  ${imageClassName}`}
      >
        <img
          src={imgSrc}
          alt={imageAlt || brandName || "Product image"}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />

        {/* Verified Badge - Top Right */}
        {showVerifiedBadge && (
          <div
            className={`absolute top-4 right-4 bg-secondary p-1.5 rounded-full text-primary z-20 flex items-center justify-center ${verifiedBadgeClassName}`}
            title="Verified"
          >
            <BsPatchCheckFill className="w-5 h-5 text-green-600" />
          </div>
        )}

        {/* Brand Information Overlay - Using opacity instead of blur */}
        {(brandName || location || rating !== undefined || buttonText) && (
          <div
            className={`absolute bottom-0 left-0 right-0 -mx-1 bg-primary/70 flex flex-col justify-end p-2.5 ${brandInfoClassName}`}
          >
            {/* Brand Name - Left Aligned */}
            {brandName && (
              <h3 className="text-sm sm:text-base font-bold text-secondary mb-0.5 text-left">
                {brandName}
              </h3>
            )}

            {/* Location - Left Aligned */}
            {location && (
              <p className="text-xs text-secondary mb-0.5 italic opacity-90 text-left">
                {location}
              </p>
            )}

            {/* Rating and Review Count - Left Aligned */}
            {(rating !== undefined || reviewCount !== undefined) && (
              <div className="flex items-center gap-1.5 mb-1.5 text-left py-[1px]">
                {rating !== undefined && (
                  <div className="flex items-center gap-0.5">
                    {renderStars(rating).map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                  </div>
                )}
                {reviewCount !== undefined && (
                  <span className="text-xs text-secondary">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* View Profile Button */}
            {buttonText && (
              <button
                className={`w-full bg-secondary text-primary border-none rounded-[4px] py-2.5 px-4 text-sm  cursor-pointer flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-gray-100 active:scale-[0.98] ${buttonClassName}`}
                onClick={onButtonClick}
              >
                <span>{buttonText}</span>
                {buttonIcon && (
                  <span className="flex-shrink-0">
                    {typeof buttonIcon === "function" ? (
                      <buttonIcon className="w-4 h-4" />
                    ) : (
                      buttonIcon
                    )}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  fallbackImage: PropTypes.string,
  verifiedBadgeText: PropTypes.string,
  showVerifiedBadge: PropTypes.bool,
  brandName: PropTypes.string,
  location: PropTypes.string,
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  buttonText: PropTypes.string,
  buttonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  starIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  emptyStarIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  halfStarIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  onButtonClick: PropTypes.func,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  verifiedBadgeClassName: PropTypes.string,
  brandInfoClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default ProductCard;
