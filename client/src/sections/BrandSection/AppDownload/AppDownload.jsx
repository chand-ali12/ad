import PropTypes from 'prop-types';
import ourAppHeroImage from '../../../assets/images/OurAppHero.png';
import qrCodeImage from '../../../assets/images/QRcodee.png';
import googleButton from '../../../assets/images/google.png';
import appleButton from '../../../assets/images/apple.png';
import brandMblImage from '../../../assets/images/brandmbl.png';

const AppDownload = ({
  heading = "Download Now",
  subText = "Download app from Play store or App store from certificate management, to our in app marketplace- Authentic Detective has something for everyone!",
  qrCodeImage: customQrCode,
  googleButtonImage: customGoogleButton,
  appleButtonImage: customAppleButton,
  className = "",
}) => {
  const qrCodeToUse = customQrCode || qrCodeImage;
  const googleButtonToUse = customGoogleButton || googleButton;
  const appleButtonToUse = customAppleButton || appleButton;

  return (
    <section className={`relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden ${className}`}>
      {/* Background Image - Same as Our App */}
      <div className="absolute inset-0 z-0">
        <img
          src={ourAppHeroImage}
          alt="App Download Background"
          className="w-full h-full object-cover bg-primary mix-blend-multiply"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-full px-4 sm:px-5 md:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              {/* Left Side - Text, QR Code and App Store Buttons */}
              <div className="flex-1 flex flex-col items-start text-secondary w-full lg:w-auto">
                {/* Heading */}
                {heading && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight">
                    {heading}
                  </h2>
                )}

                {/* Sub Text */}
                {subText && (
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-secondary/90 mb-4 sm:mb-5 md:mb-6 lg:mb-8 leading-relaxed max-w-lg font-medium">
                    {subText}
                  </p>
                )}

                {/* QR Code and App Store Buttons */}
                <div className="flex flex-row items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 w-full sm:w-auto">
                  {/* QR Code */}
                  {/* <div className="flex-shrink-0">
                    <img
                      src={qrCodeToUse}
                      alt="QR Code"
                      className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
                    />
                  </div> */}

                  {/* App Store Buttons */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
                    {/* Google Play Button */}
                    <div className="flex-shrink-0">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.techificent.authenticdetetctive&pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={googleButtonToUse}
                          alt="Get it on Google Play"
                          className="h-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>

                    {/* Apple App Store Button */}
                    <div className="flex-shrink-0">
                      <a
                        href="https://apps.apple.com/us/app/authentic-detective/id1659681647"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={appleButtonToUse}
                          alt="Download on the App Store"
                          className="h-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Brand Mobile Image */}
              <div className="hidden md:flex flex-1 items-center justify-center lg:justify-end py-4 sm:py-6 md:py-8 lg:py-12 pr-0 sm:pr-4 md:pr-6 lg:pr-12 xl:pr-16 w-full lg:w-auto">
                <img
                  src={brandMblImage}
                  alt="Brand Mobile"
                  className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[280px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

AppDownload.propTypes = {
  heading: PropTypes.string,
  subText: PropTypes.string,
  qrCodeImage: PropTypes.string,
  googleButtonImage: PropTypes.string,
  appleButtonImage: PropTypes.string,
  className: PropTypes.string,
};

export default AppDownload;
