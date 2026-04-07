import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { BsStarFill } from 'react-icons/bs';

/** Show "Read more" when quote is long (by chars) or when line-clamp visually truncates it */
const QUOTE_TRUNCATE_CHARS = 140;

/** Get 2-letter initials from name (e.g. "Arianne Ross" -> "AR") */
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const TestimonialCard = ({
  rating = 5,
  quote,
  headline,
  customerName,
  customerTitle,
  reviewDate,
  avatar,
  avatarAlt,
  initials,
  starIcon,
  className = "",
  quoteClassName = "",
  customerInfoClassName = "",
  avatarClassName = "",
  nameClassName = "",
  titleClassName = "",
}) => {
  const [showFullReviewModal, setShowFullReviewModal] = useState(false);
  const [isVisuallyTruncated, setIsVisuallyTruncated] = useState(false);
  const quoteRef = useRef(null);
  const StarIcon = starIcon || BsStarFill;
  const displayInitials = initials != null && initials !== '' ? String(initials).slice(0, 2).toUpperCase() : getInitials(customerName);

  const checkTruncation = () => {
    const el = quoteRef.current;
    if (!el || !quote) return;
    setIsVisuallyTruncated(el.scrollHeight > el.clientHeight);
  };

  useEffect(() => {
    checkTruncation();
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (quoteRef.current) resizeObserver.observe(quoteRef.current);
    return () => resizeObserver.disconnect();
  }, [quote]);

  const showReadMore = quote && (quote.length > QUOTE_TRUNCATE_CHARS || isVisuallyTruncated);

  const renderStars = (ratingVal) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.min(ratingVal, 5)) {
        stars.push(<StarIcon key={i} className="w-5 h-5 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className={`bg-secondary rounded-2xl p-6 shadow-lg border border-gray-300 flex flex-col h-full ${className}`}>
      {/* Top row: Reviewer (left) + Date (right) */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className={`flex items-center gap-3 min-w-0 ${customerInfoClassName}`}>
          <div
            className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-300/90 text-primary font-bold text-sm sm:text-base ${avatarClassName}`}
            aria-hidden
          >
            {displayInitials}
          </div>
          <div className="flex flex-col justify-center text-left min-w-0">
            {customerName && (
              <h4 className={`text-sm sm:text-base font-bold text-primary mb-0.5 leading-tight text-left ${nameClassName}`}>
                {customerName}
              </h4>
            )}
            {customerTitle && (
              <p className={`text-xs sm:text-sm text-primary/70 leading-tight text-left ${titleClassName}`}>
                {customerTitle}
              </p>
            )}
          </div>
        </div>
        {reviewDate && (
          <span className="text-xs sm:text-sm text-primary/60 whitespace-nowrap flex-shrink-0">{reviewDate}</span>
        )}
      </div>

      {/* Star Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-1 mb-3 text-left">
          {renderStars(rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </div>
      )}

      {/* Headline (bold, on top of quote) */}
      {headline && (
        <p className={`text-sm sm:text-base font-bold text-primary mb-2 leading-snug text-left ${quoteClassName}`}>
          {headline}
        </p>
      )}

      {/* Quote: max 3 lines; "Read more" below so it's never clipped (line-clamp hides overflow) */}
      {quote && (
        <div className="flex-grow min-h-0">
          <p
            ref={quoteRef}
            className={`text-sm sm:text-base text-primary leading-relaxed text-left line-clamp-3 ${quoteClassName}`}
          >
            {quote}
          </p>
          {showReadMore && (
            <button
              type="button"
              onClick={() => setShowFullReviewModal(true)}
              className="mt-1 text-sm font-medium text-yellow-500 bg-transparent p-0 border-0 cursor-pointer hover:underline hover:bg-transparent active:bg-transparent focus:outline-none focus:underline focus:bg-transparent"
            >
              Read more
            </button>
          )}
        </div>
      )}

      {/* Full review modal — portaled to document.body so it opens above the whole page (not clipped by carousel) */}
      {showFullReviewModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50"
            onClick={() => setShowFullReviewModal(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowFullReviewModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="full-review-title"
          >
            <div
              className="bg-secondary rounded-2xl shadow-xl border border-gray-300 w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-4 px-4 pb-2 sm:pt-6 sm:px-6 sm:pb-2 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {customerName && (
                      <h2 id="full-review-title" className="text-base sm:text-lg font-bold text-primary">
                        {customerName}
                      </h2>
                    )}
                    {(customerTitle || reviewDate) && (
                      <p className="text-xs sm:text-sm text-primary/70 mt-0.5">
                        {[customerTitle, reviewDate].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullReviewModal(false)}
                    className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-primary bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Close"
                  >
                    <span className="text-xl leading-none">&times;</span>
                  </button>
                </div>
                {rating !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    {renderStars(rating).map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                  </div>
                )}
                {headline && (
                  <p className="text-sm sm:text-base font-bold text-primary mt-2">{headline}</p>
                )}
              </div>
              <div className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1 min-h-0">
                <p className="text-sm sm:text-base text-primary leading-relaxed whitespace-pre-wrap">
                  {quote}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

TestimonialCard.propTypes = {
  rating: PropTypes.number,
  quote: PropTypes.string,
  headline: PropTypes.string,
  customerName: PropTypes.string,
  customerTitle: PropTypes.string,
  reviewDate: PropTypes.string,
  avatar: PropTypes.string,
  avatarAlt: PropTypes.string,
  initials: PropTypes.string,
  starIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  className: PropTypes.string,
  quoteClassName: PropTypes.string,
  customerInfoClassName: PropTypes.string,
  avatarClassName: PropTypes.string,
  nameClassName: PropTypes.string,
  titleClassName: PropTypes.string,
};

export default TestimonialCard;
