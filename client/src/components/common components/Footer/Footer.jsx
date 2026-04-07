import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import LogoImage from '../../../assets/images/logoIcon.png';
import FooterLogoImage from '../../../assets/images/footer-logo.jpeg';

const Footer = ({
  logoText = "AUTHENTIC",
  logoSubtext = "Detective",
  tagline = "Professional luxury goods authentication. Trust in every detail, confidence in every certificate.",
  footerLinks = [],
  copyrightText,
  socialLinks = [],
  className = "",
  logoClassName = "",
}) => {
  // Default footer links if none provided
  const defaultFooterLinks = [
    {
      title: "Product",
      links: [
        { label: "Authentication", path: "/authentication" },
        { label: "Valuation", path: "/valuation" },
        { label: "Authenticity Cards", path: "/authenticity-cards" },
        // { label: "How It Works", path: "/how-it-works" },
      ],
    },
    // {
    //   title: "Company",
    //   links: [
        // { label: "About Us", path: "/about" },
        // { label: "Careers", path: "/careers" },
        // { label: "Press", path: "/press" },
    //   ],
    // },
    {
      title: "Support",
      links: [
        // { label: "Help Center", path: "/help" },
        { label: "Contact Us", path: "/contact" },
        { label: "FAQ", path: "/faq" },
        { label: "Blog", path: "/blogs", href: "https://authenticdetective.com/blogs/" },
      
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        // { label: "Cookie Policy", path: "/cookies" },
        // { label: "GDPR", path: "/gdpr" },
        // { label: "Disclaimer", path: "/disclaimer" },
      ],
    },
    {
      image: FooterLogoImage,
      imageAlt: "Footer logo",
    }
  ];

  // Default social links if none provided
  const defaultSocialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/theauthenticdetective?mibextid=LQQJ4d&rdid=uaCl2xKqo8p7XdU6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ge4CkxxzL%2F%3Fmibextid%3DLQQJ4d#", label: "Facebook" },
    // { icon: Twitter, url: "#", label: "Twitter" },
    { icon: FaInstagram, url: "https://www.instagram.com/authenticdetective/profilecard/?igsh=MTJ2bnp6bGlkcHdnOA%3D%3D", label: "Instagram" },
    // { icon: Linkedin, url: "#", label: "LinkedIn" },
  ];

  const linksToRender = footerLinks.length > 0 ? footerLinks : defaultFooterLinks;
  const socialToRender = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  return (
    <footer className={`bg-secondary text-primary py-8 sm:py-10 md:py-12 ${className}`}>
      <div className="w-full">
        <div className="w-full px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-7 md:mb-8">
            {/* First Div: Logo Section */}
            <div className={`flex w-full md:w-1/3 flex-col ${logoClassName}`}>
              <Link to="/" className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={LogoImage}
                    alt="Authentic Detective logo"
                    className="logo-full-responsive"
                  />
                </div>
              </Link>

              {/* Tagline */}
              {tagline && (
                <p
                  className="text-xs sm:text-sm text-primary mb-4 sm:mb-5 md:mb-6 leading-relaxed max-w-xs whitespace-normal break-words tracking-[0.26px]"
                  style={{ fontFamily: "Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif" }}
                >
                  {tagline}
                </p>
              )}

              {/* Social Media Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {socialToRender.map((social, index) => {
                  const SocialIcon = social.icon;

                  // Helper function to render icon components
                  const renderIcon = (IconComponent) => {
                    if (!IconComponent) return null;

                    // Check if it's already a React element
                    if (React.isValidElement(IconComponent)) {
                      return IconComponent;
                    }

                    // Check if it's a string (image path)
                    if (typeof IconComponent === 'string') {
                      return <img src={IconComponent} alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5" />;
                    }

                    // For React components (both function and object types), use React.createElement
                    // This handles lucide-react icons which may be forwardRef components
                    try {
                      // Create props object
                      const props = {
                        size: 20, // For lucide-react
                        strokeWidth: 2, // Default stroke width for lucide-react icons
                        className: "w-4 h-4 sm:w-5 sm:h-5 text-secondary", // For react-icons and general styling
                      };

                      // Use React.createElement which works for all component types
                      return React.createElement(IconComponent, props);
                    } catch (error) {
                      console.error('Error rendering icon component:', error, IconComponent);
                      return null;
                    }
                  };

                  return (
                    <a
                      key={index}
                      href={social.url}
                      aria-label={social.label}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center text-secondary hover:bg-primary-hover transition-colors"
                    >
                      {renderIcon(SocialIcon)}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Second Div: Navigation Columns */}
            <div className="w-full md:flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {linksToRender.map((section, index) => (
                <div key={index}>
                  {section.image ? (
                    <img
                      src={section.image}
                      alt={section.imageAlt || "Footer image"}
                      className="w-full max-w-[110px] h-auto object-contain  rounded-lg"
                    />
                  ) : (
                    <>
                  {section.title && (
                    <h3 className="text-sm sm:text-base font-bold text-primary mb-3 sm:mb-4">{section.title}</h3>
                  )}
                  <ul className="space-y-0.5">
                    {section.links?.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary/70 hover:text-primary transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.path || '#'}
                            className="text-sm text-primary/70 hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 sm:pt-7 md:pt-8 flex justify-center">
            <p className="text-xs sm:text-sm text-primary">
              {copyrightText || '2025 © Authentic Detective'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  logoText: PropTypes.string,
  logoSubtext: PropTypes.string,
  tagline: PropTypes.string,
  footerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string,
        })
      ),
    })
  ),
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
      url: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  copyrightText: PropTypes.string,
  className: PropTypes.string,
  logoClassName: PropTypes.string,
};

export default Footer;