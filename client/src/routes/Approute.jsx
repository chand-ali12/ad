import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useEffect } from "react";

import { useAppSelector } from "../store/hooks";

import { Header } from "../components";

import Footer from "../components/common components/Footer/Footer";

import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../Pages/Home/Home";

import Authentication from "../Pages/Authentication/Authentication";

import OurApp from "../Pages/OurApp/OurApp";

import ContactUs from "../Pages/ContactUs/ContactUs";

import Verify from "../Pages/Verify/Verify";

import Pricing from "../Pages/Pricing/Pricing";
import Prices from "../Pages/Prices/Prices";

import SignInPage from "../Pages/Auth/SignIn";

import SignUpPage from "../Pages/Auth/SignUp";

import ForgetPasswordPage from "../Pages/Auth/ForgetPassword";

import ResetPasswordPage from "../Pages/Auth/ResetPassword";
import UpdatePasswordPage from "../Pages/Auth/UpdatePassword";

import DateRangePage from "../Pages/Auth/DateRange";

import UserProfile from "../Pages/Profile/UserProfile/UserProfile";

import ReviewsPage from "../Pages/Reviews/Reviews";
import ReviewerProfile from "../Pages/ReviewerProfile/ReviewerProfile";

import EditUserProfile from "../Pages/EditUserProfile/EditUserProfile";

import EditBusinessProfile from "../Pages/EditBusinessProfile/EditBusinessProfile";

import Subscription from "../Pages/Subscription/Subscription";
import PrivacyPolicy from "../Pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../Pages/TermsOfService/TermsOfService";
import InsurancePolicy from "../Pages/InsurancePolicy/InsurancePolicy";

import Cart from "../Pages/Cart/Cart";

import Checkout from "../Pages/Checkout/Checkout";

import Valuation from "../Pages/Valuation/Valuation";

import AddBusiness from "../Pages/AddBusiness/AddBusiness";

import Receipts from "../Pages/Receipts/Receipts";
import FAQ from "../Pages/FAQ/FAQ";

import DeleteAccount from "../Pages/DeleteAccount/DeleteAccount";

import Claim from "../Pages/Claim/Claim";

import ReviewFlow from "../Pages/ReviewFlow/ReviewFlow";

import EnterDetailPage from "../Pages/Auth/EnterDetail";

import Brand from "../Pages/Brand/Brand";

import Brands from "../Pages/Brands/Brands";
import Balenciaga from "../Pages/Balenciaga/Balenciaga";
import Chanel from "../Pages/Chanel/Chanel";
import Hermes from "../Pages/Hermes/Hermes";
import Gucci from "../Pages/Gucci/Gucci";
import LouisVuitton from "../Pages/LouisVuitton/LouisVuitton";

import BusinessProfile from "../Pages/BusinessProfile/BusinessProfile";

import AllBusinesses from "../Pages/AllBusinesses/AllBusinesses";

import RequestMoreImages from "../Pages/RequestMoreImages/RequestMoreImages";

import MyValuations from "../Pages/MyValuations/MyValuations";

import Settings from "../Pages/Settings/Settings";

import Chat from "../Pages/Chat/Chat";
import ExpeditedChat from "../Pages/ExpeditedChat/ExpeditedChat";
import NotFound from "../Pages/NotFound/NotFound";

// Scroll to top on route change so new pages open from top, not center
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

// Component to normalize pathname to lowercase
const PathNormalizer = () => {
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname;
    const normalizedPath = pathname.toLowerCase();
    if (pathname !== "/" && pathname !== normalizedPath) {
      window.history.replaceState(
        {},
        "",
        normalizedPath + location.search + location.hash,
      );
    }
  }, [location]);
  return null;
};

const AppRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAppSelector((state) => state.auth);

  const hideFooter =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/expedited-chat");

  const handleButtonClick = () => {
    console.log("Button clicked!");
  };

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Desktop menu bar: Home, Authentication, Our App, Contact us, (Chat when authenticated), Features (dropdown), Brand (dropdown), Verify Certificate. Blogs is right-side button.
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Authentication", path: "/authentication" },
    { label: "Our App", path: "/app" },
    { label: "Contact us", path: "/contact" },
    ...(token
      ? [
          { label: "Chat", path: "/chat" },
          { label: "Expedited Chat", path: "/expedited-chat" },
        ]
      : []),
    { label: "Verify Certificate", path: "/verify" },
    {
      label: "Blogs",
      path: "/blogs",
      href: "https://authenticdetective.com/blogs/",
      isButton: true,
      external: true,
    },
  ];

  // Items under Features dropdown (desktop only); mobile drawer shows all as flat links
  const featureLinks = [
    { label: "Prices", path: "/prices" },
    { label: "Subscriptions", path: "/subscription" },
    { label: "Authenticity Cards", path: "/authenticity-cards" },
    { label: "Sellers Collective", path: "/sellers-collective" },
  ];

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Authentication", path: "/authentication" },
        { label: "Our App", path: "/app" },
        { label: "Authenticity Cards", path: "/authenticity-cards" },

        { label: "Sellers Collective", path: "/sellers-collective" },
      ],
    },

    {
      title: "Support",

      links: [
        { label: "Contact Us", path: "/contact" },

        { label: "Verify Certificate", path: "/verify" },

        {
          label: "Blogs",
          path: "/blogs",
          href: "https://authenticdetective.com/blogs/",
        },
      ],
    },

    {
      title: "Legal",

      links: [
        { label: "Privacy Policy", path: "/privacy" },

        { label: "Terms of Service", path: "/terms" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-[200] bg-secondary shadow-sm overflow-visible">
        <Header
          logoText="AUTHENTIC"
          logoSubtext="Detective"
          navLinks={navLinks}
          featureLinks={featureLinks}
          signUpText="Sign In"
          showCart={true}
          showProfile={true}
          onSignUpClick={handleSignInClick}
          onCartClick={handleCartClick}
          onProfileClick={handleProfileClick}
        />
      </div>

      {/* Main Content - Routes */}
      <main className="flex-grow">
        <ScrollToTop />
        <PathNormalizer />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/authentication" element={<Authentication />} />

          <Route path="/app" element={<OurApp />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/verify" element={<Verify />} />

          <Route path="/authenticity-cards" element={<Pricing />} />
          <Route path="/prices" element={<Prices />} />

          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />

          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/forget-password" element={<ForgetPasswordPage />} />

          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <UpdatePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="/date-range" element={<DateRangePage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditUserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-business"
            element={
              <ProtectedRoute>
                <EditBusinessProfile />
              </ProtectedRoute>
            }
          />

          {/* Subscription page should be accessible to guests as well as logged-in users */}
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscriptions" element={<Navigate to="/subscription" replace />} />

          {/* Cart should be accessible to guests so unauthenticated users can complete purchases */}
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/valuation" element={<Valuation />} />

          <Route
            path="/valuations"
            element={
              <ProtectedRoute>
                <MyValuations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-business"
            element={
              <ProtectedRoute>
                <AddBusiness />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <Receipts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delete-profile"
            element={
              <ProtectedRoute>
                <DeleteAccount />
              </ProtectedRoute>
            }
          />

          <Route
            path="/claim"
            element={
              <ProtectedRoute>
                <Claim />
              </ProtectedRoute>
            }
          />

          <Route
            path="/review-flow"
            element={
              <ProtectedRoute>
                <ReviewFlow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedited-chat"
            element={
              <ProtectedRoute>
                <ExpeditedChat />
              </ProtectedRoute>
            }
          />

          {/* Enter Detail (authenticity cards) should be accessible to guests as well as logged-in users */}
          <Route path="/enter-detail" element={<EnterDetailPage />} />

          <Route path="/brands" element={<Brands />} />
          <Route path="/brand/balenciaga" element={<Balenciaga />} />
          <Route path="/brand/chanel" element={<Chanel />} />
          <Route path="/brand/hermes" element={<Hermes />} />
          <Route path="/brand/gucci" element={<Gucci />} />
          <Route path="/brand/louis-vuitton" element={<LouisVuitton />} />
          <Route path="/brand/:brandName" element={<Brand />} />
          <Route
            path="/business-profile/:slugOrId"
            element={<BusinessProfile />}
          />
          <Route path="/reviewer/:id" element={<ReviewerProfile />} />
          <Route path="/sellers-collective" element={<AllBusinesses />} />
          <Route
            path="/all-businesses"
            element={<Navigate to="/sellers-collective" replace />}
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/add-on-terms" element={<InsurancePolicy />} />
          <Route
            path="/insurance-policy"
            element={<Navigate to="/add-on-terms" replace />}
          />
          <Route path="/request-more-images" element={<RequestMoreImages />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/blogs"
            element={
              <div className="p-8 max-w-[1200px] mx-auto">
                <h1 className="text-4xl font-bold text-primary mb-4">Blogs</h1>
                <p className="text-primary">Blogs page content goes here.</p>
              </div>
            }
          />
          {/* Catch-all for case variations - redirect to lowercase */}

          <Route
            path="/Authentication"
            element={<Navigate to="/authentication" replace />}
          />

          <Route
            path="/AUTHENTICATION"
            element={<Navigate to="/authentication" replace />}
          />

          <Route path="/App" element={<Navigate to="/app" replace />} />

          <Route path="/APP" element={<Navigate to="/app" replace />} />

          <Route path="/Contact" element={<Navigate to="/contact" replace />} />

          <Route path="/CONTACT" element={<Navigate to="/contact" replace />} />

          <Route path="/Verify" element={<Navigate to="/verify" replace />} />

          <Route path="/VERIFY" element={<Navigate to="/verify" replace />} />

          <Route
            path="/pricing"
            element={<Navigate to="/authenticity-cards" replace />}
          />
          <Route
            path="/Pricing"
            element={<Navigate to="/authenticity-cards" replace />}
          />

          <Route
            path="/PRICING"
            element={<Navigate to="/authenticity-cards" replace />}
          />
          <Route path="/Prices" element={<Navigate to="/prices" replace />} />
          <Route path="/PRICES" element={<Navigate to="/prices" replace />} />

          <Route path="/SignIn" element={<Navigate to="/signin" replace />} />

          <Route path="/SIGNIN" element={<Navigate to="/signin" replace />} />
          <Route path="/Login" element={<Navigate to="/signin" replace />} />
          <Route path="/LOGIN" element={<Navigate to="/signin" replace />} />

          <Route path="/SignUp" element={<Navigate to="/signup" replace />} />

          <Route path="/SIGNUP" element={<Navigate to="/signup" replace />} />

          <Route path="/Profile" element={<Navigate to="/profile" replace />} />

          <Route path="/PROFILE" element={<Navigate to="/profile" replace />} />

          <Route path="/Reviews" element={<Navigate to="/reviews" replace />} />

          <Route path="/REVIEWS" element={<Navigate to="/reviews" replace />} />

          <Route
            path="/EditProfile"
            element={<Navigate to="/edit-profile" replace />}
          />

          <Route
            path="/EDITPROFILE"
            element={<Navigate to="/edit-profile" replace />}
          />

          <Route
            path="/editprofile"
            element={<Navigate to="/edit-profile" replace />}
          />

          <Route
            path="/EditBusiness"
            element={<Navigate to="/edit-business" replace />}
          />

          <Route
            path="/EDITBUSINESS"
            element={<Navigate to="/edit-business" replace />}
          />

          <Route
            path="/editbusiness"
            element={<Navigate to="/edit-business" replace />}
          />

          <Route
            path="/ResetPassword"
            element={<Navigate to="/reset-password" replace />}
          />

          <Route
            path="/RESETPASSWORD"
            element={<Navigate to="/reset-password" replace />}
          />

          <Route
            path="/resetpassword"
            element={<Navigate to="/reset-password" replace />}
          />

          <Route
            path="/ForgetPassword"
            element={<Navigate to="/forget-password" replace />}
          />

          <Route
            path="/FORGETPASSWORD"
            element={<Navigate to="/forget-password" replace />}
          />

          <Route
            path="/forgetpassword"
            element={<Navigate to="/forget-password" replace />}
          />

          <Route
            path="/DateRange"
            element={<Navigate to="/date-range" replace />}
          />

          <Route
            path="/DATERANGE"
            element={<Navigate to="/date-range" replace />}
          />

          <Route
            path="/daterange"
            element={<Navigate to="/date-range" replace />}
          />

          <Route
            path="/Subscription"
            element={<Navigate to="/subscription" replace />}
          />

          <Route
            path="/SUBSCRIPTION"
            element={<Navigate to="/subscription" replace />}
          />

          <Route path="/Cart" element={<Navigate to="/cart" replace />} />

          <Route path="/CART" element={<Navigate to="/cart" replace />} />

          <Route
            path="/Checkout"
            element={<Navigate to="/checkout" replace />}
          />

          <Route
            path="/CHECKOUT"
            element={<Navigate to="/checkout" replace />}
          />

          <Route
            path="/Valuation"
            element={<Navigate to="/valuation" replace />}
          />

          <Route
            path="/VALUATION"
            element={<Navigate to="/valuation" replace />}
          />

          <Route
            path="/AddBusiness"
            element={<Navigate to="/add-business" replace />}
          />

          <Route
            path="/ADDBUSINESS"
            element={<Navigate to="/add-business" replace />}
          />

          <Route
            path="/addbusiness"
            element={<Navigate to="/add-business" replace />}
          />

          <Route path="/Claim" element={<Navigate to="/claim" replace />} />

          <Route path="/CLAIM" element={<Navigate to="/claim" replace />} />

          <Route
            path="/claimbusiness"
            element={<Navigate to="/claim" replace />}
          />

          <Route
            path="/ReviewFlow"
            element={<Navigate to="/review-flow" replace />}
          />

          <Route
            path="/REVIEWFLOW"
            element={<Navigate to="/review-flow" replace />}
          />

          <Route
            path="/reviewflow"
            element={<Navigate to="/review-flow" replace />}
          />

          <Route
            path="/EnterDetail"
            element={<Navigate to="/enter-detail" replace />}
          />

          <Route
            path="/ENTERDETAIL"
            element={<Navigate to="/enter-detail" replace />}
          />

          <Route
            path="/enterdetail"
            element={<Navigate to="/enter-detail" replace />}
          />

          <Route path="/Blogs" element={<Navigate to="/blogs" replace />} />

          <Route path="/BLOGS" element={<Navigate to="/blogs" replace />} />
          <Route path="/FAQ" element={<Navigate to="/faq" replace />} />

          <Route path="/Chat" element={<Navigate to="/chat" replace />} />

          <Route path="/CHAT" element={<Navigate to="/chat" replace />} />

          <Route
            path="/Expedited-Chat"
            element={<Navigate to="/expedited-chat" replace />}
          />
          <Route
            path="/EXPEDITED-CHAT"
            element={<Navigate to="/expedited-chat" replace />}
          />

          {/* 404: any unmatched route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}

      {!hideFooter && (
        <Footer
          logoText="AUTHENTIC"
          logoSubtext="Detective"
          copyrightText="2026 © Authentic Detective"
        />
      )}
    </div>
  );
};

export default AppRoute;
