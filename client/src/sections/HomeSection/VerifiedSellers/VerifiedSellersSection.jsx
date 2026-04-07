import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SectionHeader, ProductCard } from "../../../components";
import grayBag from "../../../assets/images/graybag.png";

const VerifiedSellersSection = ({
  heading = "Sellers Collective",
  subHeading = "Trusted sellers verified by our community",
  products = [],
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

  return (
    <div className={`bg-primary py-8 sm:py-12 md:py-16 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeader
          heading={heading}
          subHeading={subHeading}
          headingColor="secondary"
          subHeadingColor="secondary"
          className="text-center mb-6 sm:mb-8"
          headingClassName="text-center"
          subHeadingClassName="text-center"
        />

        {isLoading ? (
          <div className="text-center py-12 text-secondary">
            Loading verified sellers...
          </div>
        ) : (
          <>
            <div className="verified-sellers-carousel mb-8">
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
                  0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 12 },
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 16,
                  },
                }}
                className="verified-sellers-swiper"
              >
                {products.map((product, index) => (
                  <SwiperSlide key={product.id ?? index}>
                    <div className="verified-sellers-slide-inner h-full">
                      <ProductCard
                        image={product.image}
                        imageAlt={product.imageAlt}
                        fallbackImage={grayBag}
                        verifiedBadgeText={product.verifiedBadgeText}
                        showVerifiedBadge={product.showVerifiedBadge || false}
                        brandName={product.brandName}
                        location={product.location}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        buttonText={product.buttonText}
                        buttonIcon={product.buttonIcon}
                        onButtonClick={product.onButtonClick}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="verified-sellers-carousel-nav mx-auto flex w-full items-center justify-center gap-3 mt-4 sm:mt-5">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={atStart}
                  aria-label="Previous sellers"
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors relative ${
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
                  aria-label="Next sellers"
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full border shadow-md flex items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors relative ${
                    atEnd ? "carousel-nav-disabled" : "carousel-nav-active"
                  }`}
                >
                  <span
                    className="text-xl md:text-2xl leading-none text-center  w-full h-full flex justify-center items-center"
                    aria-hidden
                  >
                    ›
                  </span>
                </button>
              </div>
            </div>

            {onPageChange && lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors text-center"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-secondary font-medium text-center">
                  Page {currentPage} of {lastPage}
                </span>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors text-center"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

VerifiedSellersSection.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      imageAlt: PropTypes.string,
      verifiedBadgeText: PropTypes.string,
      showVerifiedBadge: PropTypes.bool,
      brandName: PropTypes.string,
      location: PropTypes.string,
      rating: PropTypes.number,
      reviewCount: PropTypes.number,
      buttonText: PropTypes.string,
      buttonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
      onButtonClick: PropTypes.func,
    }),
  ),
  currentPage: PropTypes.number,
  lastPage: PropTypes.number,
  onPageChange: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default VerifiedSellersSection;
