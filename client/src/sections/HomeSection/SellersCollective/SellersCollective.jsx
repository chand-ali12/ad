import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { SectionHeader, ProductCard } from '../../../components';
import { FaSearch } from 'react-icons/fa';

const SEARCH_DEBOUNCE_MS = 350;
import grayBag from '../../../assets/images/graybag.png';
import blackBag from '../../../assets/images/blackbag.png';
import greenBag from '../../../assets/images/greenbag.png';
import silverBag from '../../../assets/images/silverbag.png';

const SellersCollective = ({
  heading = "The Sellers Collective",
  subHeading = "Discover Trusted Luxury Sellers — Rated by Real Buyers",
  description = "Browse reviews from real customers, leave your own ratings, and shop with confidence—knowing who's legit before you buy.",
  searchPlaceholder = "Search for business...",
  brandPlaceholder = "Filter by brand..",
  countryPlaceholder = "All countries",
  products = [],
  countries = [],
  onSearch,
  onSeeAllClick,
  currentPage = 1,
  lastPage = 1,
  onPageChange,
  isLoading = false,
  showPagination = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const handleSeeAll = () => {
    if (onSeeAllClick) {
      onSeeAllClick();
    } else {
      navigate('/sellers-collective');
    }
  };
  // Default products if none provided
  const defaultProducts = [
    {
      image: grayBag,
      imageAlt: "Luxury seller",
      verifiedBadgeText: "Verified",
      showVerifiedBadge: true,
      brandName: "Cache London",
      location: "Denmark",
      rating: 4.5,
      reviewCount: 128,
      buttonText: "View Profile",
    },
    {
      image: blackBag,
      imageAlt: "Designer seller",
      verifiedBadgeText: "Verified",
      showVerifiedBadge: true,
      brandName: "Luxe vintage closet",
      location: "United states of America",
      rating: 4.8,
      reviewCount: 256,
      buttonText: "View Profile",
    },
    {
      image: greenBag,
      imageAlt: "Premium seller",
      verifiedBadgeText: "Verified",
      showVerifiedBadge: true,
      brandName: "Savic fashion",
      location: "Canada",
      rating: 4.7,
      reviewCount: 189,
      buttonText: "View Profile",
    },
    {
      image: silverBag,
      imageAlt: "Elite seller",
      verifiedBadgeText: "Verified",
      showVerifiedBadge: true,
      brandName: "Poshmark",
      location: "Denmark",
      rating: 4.9,
      reviewCount: 342,
      buttonText: "View Profile",
    },
  ];

  const productsToRender = products.length > 0 ? products : (onSearch ? [] : defaultProducts);

  const [searchValue, setSearchValue] = useState('');
  const debounceRef = useRef(null);

  const runSearch = useCallback((value) => {
    if (onSearch) {
      onSearch({ search: String(value ?? '').trim(), brand: '', country: '' });
    }
  }, [onSearch]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    runSearch(searchValue);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!onSearch) return;
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      runSearch(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className={`bg-primary py-8 sm:py-12 md:py-16 ${className}`}>
      <div className="max-w-[1200px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <SectionHeader
          heading={heading}
          subHeading={subHeading}
          headingColor="secondary"
          subHeadingColor="secondary"
          className="text-center mb-4 sm:mb-5 md:mb-6"
          headingClassName="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          subHeadingClassName="text-center text-xs sm:text-base max-w-full overflow-visible"
        />

        {/* Description Text */}
        {description && (
          <p className="text-center text-secondary/80 mb-6 sm:mb-7 md:mb-8 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto px-4">
            {description}
          </p>
        )}

        {/* Search bar centered (same width), See All at far right — reserve space for wider button at 768/1024 */}
        <div className="mb-8 sm:mb-10 md:mb-12 w-full flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 hidden sm:block" aria-hidden />
          <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl xl:max-w-4xl flex min-w-0 shrink">
            <div className="flex items-center gap-0 rounded-xl shadow-md bg-[#F8F7F5] border border-[#F8F7F5] py-1.5 px-2 sm:py-2 sm:px-2.5 flex-1 min-h-0 min-w-0 w-full">
              <input
                type="text"
                name="search"
                value={searchValue}
                onChange={handleInputChange}
                placeholder={searchPlaceholder}
                className="flex-1 min-w-0 outline-none border-none bg-transparent text-primary placeholder:text-[#999999] text-sm sm:text-base py-0.5 sm:py-1 pl-1.5 sm:pl-2"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="p-1.5 sm:p-2 rounded-lg bg-transparent text-primary hover:opacity-80 transition-opacity duration-300 active:scale-[0.98] flex-shrink-0"
                aria-label="Search"
              >
                <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
          <div className="w-full sm:flex-1 sm:min-w-[12rem] min-w-0 flex sm:justify-end items-stretch shrink-0">
            <button
              type="button"
              onClick={handleSeeAll}
              className="w-full sm:w-auto rounded-xl border border-primary bg-secondary text-primary px-6 sm:px-8 md:px-10 font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors duration-300 active:scale-[0.98] whitespace-nowrap flex-shrink-0 shadow-md h-full min-h-[42px] sm:min-h-[46px] flex items-center justify-center sm:min-w-[8.5rem]"
            >
              See All
            </button>
          </div>
        </div>

        {/* Product Cards — horizontal carousel, one row, dots below; card design unchanged */}
        {isLoading ? (
          <div className="text-center py-12 text-secondary">Loading sellers...</div>
        ) : (
          <>
            <div className="sellers-collective-carousel mb-6 -mx-3 sm:mx-0">
              {productsToRender.length === 0 ? (
                <div className="text-center py-12 text-secondary/80">
                  No businesses found matching your search.
                </div>
              ) : (
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  slidesPerView={2}
                  slidesPerGroup={2}
                  spaceBetween={8}
                  breakpoints={{
                    640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
                    1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 16 },
                    1280: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 16 },
                    1536: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 16 },
                  }}
                  className="sellers-collective-swiper px-3 sm:px-0"
                >
                  {productsToRender.map((product, index) => (
                    <SwiperSlide key={product.id ?? index}>
                      <div className="sellers-collective-slide-inner h-full">
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
                          imageClassName="sellers-collective-card-img"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div> 
            {/* Pagination (Previous / Page X of Y / Next) — commented out per request
            {showPagination && onPageChange && lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-secondary font-medium">
                  Page {currentPage} of {lastPage}
                </span>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
                >
                  Next
                </button>
              </div>
            )}
            */}
          </>
        )}
      </div>
    </div>
  );
};

SellersCollective.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  description: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  brandPlaceholder: PropTypes.string,
  countryPlaceholder: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.shape({ business_country: PropTypes.string })),
  currentPage: PropTypes.number,
  lastPage: PropTypes.number,
  onPageChange: PropTypes.func,
  isLoading: PropTypes.bool,
  showPagination: PropTypes.bool,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
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
    })
  ),
  onSearch: PropTypes.func,
  onSeeAllClick: PropTypes.func,
  className: PropTypes.string,
};

export default SellersCollective;
