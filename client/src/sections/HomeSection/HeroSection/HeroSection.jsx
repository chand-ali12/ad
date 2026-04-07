import PropTypes from 'prop-types';
import HeroCard from '../../../components/client/HeroCard/HeroCard';

/**
 * Shield with checkmark cutout. Responsive: scales with banner text (small on mobile, 20.75×25.36px at xl).
 * Solid white shield; checkmark in banner color so it reads as cut-out.
 */
const BANNER_GOLD = '#846B1B';

const ShieldCheckIcon = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 21 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden
  >
    <path
      d="M10.5 0L21 5v8c0 7-10.5 13-10.5 13S0 20 0 13V5L10.5 0z"
      fill="#FFFFFF"
    />
    <path
      d="M5.5 13.2l3.8 3.8 7.2-8.4"
      stroke={BANNER_GOLD}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const HeroSection = ({
  backgroundImage,
  bannerText,
  bannerBoldFragment,
  bannerIcon,
  smallHeading,
  largeHeading,
  description,
  primaryButtonText,
  primaryButtonIcon,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonOnClick,
  className = "",
  overlayClassName = "",
  bannerClassName = "",
  heroCardProps = {},
}) => {
  const BannerIcon = bannerIcon || ShieldCheckIcon;

  const bannerStyle = {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'italic',
    lineHeight: '100%',
    letterSpacing: 0,
    color: 'var(--color-secondary)',
  };

  const renderBannerContent = () => {
    if (!bannerText) return null;
    if (bannerBoldFragment && bannerText.includes(bannerBoldFragment)) {
      const parts = bannerText.split(bannerBoldFragment);
      return (
        <>
          <span style={{ ...bannerStyle, fontWeight: 500 }}>{parts[0]}</span>
          <span style={{ ...bannerStyle, fontWeight: 700 }}>{bannerBoldFragment}</span>
          <span style={{ ...bannerStyle, fontWeight: 500 }}>{parts[1]}</span>
        </>
      );
    }
    return <span style={{ ...bannerStyle, fontWeight: 500 }}>{bannerText}</span>;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Top Banner - Full Width; text responsive: small on mobile, Figma 27.67px at lg+ */}
      {/* {bannerText && (
        <div className={`w-full text-secondary py-1.5 sm:py-3 px-2 sm:px-4 md:px-8 flex items-center justify-center gap-1 sm:gap-2 ${bannerClassName}`} style={{ backgroundColor: BANNER_GOLD }}>
          {BannerIcon && (
            <div className="flex items-center justify-center rounded shrink-0 w-[10px] h-[12px] min-[380px]:w-[12px] min-[380px]:h-[14px] sm:w-[14px] sm:h-[17px] md:w-[16px] md:h-[20px] lg:w-[18px] lg:h-[22px] xl:w-[20.75px] xl:h-[25.36px]">
              {typeof BannerIcon === 'function' ? (
                <BannerIcon className="w-full h-full" />
              ) : (
                BannerIcon
              )}
            </div>
          )}
          <span className="text-secondary text-[9px] min-[380px]:text-[11px] leading-tight sm:text-xs md:text-sm lg:text-base xl:text-[27.67px] xl:leading-[100%]">
            {renderBannerContent()}
          </span>
        </div>
      )} */}

      {/* Background Image Section */}
      <div className={`relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[900px]`}>
        {/* Background Image - Always visible behind content */}
        {backgroundImage ? (
          <div className="absolute inset-0 w-full h-full z-0">
            <img 
              src={backgroundImage} 
              alt="Hero background" 
              className="w-full h-full object-cover "
              onError={(e) => {
                
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full z-0 bg-gray-200" />
        )}

        {/* Content Container - Right Side Overlay */}
        <div className={`relative z-10 h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center md:justify-end px-4 sm:px-6 md:px-8 lg:pr-16 ${overlayClassName}`}>
          {/* HeroCard - Just the overlay box with content */}
          <HeroCard
            smallHeading={smallHeading}
            largeHeading={largeHeading}
            description={description}
            primaryButtonText={primaryButtonText}
            primaryButtonIcon={primaryButtonIcon}
            primaryButtonOnClick={primaryButtonOnClick}
            secondaryButtonText={secondaryButtonText}
            secondaryButtonIcon={secondaryButtonIcon}
            secondaryButtonOnClick={secondaryButtonOnClick}
            {...heroCardProps}
          />
        </div>
      </div>
    </div>
  );
};

HeroSection.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  bannerText: PropTypes.string,
  bannerBoldFragment: PropTypes.string,
  bannerIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  smallHeading: PropTypes.string,
  largeHeading: PropTypes.string,
  description: PropTypes.string,
  primaryButtonText: PropTypes.string,
  primaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  primaryButtonOnClick: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  secondaryButtonIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  secondaryButtonOnClick: PropTypes.func,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  bannerClassName: PropTypes.string,
  heroCardProps: PropTypes.object,
};

export default HeroSection;
