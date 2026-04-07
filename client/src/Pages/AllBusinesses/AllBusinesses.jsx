import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SEARCH_DEBOUNCE_MS = 350;
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllSellers } from "../../store/slices/homeSlice";
import { getBusinessProfileImageUrl } from "../../utils/imageUtils";
import { ProductCard } from "../../components";
import grayBag from "../../assets/images/graybag.png";
import countries from "../../utils/countries";

const resolveCountryLabel = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const iso = raw.toUpperCase();
  if (iso.length <= 3) {
    const match = countries.find(
      (c) => String(c.code || "").toUpperCase() === iso,
    );
    if (match?.name) return match.name;
  }
  return raw;
};

const mapBusinessToProduct = (b, navigate) => ({
  id: b.id,
  image: getBusinessProfileImageUrl(b.business_profile_picture) || grayBag,
  imageAlt: b.business_name || "Business",
  verifiedBadgeText: b.is_approved ? "Verified" : "",
  showVerifiedBadge: !!b.is_approved,
  brandName: b.business_name || "",
  location: resolveCountryLabel(b.business_country),
  rating: Number(b.business_rating) || 0,
  reviewCount:
    b.reviews_count ?? (Array.isArray(b.reviews) ? b.reviews.length : 0),
  buttonText: "View Profile",
  onButtonClick: () => navigate(`/business-profile/${b.slug ?? b.id}`),
});

const PER_PAGE = 50;

const matchesSearch = (b, search, brand, country) => {
  const searchLower = (search || "").toLowerCase();
  const nameMatch =
    !search || (b.business_name || "").toLowerCase().includes(searchLower);
  const countryMatch =
    !search || (b.business_country || "").toLowerCase().includes(searchLower);
  const brandMatch =
    !brand ||
    (() => {
      const brandsStr = b.business_brands || "";
      if (!brandsStr) return false;
      const brands = brandsStr.split(",").map((s) => s.trim().toLowerCase());
      return brands.some((br) => br === brand.toLowerCase());
    })();
  const exactCountryMatch =
    !country ||
    (b.business_country || "").toLowerCase() === country.toLowerCase();
  const matchesBusiness = nameMatch || countryMatch;
  return matchesBusiness && brandMatch && exactCountryMatch;
};

const AllBusinesses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { business, status, sellersCurrentPage, sellersLastPage } =
    useAppSelector((state) => state.home);
  const [searchQuery, setSearchQuery] = useState("");

  // Load first page of all stores on mount (50 per page)
  useEffect(() => {
    dispatch(getAllSellers({ page: 1, per_page: PER_PAGE }));
  }, [dispatch]);

  const debounceRef = useRef(null);

  const runSearch = useCallback((_value) => {
    // Search is client-side only: we filter business by searchQuery in render. No API call needed.
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      runSearch(searchQuery);
    },
    [searchQuery, runSearch],
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        runSearch(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [runSearch],
  );

  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(getAllSellers({ page: newPage, per_page: PER_PAGE }));
    },
    [dispatch],
  );

  const searchTrimmed = searchQuery?.trim() || "";
  const rawList = business || [];
  const list = searchTrimmed
    ? rawList.filter((b) => matchesSearch(b, searchTrimmed, "", ""))
    : rawList;

  const products = list.map((b) => mapBusinessToProduct(b, navigate));
  const isLoading = status === "loading";

  const currentPage = sellersCurrentPage;
  const lastPage = sellersLastPage;
  const showPagination = lastPage > 1;

  return (
    <div className="bg-primary min-h-screen py-8 sm:py-12">
      <div className="all-businesses-page max-w-[1200px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Page title — white, bold, centered (no See All on this page) */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary text-center mb-3">
          The Sellers Collective
        </h1>
        <p className="text-center text-secondary/80 mb-8 sm:mb-10 text-sm sm:text-lg md:text-xl font-normal leading-relaxed w-full max-w-full mx-auto px-0">
          The Sellers Collective is our growing, community-powered directory of
          luxury sellers. Browse reviews from real customers, leave your own
          ratings, and shop with confidence—knowing who&apos;s legit before you
          buy. Built on transparency, trust, and buyer protection.
        </p>

        {/* All Businesses — white, bold, centered */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-4 sm:mb-6 text-center">
          All Businesses
        </h2>

        {/* Search bar — centered, icon in place of button, real-time + click-to-search, compact height */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-2xl flex items-center gap-0 rounded-xl shadow-md bg-[#F8F7F5] border border-[#F8F7F5] py-1.5 px-2 sm:py-2 sm:px-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search a company"
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

        {/* Business grid — all stores (verified and unverified), 50 per page */}
        {isLoading ? (
          <div className="text-center py-12 text-secondary">
            Loading businesses...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-secondary/80">
            No businesses found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <div key={product.id ?? index} className="h-full">
                  <ProductCard
                    image={product.image}
                    imageAlt={product.imageAlt}
                    fallbackImage={grayBag}
                    verifiedBadgeText={product.verifiedBadgeText}
                    showVerifiedBadge={product.showVerifiedBadge}
                    brandName={product.brandName}
                    location={product.location}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    buttonText={product.buttonText}
                    onButtonClick={product.onButtonClick}
                    imageClassName="all-businesses-card-img"
                  />
                </div>
              ))}
            </div>

            {/* Pagination — Previous / Page X of Y / Next (50 per page) */}
            {showPagination && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-secondary font-medium">
                  Page {currentPage} of {lastPage}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="px-4 py-2 rounded-lg bg-secondary text-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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

export default AllBusinesses;
