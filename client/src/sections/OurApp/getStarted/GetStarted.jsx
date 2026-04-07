import PropTypes from 'prop-types';
import SectionHeader from '../../../components/client/SectionHeader/SectionHeader';
import ourAppDownImage from '../../../assets/images/ourappdown.png';
import googleButton from '../../../assets/images/google.png';
import appleButton from '../../../assets/images/apple.png';

const GetStarted = ({
  heading = "Ready to get started?",
  subHeading = "Join thousands of users who trust Authentic Detective for their luxury authentication needs",
  googleButtonImage,
  appleButtonImage,
  className = "",
}) => {
  const googleButtonToUse = googleButtonImage || googleButton;
  const appleButtonToUse = appleButtonImage || appleButton;
  
  // Split subheading at "for" to put it on second line
  const subHeadingParts = subHeading?.split(' for ') || [];

  return (
    <div className={`relative w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={ourAppDownImage}
          alt="Get Started Background"
          className="w-full h-full object-fill bg-primary mix-blend-multiply"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-center justify-center py-8 sm:py-10 md:py-12">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Section Header */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <SectionHeader
                heading={heading}
                subHeading={
                  <span>
                    {subHeadingParts[0]} <br className="hidden sm:block" /> for {subHeadingParts[1]}
                  </span>
                }
                headingColor="secondary"
                subHeadingColor="secondary"
                className="text-center"
                headingClassName="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                subHeadingClassName="text-center text-sm sm:text-base md:text-lg lg:text-xl"
              />
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
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
                    className="h-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity"
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
                    className="h-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GetStarted.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  googleButtonImage: PropTypes.string,
  appleButtonImage: PropTypes.string,
  className: PropTypes.string,
};

export default GetStarted;
