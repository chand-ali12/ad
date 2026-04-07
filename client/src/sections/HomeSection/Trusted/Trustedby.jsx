import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SectionHeader, TestimonialCard } from "../../../components";

const TrustedBy = ({
  heading = "Trusted by Thousands",
  testimonials = [],
  currentPage = 1,
  lastPage = 1,
  onPageChange,
  isLoading = false,
  className = "",
}) => {
  const swiperRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateNavState = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      rating: 5,
      quote:
        "The most thorough authentication service I've used. The attention to detail is unmatched.",
      customerName: "Sarah Chen",
      customerTitle: "Luxury Collector",
    },
    {
      rating: 5,
      quote:
        "Fast, professional, and incredibly detailed reports. This is now my go-to authentication service.",
      customerName: "Michael Ross",
      customerTitle: "Reseller",
    },
    {
      rating: 5,
      quote:
        "Peace of mind knowing my investments are protected. Highly recommend!",
      customerName: "Emma Laurent",
      customerTitle: "Fashion Enthusiast",
    },
  ];

  const testimonialsToRender =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-25 ${className}`}
    >
      {/* Section Header */}
      <SectionHeader
        heading={heading}
        headingColor="primary"
        className="text-center mb-8 sm:mb-10 md:mb-12"
        headingClassName="text-center"
      />

      {/* Swiper carousel: full-width on mobile, arrows below, equal-height cards */}
      <div className="mb-8 sm:mb-10 md:mb-12 trusted-by-carousel">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setAtStart(swiper.isBeginning);
            setAtEnd(swiper.isEnd);
          }}
          onSlideChange={updateNavState}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
          }}
          className="trusted-by-swiper"
        >
          {isLoading ? (
            <SwiperSlide>
              <div className="text-center py-12 text-primary">
                Loading reviews...
              </div>
            </SwiperSlide>
          ) : (
            testimonialsToRender.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id ?? index}>
                <div className="trusted-by-slide-inner">
                  <TestimonialCard
                    rating={testimonial.rating}
                    quote={testimonial.quote}
                    headline={testimonial.headline}
                    customerName={testimonial.customerName}
                    customerTitle={testimonial.customerTitle}
                    reviewDate={testimonial.reviewDate}
                    initials={testimonial.initials}
                    avatar={testimonial.avatar}
                    avatarAlt={testimonial.avatarAlt}
                  />
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>

        {/* Arrows below carousel — grey/disabled at start and end (styles scoped in index.css to override global button) */}
        <div className="trusted-by-carousel-nav mx-auto flex w-full items-center justify-center gap-3 mt-4 sm:mt-5">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={atStart}
            aria-label="Previous reviews"
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors relative ${
              atStart ? "carousel-nav-disabled" : "carousel-nav-active"
            }`}
          >
            <span
              className="text-xl md:text-2xl leading-none text-center w-full h-full flex justify-center items-center"
              aria-hidden
            >
              ‹
            </span>
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={atEnd}
            aria-label="Next reviews"
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors relative ${
              atEnd ? "carousel-nav-disabled" : "carousel-nav-active"
            }`}
          >
            <span
              className="text-xl md:text-2xl leading-none text-center w-full h-full flex justify-center items-center"
              aria-hidden
            >
              ›
            </span>
          </button>
        </div>
      </div>

      {/* Pagination (for API-driven multi-page when used) */}
      {onPageChange && lastPage > 1 && !isLoading && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded-lg bg-primary text-secondary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-primary font-medium">
            Page {currentPage} of {lastPage}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="px-4 py-2 rounded-lg bg-primary text-secondary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

TrustedBy.propTypes = {
  heading: PropTypes.string,
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.number,
      quote: PropTypes.string,
      headline: PropTypes.string,
      customerName: PropTypes.string,
      customerTitle: PropTypes.string,
      reviewDate: PropTypes.string,
      initials: PropTypes.string,
      avatar: PropTypes.string,
      avatarAlt: PropTypes.string,
    }),
  ),
  currentPage: PropTypes.number,
  lastPage: PropTypes.number,
  onPageChange: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default TrustedBy;
