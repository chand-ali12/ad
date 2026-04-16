import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiFileText,
  FiPlay,
  FiCheckCircle,
  FiLogOut,
  FiLock,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiStar,
  FiTrash2,
  FiAward,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";
import { FaUser, FaStore } from "react-icons/fa";
const LogoImage = "/assets/images/header-logo.png";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logoutUser, logout } from "../../../store/slices";
import {
  getProfileImageUrl,
  getBusinessProfileImageUrl,
} from "../../../utils/imageUtils";

const Header = ({
  logoIcon,
  logoText,
  logoSubtext,
  navLinks = [],
  featureLinks = [],
  signUpText = "Sign Up",
  showProfile = true,
  onSignUpClick,
  onProfileClick,
  className = "",
  logoClassName = "",
  navClassName = "",
  buttonClassName = "",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { profile: profileState, user: profileUser } = useAppSelector(
    (state) => state.profile,
  );
  const { business } = useAppSelector((state) => state.business);
  const isAuthenticated = Boolean(token || user?.id);
  const hasBusinessAccount = Boolean(user?.user_business?.length > 0);
  const authCtaText = signUpText === "Sign Up" ? "Sign In" : signUpText;

  // Resolve commonly used navigation items for predictable mobile ordering.
  const homeLink = navLinks.find((l) => l.path === "/");
  const authenticationLink = navLinks.find((l) => l.path === "/authentication");
  const verifyCertificateLink = navLinks.find((l) => l.path === "/verify");
  const ourAppLink = navLinks.find((l) => l.path === "/app");
  const contactUsLink = navLinks.find((l) => l.path === "/contact");
  const blogLink = navLinks.find(
    (l) => l.path === "/blogs" || (l.isButton && l.external),
  );

  const authenticityCardsLink = featureLinks.find(
    (l) => l.path === "/authenticity-cards",
  );
  const subscriptionsLink = featureLinks.find(
    (l) => l.path === "/subscription",
  );
  const sellersCollectiveLink = featureLinks.find(
    (l) => l.path === "/sellers-collective",
  );
  const pricingLink = featureLinks.find((l) => l.path === "/prices");

  // Avatar URL: same as old site (authentic-detective-talha header) — MEDIA_BASE_URL/usersProfile/ or /businessProfile/
  const avatarSrc =
    hasBusinessAccount && business?.business_profile_picture
      ? getBusinessProfileImageUrl(business.business_profile_picture)
      : getProfileImageUrl(
          profileUser?.profile_picture ||
            profileState?.profileImage ||
            user?.profile_picture ||
            null,
        );
  const [brokenAvatarSrc, setBrokenAvatarSrc] = useState(null);
  const showAvatarImg = Boolean(avatarSrc) && brokenAvatarSrc !== avatarSrc;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (path) => {
    setIsProfileMenuOpen(false);
    if (path) {
      if (path === "/profile" && typeof onProfileClick === "function") {
        onProfileClick();
      }
      navigate(path);
    }
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    dispatch(logout());
    dispatch(logoutUser());
    window.location.href = "/";
  };


  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const insideDesktopProfile = profileMenuRef.current?.contains(
        event.target,
      );
      const insideMobileProfile = mobileProfileMenuRef.current?.contains(
        event.target,
      );
      if (!insideDesktopProfile && !insideMobileProfile) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Navigation */}
      <nav className="bg-secondary px-3 sm:px-4 md:px-6 lg:px-6 xl:px-8 py-2.5 sm:py-3 md:py-4 relative overflow-visible">
        <div className="flex justify-between items-center w-full">
          {/* Logo Section - use combined PNG logo */}
          <Link
            to="/"
            className={`flex items-center flex-shrink-0 ${logoClassName}`}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div className="flex-shrink-0">
              {logoIcon ? (
                typeof logoIcon === "string" ? (
                  <img
                    src={logoIcon}
                    alt={logoText || "Authentic Detective logo"}
                    className="logo-full-responsive"
                  />
                ) : React.isValidElement() ? (
                  logoIcon
                ) : typeof logoIcon === "function" ? (
                  React.createElement(logoIcon)
                ) : (
                  <img
                    src={LogoImage}
                    alt={logoText || "Authentic Detective logo"}
                    className="logo-full-responsive"
                  />
                )
              ) : (
                <img
                  src={LogoImage}
                  alt={logoText || "Authentic Detective logo"}
                  className="logo-full-responsive"
                />
              )}
            </div>
            {(logoText || logoSubtext) && (
              <div className="sr-only">
                {logoText ? <span>{logoText}</span> : null}
                {logoSubtext ? <span>{logoSubtext}</span> : null}
              </div>
            )}
          </Link>

          {/* Desktop Nav: sectioned menu with dropdown groups */}
          <div
            className={`hidden items-center xl:flex xl:gap-3 min-[1500px]:ml-4 min-[1500px]:gap-4 min-[1570px]:ml-8 min-[1570px]:gap-8 min-[1680px]:gap-[24px] ${navClassName}`}
            style={{ height: "30px" }}
          >
            {homeLink && (
              <Link
                to={homeLink.path || "/"}
                className={`text-primary hover:text-primary transition-colors whitespace-nowrap flex items-center flex-shrink-0 text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] min-[1680px]:leading-[30px] ${location.pathname.toLowerCase() === (homeLink.path || "/").toLowerCase() ? "underline text-primary" : ""}`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                  height: "30px",
                }}
              >
                Home
              </Link>
            )}
            {authenticationLink && (
              <Link
                to={authenticationLink.path || "/authentication"}
                className={`text-primary hover:text-primary transition-colors whitespace-nowrap flex items-center flex-shrink-0 text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] min-[1680px]:leading-[30px] ${location.pathname.toLowerCase() === (authenticationLink.path || "/authentication").toLowerCase() ? "underline text-primary" : ""}`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.52px",
                  height: "30px",
                }}
              >
                Authentication
              </Link>
            )}

            <div className="relative group flex items-center h-[30px]">
              <button
                type="button"
                className="text-primary/70 group-hover:text-primary text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] bg-transparent border-0 p-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                }}
              >
                Services
              </button>
              <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="min-w-[220px] bg-secondary border border-gray-200/30 shadow-sm rounded-sm py-2">
                  {verifyCertificateLink && (
                    <Link
                      to={verifyCertificateLink.path || "/verify"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (verifyCertificateLink.path || "/verify").toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Verify Certificate
                    </Link>
                  )}
                  {authenticityCardsLink && (
                    <Link
                      to={authenticityCardsLink.path || "/authenticity-cards"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (
                          authenticityCardsLink.path || "/authenticity-cards"
                        ).toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Authenticity Cards
                    </Link>
                  )}
                  {subscriptionsLink &&
                    (subscriptionsLink.external && subscriptionsLink.href ? (
                      <a
                        href={subscriptionsLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 block text-sm text-primary/80 hover:text-primary"
                      >
                        {subscriptionsLink.label}
                      </a>
                    ) : (
                      <Link
                        to={subscriptionsLink.path || "/subscription"}
                        className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                          location.pathname.toLowerCase() ===
                          (
                            subscriptionsLink.path || "/subscription"
                          ).toLowerCase()
                            ? "underline text-primary"
                            : ""
                        }`}
                      >
                        {subscriptionsLink.label}
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            <div className="relative group flex items-center h-[30px]">
              <button
                type="button"
                className="text-primary/70 group-hover:text-primary text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] bg-transparent border-0 p-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                }}
              >
                Network
              </button>
              <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="min-w-[220px] bg-secondary border border-gray-200/30 shadow-sm rounded-sm py-2">
                  {sellersCollectiveLink && (
                    <Link
                      to={sellersCollectiveLink.path || "/sellers-collective"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (
                          sellersCollectiveLink.path || "/sellers-collective"
                        ).toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Sellers Collective
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="relative group flex items-center h-[30px]">
              <button
                type="button"
                className="text-primary/70 group-hover:text-primary text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] bg-transparent border-0 p-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                }}
              >
                Explore
              </button>
              <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="min-w-[220px] bg-secondary border border-gray-200/30 shadow-sm rounded-sm py-2">
                  <Link
                    to="/brands"
                    className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                      location.pathname === "/brands" ||
                      location.pathname.toLowerCase().startsWith("/brand/")
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    Our Brands
                  </Link>
                  {ourAppLink && (
                    <Link
                      to={ourAppLink.path || "/app"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (ourAppLink.path || "/app").toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Our App
                    </Link>
                  )}
                  {blogLink?.external && blogLink.href ? (
                    <a
                      href={blogLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 block text-sm text-primary/80 hover:text-primary"
                    >
                      Blog
                    </a>
                  ) : (
                    <Link
                      to={blogLink?.path || "/blogs"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (blogLink?.path || "/blogs").toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Blog
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="relative group flex items-center h-[30px]">
              <button
                type="button"
                className="text-primary/70 group-hover:text-primary text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] bg-transparent border-0 p-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                }}
              >
                Support
              </button>
              <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="min-w-[220px] bg-secondary border border-gray-200/30 shadow-sm rounded-sm py-2">
                  {contactUsLink && (
                    <Link
                      to={contactUsLink.path || "/contact"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (contactUsLink.path || "/contact").toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Contact us
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="relative group flex items-center h-[30px]">
              <button
                type="button"
                className="text-primary/70 group-hover:text-primary text-xs lg:text-sm xl:text-sm min-[1500px]:text-base min-[1570px]:text-lg min-[1680px]:text-[21px] bg-transparent border-0 p-0"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.52px",
                }}
              >
                Pricing
              </button>
              <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="min-w-[220px] bg-secondary border border-gray-200/30 shadow-sm rounded-sm py-2">
                  {pricingLink && (
                    <Link
                      to={pricingLink.path || "/prices"}
                      className={`px-4 py-2 block text-sm text-primary/80 hover:text-primary ${
                        location.pathname.toLowerCase() ===
                        (pricingLink.path || "/prices").toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      Prices
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Actions - tighter 1500–1569px, then gap-6 from 1570px */}
          <div
            className="flex items-center flex-shrink-0 gap-1.5 lg:gap-2 xl:gap-3 min-[1500px]:gap-3 min-[1570px]:gap-6"
            style={{ minHeight: "45px" }}
          >
            {navLinks.map((link, index) => {
              if (link.isButton) {
                const buttonClassName =
                  "hidden xl:flex items-center justify-center border border-gray-300 bg-secondary text-primary hover:bg-primary/5 transition-colors whitespace-nowrap min-w-[70px] xl:min-w-0 xl:w-[90px] min-[1500px]:w-[100px] min-[1500px]:px-3 xl:px-2 text-sm min-[1500px]:text-lg";
                const buttonStyle = {
                  height: "36px",
                  borderRadius: "6px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                };
                if (link.external && link.href) {
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClassName}
                      style={buttonStyle}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={index}
                    to={link.path || "#"}
                    className={buttonClassName}
                    style={buttonStyle}
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}

            {/* Desktop Sign In CTA (placed after Blog button in right actions) */}
            {!isAuthenticated && (
              <button
                onClick={() =>
                  onSignUpClick ? onSignUpClick() : navigate("/authentication")
                }
                className={`hidden xl:flex items-center justify-center border border-[#3C1F1B] bg-[#3C1F1B] text-white hover:opacity-95 transition-colors whitespace-nowrap min-w-[70px] xl:min-w-0 xl:w-[90px] min-[1500px]:w-[100px] min-[1500px]:px-3 xl:px-2 text-sm min-[1500px]:text-lg ${buttonClassName}`}
                style={{
                  height: "36px",
                  borderRadius: "6px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                }}
              >
                {authCtaText}
              </button>
            )}

            {/* User Profile (desktop – open on hover, like Brands). Avatar same as old site: fixed-size circle, img src = MEDIA_BASE_URL/usersProfile/ or /businessProfile/ */}
            {showProfile && isAuthenticated && (
              <div
                className="relative hidden xl:block"
                ref={profileMenuRef}
                onMouseEnter={() => setIsProfileMenuOpen(true)}
              >
                <button
                  type="button"
                  className="rounded-full border border-gray-300 bg-secondary text-primary hover:bg-primary/5 transition-colors flex items-center justify-center shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    overflow: "hidden",
                    padding: 0,
                  }}
                  aria-label="User Profile"
                >
                  {showAvatarImg ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={() => setBrokenAvatarSrc(avatarSrc)}
                    />
                  ) : (
                    <FaUser className="w-4 h-4" style={{ flexShrink: 0 }} />
                  )}
                </button>

                {/* Profile Dropdown Menu — pt-2 bridges hover gap so clicks reach menu items */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full z-[9999] pt-2">
                    <div className="w-56 max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <button
                        onClick={() => handleMenuClick("/profile")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiUser className="w-5 h-5 text-primary" />
                        <span className="text-primary">Profile</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/settings")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiSettings className="w-5 h-5 text-primary" />
                        <span className="text-primary">Profile Settings</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() =>
                          handleMenuClick("/profile?section=certificates")
                        }
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiAward className="w-5 h-5 text-primary" />
                        <span className="text-primary">Certificates</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      {hasBusinessAccount && (
                        <>
                          <button
                            onClick={() => handleMenuClick("/reviews")}
                            className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                          >
                            <FiStar className="w-5 h-5 text-primary" />
                            <span className="text-primary">Reviews</span>
                          </button>
                          <div
                            className="h-px bg-gray-200 my-0.5"
                            role="separator"
                          />
                        </>
                      )}
                      <button
                        onClick={() => handleMenuClick("/receipts")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiFileText className="w-5 h-5 text-primary" />
                        <span className="text-primary">Receipts</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/subscription")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiCreditCard className="w-5 h-5 text-primary" />
                        <span className="text-primary">Subscription</span>
                      </button>
                      {!hasBusinessAccount && (
                        <>
                          <div
                            className="h-px bg-gray-200 my-0.5"
                            role="separator"
                          />
                          <button
                            onClick={() => handleMenuClick("/add-business")}
                            className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                          >
                            <FaStore className="w-5 h-5 text-primary" />
                            <span className="text-primary">Add Business</span>
                          </button>
                        </>
                      )}
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/verify")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiCheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-primary">Verify Certificate</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/change-password")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiLock className="w-5 h-5 text-primary" />
                        <span className="text-primary">Change Password</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/valuation")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                      >
                        <FiDollarSign className="w-5 h-5 text-primary" />
                        <span className="text-primary">Valuation</span>
                      </button>
                      {/* Review Flow — commented out for now
                    <div className="h-px bg-gray-200 my-0.5" role="separator" />
                    <button
                      onClick={() => handleMenuClick('/review-flow')}
                      className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                    >
                      <FiStar className="w-5 h-5 text-primary" />
                      <span className="text-primary">Review Flow</span>
                    </button>
                    */}
                      {/* Enter Detail — commented out for now
                    <div className="h-px bg-gray-200 my-0.5" role="separator" />
                    <button
                      onClick={() => handleMenuClick('/enter-detail')}
                      className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none"
                    >
                      <FiFileText className="w-5 h-5 text-primary" />
                      <span className="text-primary">Enter Detail</span>
                    </button>
                    */}
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/delete-profile")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-primary bg-transparent hover:bg-gray-50 transition-colors border-0 outline-none focus:outline-none"
                      >
                        <FiTrash2 className="w-5 h-5 text-primary" />
                        <span className="text-primary">Delete account</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-primary bg-transparent hover:bg-gray-50 transition-colors border-0 outline-none focus:outline-none"
                      >
                        <FiLogOut className="w-5 h-5 text-primary" />
                        <span className="text-primary">Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Cart - temporarily disabled */}
            {null}

            {/* User Profile (mobile/tablet) - open menu on click (hover doesn't work on touch) */}
            {showProfile && isAuthenticated && (
              <div className="relative xl:hidden" ref={mobileProfileMenuRef}>
                <button
                  type="button"
                  className="rounded-full border border-gray-300 bg-secondary text-primary hover:bg-primary/5 transition-colors flex items-center justify-center shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    overflow: "hidden",
                    padding: 0,
                  }}
                  aria-label="User Profile"
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  {showAvatarImg ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={() => setBrokenAvatarSrc(avatarSrc)}
                    />
                  ) : (
                    <FaUser className="w-4 h-4" style={{ flexShrink: 0 }} />
                  )}
                </button>
                {/* Profile dropdown for mobile - same menu as desktop, shown on click */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full z-[9999] pt-2">
                    <div className="w-56 max-h-[70vh] overflow-y-auto scrollbar-hide bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <button
                        onClick={() => handleMenuClick("/profile")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiUser className="w-5 h-5 text-primary" />
                        <span className="text-primary">Profile</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/settings")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiSettings className="w-5 h-5 text-primary" />
                        <span className="text-primary">Profile Settings</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() =>
                          handleMenuClick("/profile?section=certificates")
                        }
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiAward className="w-5 h-5 text-primary" />
                        <span className="text-primary">Certificates</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      {hasBusinessAccount && (
                        <>
                          <button
                            onClick={() => handleMenuClick("/reviews")}
                            className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                          >
                            <FiStar className="w-5 h-5 text-primary" />
                            <span className="text-primary">Reviews</span>
                          </button>
                          <div
                            className="h-px bg-gray-200 my-0.5"
                            role="separator"
                          />
                        </>
                      )}
                      <button
                        onClick={() => handleMenuClick("/receipts")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiFileText className="w-5 h-5 text-primary" />
                        <span className="text-primary">Receipts</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/subscription")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiCreditCard className="w-5 h-5 text-primary" />
                        <span className="text-primary">Subscription</span>
                      </button>
                      {!hasBusinessAccount && (
                        <>
                          <div
                            className="h-px bg-gray-200 my-0.5"
                            role="separator"
                          />
                          <button
                            onClick={() => handleMenuClick("/add-business")}
                            className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                          >
                            <FaStore className="w-5 h-5 text-primary" />
                            <span className="text-primary">Add Business</span>
                          </button>
                        </>
                      )}
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/verify")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiCheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-primary">Verify Certificate</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/change-password")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiLock className="w-5 h-5 text-primary" />
                        <span className="text-primary">Change Password</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/valuation")}
                        className="flex gap-3 items-center px-4 py-2 w-full bg-transparent border-0 transition-colors outline-none text-primary hover:bg-gray-50 focus:outline-none text-left"
                      >
                        <FiDollarSign className="w-5 h-5 text-primary" />
                        <span className="text-primary">Valuation</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={() => handleMenuClick("/delete-profile")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-primary bg-transparent hover:bg-gray-50 transition-colors border-0 outline-none focus:outline-none text-left"
                      >
                        <FiTrash2 className="w-5 h-5 text-primary" />
                        <span className="text-primary">Delete account</span>
                      </button>
                      <div
                        className="h-px bg-gray-200 my-0.5"
                        role="separator"
                      />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-primary bg-transparent hover:bg-gray-50 transition-colors border-0 outline-none focus:outline-none text-left"
                      >
                        <FiLogOut className="w-5 h-5 text-primary" />
                        <span className="text-primary">Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Menu Toggle (drawer) - shown below xl so 1024 uses drawer like mobile */}
            <button
              onClick={toggleMobileMenu}
              className="xl:hidden flex items-center justify-center shrink-0 p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-secondary text-primary hover:bg-primary/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              ) : (
                <FiMenu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Drawer Menu - sectioned mobile-style navbar (also on desktop) */}
        {isMobileMenuOpen && (
          <div
            className="absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-secondary shadow-md xl:hidden flex flex-col overflow-hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              maxHeight: "calc(100dvh - 70px)",
              overscrollBehavior: "contain",
            }}
          >
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 md:px-6 lg:px-8 pt-3 pb-3 sm:pt-4 sm:pb-4">
              <div className="flex flex-col gap-2">
                {/* PRIMARY */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Primary
                </div>
                {homeLink && (
                  <Link
                    to={homeLink.path || "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/90 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (homeLink.path || "/").toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>Home</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}
                {authenticationLink && (
                  <Link
                    to={authenticationLink.path || "/authentication"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/90 font-bold hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (
                        authenticationLink.path || "/authentication"
                      ).toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>Authentication</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}

                <div className="h-px bg-gray-200 my-1.5" />

                {/* SERVICES */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Services
                </div>
                {verifyCertificateLink && (
                  <Link
                    to={verifyCertificateLink.path || "/verify"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (verifyCertificateLink.path || "/verify").toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>{verifyCertificateLink.label}</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}
                {authenticityCardsLink && (
                  <Link
                    to={authenticityCardsLink.path || "/authenticity-cards"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (
                        authenticityCardsLink.path || "/authenticity-cards"
                      ).toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>{authenticityCardsLink.label}</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}
                {subscriptionsLink &&
                  (subscriptionsLink.external && subscriptionsLink.href ? (
                    <a
                      href={subscriptionsLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between"
                    >
                      <span>{subscriptionsLink.label}</span>
                      <FiChevronRight className="w-4 h-4 text-primary/50" />
                    </a>
                  ) : (
                    <Link
                      to={subscriptionsLink.path || "/subscription"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                        location.pathname.toLowerCase() ===
                        (
                          subscriptionsLink.path || "/subscription"
                        ).toLowerCase()
                          ? "underline text-primary"
                          : ""
                      }`}
                    >
                      <span>{subscriptionsLink.label}</span>
                      <FiChevronRight className="w-4 h-4 text-primary/50" />
                    </Link>
                  ))}

                <div className="h-px bg-gray-200 my-1.5" />

                {/* NETWORK */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Network
                </div>
                {sellersCollectiveLink && (
                  <Link
                    to={sellersCollectiveLink.path || "/sellers-collective"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (
                        sellersCollectiveLink.path || "/sellers-collective"
                      ).toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>{sellersCollectiveLink.label}</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}

                <div className="h-px bg-gray-200 my-1.5" />

                {/* EXPLORE */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Explore
                </div>
                <Link
                  to="/brands"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center justify-between ${
                    location.pathname === "/brands" ||
                    location.pathname.toLowerCase().startsWith("/brand/")
                      ? "text-primary underline"
                      : "text-primary/80"
                  }`}
                >
                  <span>Our Brands</span>
                  <FiChevronRight className="w-4 h-4 text-primary/50" />
                </Link>
                {ourAppLink && (
                  <Link
                    to={ourAppLink.path || "/app"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (ourAppLink.path || "/app").toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>{ourAppLink.label}</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}
                {blogLink && (
                  <>
                    {blogLink.external && blogLink.href ? (
                      <a
                        href={blogLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between`}
                      >
                        <span>Blog</span>
                        <FiChevronRight className="w-4 h-4 text-primary/50" />
                      </a>
                    ) : (
                      <Link
                        to={blogLink.path || "/blogs"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                          location.pathname.toLowerCase() ===
                          (blogLink.path || "/blogs").toLowerCase()
                            ? "underline text-primary"
                            : ""
                        }`}
                      >
                        <span>Blog</span>
                        <FiChevronRight className="w-4 h-4 text-primary/50" />
                      </Link>
                    )}
                  </>
                )}

                <div className="h-px bg-gray-200 my-1.5" />

                {/* SUPPORT */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Support
                </div>
                {contactUsLink && (
                  <Link
                    to={contactUsLink.path || "/contact"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (contactUsLink.path || "/contact").toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>Contact Us</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}

                <div className="h-px bg-gray-200 my-1.5" />

                {/* PRICING */}
                <div className="px-4 pt-1 text-[11px] font-semibold tracking-wider text-primary/60 uppercase">
                  Pricing
                </div>
                {pricingLink && (
                  <Link
                    to={pricingLink.path || "/prices"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 text-sm text-primary/80 font-medium hover:text-primary transition-colors flex items-center justify-between ${
                      location.pathname.toLowerCase() ===
                      (pricingLink.path || "/prices").toLowerCase()
                        ? "underline text-primary"
                        : ""
                    }`}
                  >
                    <span>Prices</span>
                    <FiChevronRight className="w-4 h-4 text-primary/50" />
                  </Link>
                )}

                {/* Bottom CTA (mobile) */}
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      handleLogout();
                    } else if (onSignUpClick) {
                      onSignUpClick();
                    } else {
                      navigate("/authentication");
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 py-3.5 text-sm sm:text-base font-semibold text-center rounded-lg bg-[#3C1F1B] text-white hover:opacity-95 transition-colors"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {isAuthenticated ? "Sign Out" : authCtaText}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

Header.propTypes = {
  logoIcon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.string,
    PropTypes.node,
  ]),
  logoText: PropTypes.string,
  logoSubtext: PropTypes.string,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      isButton: PropTypes.bool,
    }),
  ),
  featureLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      href: PropTypes.string,
      external: PropTypes.bool,
    }),
  ),
  signUpText: PropTypes.string,
  showProfile: PropTypes.bool,
  onSignUpClick: PropTypes.func,
  onProfileClick: PropTypes.func,
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  navClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
};

export default Header;
