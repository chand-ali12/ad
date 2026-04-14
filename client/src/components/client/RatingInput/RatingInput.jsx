import React, { useState, forwardRef } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";

const RatingInput = forwardRef(
  (
    {
      value = 0,
      onChange,
      maxRating = 5,
      className = "",
      starSize = "w-6 h-6",
      showValue = false,
    },
    ref,
  ) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleStarClick = (rating) => {
      if (onChange) {
        onChange(rating);
      }
    };

    const handleStarHover = (rating) => {
      setHoveredRating(rating);
    };

    const handleMouseLeave = () => {
      setHoveredRating(0);
    };

    const displayRating = hoveredRating || value;

    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[...Array(maxRating)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={i}
              // ref={ref} removed to prevent focus ring on buttons
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              onMouseLeave={handleMouseLeave}
              className="[&_*]:focus-visible:outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 border-0 bg-transparent p-0 cursor-pointer transition-colors group"
              style={{ backgroundColor: "transparent" }}
              aria-label={`Rate ${starValue} out of ${maxRating}`}
            >
              <FaStar
                className={`${starSize} ${
                  isFilled ? "text-yellow-400" : "text-gray-300"
                } transition-colors`}
              />
            </button>
          );
        })}
        {showValue && value > 0 && (
          <span className="ml-2 text-sm text-gray-600">{value}</span>
        )}
      </div>
    );
  },
);

RatingInput.displayName = "RatingInput";

RatingInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  maxRating: PropTypes.number,
  className: PropTypes.string,
  starSize: PropTypes.string,
  showValue: PropTypes.bool,
};

export default RatingInput;
