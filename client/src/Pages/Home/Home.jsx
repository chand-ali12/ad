import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "../../sections/HomeSection/HeroSection/HeroSection";
import PremiumSolution from "../../sections/HomeSection/PremiumSloution/PremiumSloution";
import SubscriptionsSection from "../../sections/HomeSection/Subscriptions/Subscriptions";
import HowItWorks from "../../sections/HomeSection/How It Works/HowItWorks";
import SellersCollective from "../../sections/HomeSection/SellersCollective/SellersCollective";
import VerifiedSellersSection from "../../sections/HomeSection/VerifiedSellers/VerifiedSellersSection";
import TrustedBy from "../../sections/HomeSection/Trusted/Trustedby";
import heroImage from "../../assets/images/heroimg.png";
import grayBag from "../../assets/images/graybag.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getAllSellers,
  getAllReviews,
  getVerifiedSellers,
  getVerifiedBusiness,
  getBusinessCountries,
} from "../../store/slices/homeSlice";
import { getBusinessProfileImageUrl } from "../../utils/imageUtils";
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

/** Static reviews for Recent Reviews section (no API fetch for now); initials shown in avatar circle */
const STATIC_RECENT_REVIEWS = [
  {
    id: 1,
    rating: 5,
    headline: "Amazing experience and 100% trusted! 5 stars!",
    quote:
      "Amazing experience! It's my third time and I'm very satisfied with this service. 100% trusted!",
    customerName: "Arianne",
    customerTitle: "PT • 1 review",
    reviewDate: "Aug 10, 2025",
  },
  {
    id: 2,
    rating: 5,
    headline: "Reliable and trustworthy authentication",
    quote:
      "I have used Authentic Detective reliably for 75 purses. Authentication is quick and I feel confident in the results, both positives and negatives. I highly recommend!",
    customerName: "Melissa",
    customerTitle: "US • 6 reviews",
    reviewDate: "Jul 25, 2025",
  },
  {
    id: 3,
    rating: 5,
    headline: "Another Amazing Experience",
    quote:
      'Wow- another amazing experience with authentic detective. The customer service is top tier, I can\'t rave enough. Very educated aswell! Needed an authenticity certificate for a bag I own; that sadly has some damage (missing some hardware) But even with out it being in "perfect" condition- they were able to still verify authenticity!! Real authenticators verifying, not some computer assuming. Not to mention the turn around time?! Wow. Always a 10/10 experience dealing with authentic detective!',
    customerName: "Thatz Hot Thrift",
    customerTitle: "CA • 2 reviews",
    reviewDate: "Jul 29, 2025",
    initials: "T",
  },
  {
    id: 4,
    rating: 5,
    headline: "10/10 most thorough authentication process I've ever purchased.",
    quote:
      "They go above and beyond to ensure every detail is accounted for. I only have true peace of mind with them.",
    customerName: "James Christian Hiana",
    customerTitle: "",
    reviewDate: "Dec 12, 2025",
    initials: "J",
  },
  {
    id: 5,
    rating: 5,
    headline: "Authentic Detective Makes Life Easier",
    quote:
      "I used Authentic Detective to authenticate a Dior belt I found at the thrift store and it was the easiest and quickest experience I have had! As a reseller, I rely on them for help to make sure my customers get exactly what they ordered and Authentic Detective does exactly that in a no stress manor!",
    customerName: "Allie",
    customerTitle: "US • 1 review",
    reviewDate: "Jul 22, 2025",
    initials: "AL",
  },
  {
    id: 6,
    rating: 5,
    headline: "Highly recommend Authentic Detective",
    quote:
      "Highly recommend Authentic Detective. Unlike some services their turnaround time is fast. Prices are reasonable and all authentications come with a COA. I have used other services before but hands down will only use AD now!",
    customerName: "Alldressedup1",
    customerTitle: "US • 2 reviews",
    reviewDate: "Jul 22, 2025",
    initials: "AL",
  },
  {
    id: 7,
    rating: 5,
    headline: "SUPER QUICK TURNAROUND",
    quote:
      "I've been an original user since AD started and have used the APP to certify my purchases multiple times. The quick time frame (always less than 24 hours), sometimes within 30 minutes is AMAZING! They have asked for additional pics when required. CAN NOT FAULT AD!!",
    customerName: "Kelly",
    customerTitle: "AU • 1 review",
    reviewDate: "Jul 21, 2025",
    initials: "KE",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    business,
    businessCountries,
    sellersCurrentPage,
    sellersLastPage,
    reviews,
    reviewsCurrentPage,
    reviewsLastPage,
    reviewsStatus,
    verifiedSellers,
    verifiedSellersCurrentPage,
    verifiedSellersLastPage,
    verifiedSellersStatus,
    searchResults,
    searchStatus,
    status: homeStatus,
  } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [lastBrand, setLastBrand] = useState("");
  const [lastCountry, setLastCountry] = useState("");
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [dontShowCertificatesModalAgain, setDontShowCertificatesModalAgain] =
    useState(false);
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    dispatch(getAllSellers({ page: 1, per_page: 50 }));
    dispatch(getAllReviews({ page: 1 }));
    dispatch(getVerifiedBusiness());
    dispatch(getBusinessCountries());
  }, [dispatch]);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(
        "webCertificatesModalDismissed",
      );
      if (!dismissed) {
        setShowCertificatesModal(true);
      }
    } catch {
      setShowCertificatesModal(true);
    }
  }, []);

  useEffect(() => {
    const stateToastMessage = location.state?.toastMessage;
    if (!stateToastMessage) return;
    setToastMessage(String(stateToastMessage));
    setToastVariant(
      location.state?.toastVariant === "error" ? "error" : "success",
    );
    const timeout = window.setTimeout(() => setToastMessage(""), 3000);
    navigate(location.pathname, { replace: true, state: {} });
    return () => clearTimeout(timeout);
  }, [location.pathname, location.state, navigate]);

  const handleStartAuthenticationClick = () => {
    // Always take user to Authentication page, regardless of auth status
    navigate("/authentication");
  };

  const handleSearch = (query) => {
    const searchVal =
      typeof query === "object" && query !== null ? query.search : query;
    const brandVal =
      typeof query === "object" && query !== null ? query.brand : "";
    const countryVal =
      typeof query === "object" && query !== null ? query.country : "";
    const searchTrimmed = String(searchVal ?? "").trim();
    const brandTrimmed = String(brandVal ?? "").trim();
    const countryTrimmed = String(countryVal ?? "").trim();
    const hasSearch = !!searchTrimmed || !!brandTrimmed || !!countryTrimmed;
    setHasSearched(hasSearch);
    setLastSearch(searchTrimmed);
    setLastBrand(brandTrimmed);
    setLastCountry(countryTrimmed);
    // Search is client-side: we filter the loaded business list in render (no search API call)
  };

  const matchesSearch = (b, search, brand, country) => {
    const searchLower = (search || "").toLowerCase();
    const nameMatch =
      !search || (b.business_name || "").toLowerCase().includes(searchLower);
    const countryMatch =
      !search || (b.business_country || "").toLowerCase().includes(searchLower);
    const matchesBrand =
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
    return matchesBusiness && matchesBrand && exactCountryMatch;
  };

  // Use business list and filter client-side (same as sellers-collective page) so search works without relying on broken API
  let businessList = business || [];
  if (hasSearched && (lastSearch || lastBrand || lastCountry)) {
    businessList = businessList.filter((b) =>
      matchesSearch(b, lastSearch, lastBrand, lastCountry),
    );
  }
  const verifiedOnlyList = (business || []).filter((b) => !!b.is_approved);
  // When user has searched: show all matching stores (verified + unverified). When no search: only verified.
  const sellersCollectiveList =
    lastSearch || lastBrand || lastCountry ? businessList : verifiedOnlyList;
  const products = sellersCollectiveList.map((b) =>
    mapBusinessToProduct(b, navigate),
  );

  // Recent Reviews: static data (no API); initials-only avatars in TestimonialCard
  const testimonials = STATIC_RECENT_REVIEWS;

  const handleReviewsPageChange = (_page) => {
    // Static reviews: single page only; no-op or could expand later
  };

  const handleVerifiedSellersPageChange = (page) => {
    if (page >= 1 && page <= verifiedSellersLastPage) {
      dispatch(getVerifiedSellers({ page }));
    }
  };

  const handleSellersPageChange = (page) => {
    if (page >= 1 && page <= sellersLastPage) {
      dispatch(getAllSellers({ page, per_page: 50 }));
    }
  };

  const verifiedSellersProducts = (verifiedSellers || []).map((b) => ({
    ...mapBusinessToProduct(b, navigate),
    showVerifiedBadge: true,
    verifiedBadgeText: "Verified",
  }));

  const handleCloseCertificatesModal = () => {
    if (dontShowCertificatesModalAgain) {
      try {
        window.localStorage.setItem("webCertificatesModalDismissed", "true");
      } catch {
        // ignore storage errors
      }
    }
    setShowCertificatesModal(false);
  };

  const handleGoToCertificates = () => {
    handleCloseCertificatesModal();
    navigate("/profile");
  };

  const handleGoToSellersCollective = () => {
    navigate("/sellers-collective");
  };

  const handleCloseAuthPrompt = () => {
    setShowAuthPromptModal(false);
  };

  const handleGoToSignIn = () => {
    setShowAuthPromptModal(false);
    navigate("/signin");
  };

  const handleGoToSignUp = () => {
    setShowAuthPromptModal(false);
    navigate("/signup");
  };

  return (
    <div>
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toastVariant === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          <p className="font-medium">{toastMessage}</p>
        </div>
      )}
      <HeroSection
        backgroundImage={heroImage}
        bannerText="Need It Fast? 60-Minute Expedited Service Available Now"
        bannerBoldFragment="60-Minute Expedited Service Available Now"
        smallHeading="Expert"
        largeHeading="Luxury Authentication"
        description="Trust Authentic Detective to verify your designer bags, shoes, and accessories. Every authentication includes a Certificate of Authenticity, so you can shop, sell, or gift with total peace of mind."
        primaryButtonText="Start Authentication"
        primaryButtonOnClick={handleStartAuthenticationClick}
        // secondaryButtonText="Explore Services"
        secondaryButtonOnClick={handleStartAuthenticationClick}
        heroCardProps={{
          largeHeadingClassName: "hero-large-heading-responsive",
          smallHeadingClassName: "hero-small-heading-responsive",
          descriptionClassName: "hero-description-responsive",
        }}
      />
      <PremiumSolution />
      <SubscriptionsSection />
      <HowItWorks />
      {/*       <SellersCollective
        products={products}
        onSearch={handleSearch}
        countries={businessCountries || []}
        currentPage={sellersCurrentPage}
        lastPage={sellersLastPage}
        onPageChange={handleSellersPageChange}
        isLoading={homeStatus === 'loading'}
        showPagination={!(lastSearch || lastBrand)}
      /> */}
      <VerifiedSellersSection
        heading={
          <button
            type="button"
            onClick={handleGoToSellersCollective}
            className="bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer hover:underline underline-offset-4"
          >
            Sellers Collective
          </button>
        }
        products={verifiedSellersProducts}
        currentPage={verifiedSellersCurrentPage}
        lastPage={verifiedSellersLastPage}
        onPageChange={handleVerifiedSellersPageChange}
        isLoading={verifiedSellersStatus === "loading"}
      />
      <TrustedBy
        heading="Trusted by Thousands"
        testimonials={testimonials}
        currentPage={1}
        lastPage={1}
        onPageChange={handleReviewsPageChange}
        isLoading={false}
      />
      {/* {showCertificatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-secondary rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-start justify-between mb-3 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                Web Access to Certificates!
              </h2>
              <button
                type="button"
                onClick={handleCloseCertificatesModal}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full  hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Close"
              >
                <span className="text-lg sm:text-xl leading-none">×</span>
              </button>
            </div>
            <p className="text-sm sm:text-base text-primary/80 mb-2 leading-relaxed">
              You can view, download, or share your verified items directly from your web profile.
            </p>
            <p className="text-sm sm:text-base text-primary/80 mb-4 leading-relaxed">
              Access your certificates any time, from any device&mdash;no app required.
            </p>
            <label className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-primary/80">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={dontShowCertificatesModalAgain}
                onChange={(e) => setDontShowCertificatesModalAgain(e.target.checked)}
              />
              <span>Don&apos;t show this again</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleGoToCertificates}
                className="w-full sm:flex-1 bg-primary text-secondary py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-hover active:scale-[0.98] transition-transform"
              >
                Go to My Certificates
              </button>
              <button
                type="button"
                onClick={handleCloseCertificatesModal}
                className="w-full sm:flex-1 bg-white text-primary border border-gray-300 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 active:scale-[0.98] transition-transform"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )} */}
      {showAuthPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-secondary rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={handleCloseAuthPrompt}
              className="absolute right-4 top-4 text-primary/60 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Sign In or Sign Up
            </h2>
            <p className="text-sm sm:text-base text-primary/80 mb-4 leading-relaxed">
              You need an account to start a new authentication. Please sign in
              or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleGoToSignIn}
                className="w-full sm:flex-1 bg-primary text-secondary py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-hover active:scale-[0.98] transition-transform"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleGoToSignUp}
                className="w-full sm:flex-1 bg-white text-primary border border-gray-300 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 active:scale-[0.98] transition-transform"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
