import PropTypes from "prop-types";
import ourAppHeroImage from "../../../assets/images/OurAppHero.png";
import googleButton from "../../../assets/images/google.png";
import appleButton from "../../../assets/images/apple.png";
import mobileInHandImage from "../../../assets/images/mobileinHand.png";

const OurAppHero = ({
  heading = "Join our app!",
  subText = "From certificate management, to our in app marketplace- Authentic Detective has something for everyone!",
  appStoreButtonsImage, // kept for backward compatibility but no longer used directly
  mobileImage: customMobileImage,
  className = "",
}) => {
  const googleButtonToUse = googleButton;
  const appleButtonToUse = appleButton;
  const mobileImageToUse = customMobileImage || mobileInHandImage;

  return (
    <div
      className={`relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={ourAppHeroImage}
          alt="Our App Hero Background"
          className="w-full h-full object-cover bg-primary mix-blend-multiply"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 h-full">
              {/* Left Side - Text and App Store Buttons */}
              <div className="flex-1 flex flex-col items-start text-secondary justify-between py-4">
                {/* Top Section: Heading and Text */}
                <div>
                  {/* Heading */}
                  {heading && (
                    <h1
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 mt-[150px] leading-tight tracking-[0.26px]"
                      style={{
                        fontFamily:
                          "Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif",
                      }}
                    >
                      {heading}
                    </h1>
                  )}

                  {/* Sub Text */}
                  {subText && (
                    <div
                      className="text-secondary/90 mb-8 max-w-lg text-base leading-[1.4] sm:text-lg sm:leading-[1.4] md:text-xl md:leading-[1.4] lg:text-[28.2px] lg:leading-[39.48px]"
                      style={{ fontWeight: 400 }}
                    >
                      From certificate management, to our in app marketplace-
                      Authentic Detective has something for everyone!
                    </div>
                  )}
                </div>

                {/* App Store Buttons Container */}
                <div className=" h-full justify-center flex flex-row flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full">
                  {/* App Store Buttons */}
                  <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 md:gap-8 w-full">
                    {/* Google Play */}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.techificent.authenticdetetctive&pli=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={googleButtonToUse}
                        alt="Get it on Google Play"
                        className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </a>
                    {/* App Store */}
                    <a
                      href="https://apps.apple.com/us/app/authentic-detective/id1659681647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={appleButtonToUse}
                        alt="Download on the App Store"
                        className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Mobile Image */}
              <div className="hidden lg:flex flex-1 items-end justify-center lg:justify-end">
                <div className="relative mt-16 sm:mt-20 md:mt-24 lg:mt-32">
                  <img
                    src={mobileImageToUse}
                    alt="Mobile App in Hand"
                    className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[450px] h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OurAppHero.propTypes = {
  heading: PropTypes.string,
  subText: PropTypes.string,
  appStoreButtonsImage: PropTypes.string,
  mobileImage: PropTypes.string,
  className: PropTypes.string,
};

export default OurAppHero;
